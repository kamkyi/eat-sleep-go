import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cars } from '../data/cars';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../lib/bookingService';
import { PrimaryButton, SecondaryButton } from './UI';
import { useI18n } from '../i18n';

const initialForm = { name: '', email: '', phone: '', carId: '', pickupDate: '', pickupTime: '09:00', returnDate: '', returnTime: '09:00', pickupLocation: '', returnLocation: '', message: '', terms: false };
const locations = ['Bangkok', 'Chiang Mai', 'Phuket'];

export default function BookingForm({ initialCarId = '' }) {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ ...initialForm, carId: initialCarId });
  const [errors, setErrors] = useState({});
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    if (!profile && !user) return;
    setForm((current) => ({
      ...current,
      name: current.name || profile?.full_name || '',
      email: current.email || profile?.email || user?.email || '',
      phone: current.phone || profile?.phone || '',
    }));
  }, [profile, user]);

  const selectedCar = cars.find((car) => car.id === form.carId);
  const estimate = useMemo(() => {
    if (!form.pickupDate || !form.returnDate) return { days: 0, total: 0 };
    const start = new Date(`${form.pickupDate}T${form.pickupTime || '00:00'}`);
    const end = new Date(`${form.returnDate}T${form.returnTime || '00:00'}`);
    const days = Math.ceil((end - start) / 86400000);
    return { days: Math.max(0, days), total: days > 0 && selectedCar ? days * selectedCar.pricePerDay : 0 };
  }, [form.pickupDate, form.pickupTime, form.returnDate, form.returnTime, selectedCar]);

  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.type === 'checkbox' ? target.checked : target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t('booking.errorName');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('booking.errorEmail');
    if (!form.phone.trim()) next.phone = t('booking.errorPhone');
    if (!selectedCar || !selectedCar.available) next.carId = t('booking.errorCar');
    if (!form.pickupDate) next.pickupDate = t('booking.errorPickupDate');
    if (!form.pickupTime) next.pickupTime = t('booking.errorPickupTime');
    if (!form.returnDate) next.returnDate = t('booking.errorReturnDate');
    if (!form.returnTime) next.returnTime = t('booking.errorReturnTime');
    if (form.pickupDate && form.returnDate && form.pickupTime && form.returnTime && estimate.days < 1) next.returnDate = t('booking.errorReturnBefore');
    if (!form.pickupLocation) next.pickupLocation = t('booking.errorPickupLocation');
    if (!form.returnLocation) next.returnLocation = t('booking.errorReturnLocation');
    if (!form.terms) next.terms = t('booking.errorTerms');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmissionError('');
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const booking = await createBooking({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        carId: selectedCar.id,
        carLabel: `${selectedCar.year} ${selectedCar.brand} ${selectedCar.model}`,
        carDetails: {
          brand: selectedCar.brand,
          model: selectedCar.model,
          year: selectedCar.year,
          type: selectedCar.type,
          transmission: selectedCar.transmission,
          price_per_day: selectedCar.pricePerDay,
        },
        pickupAt: new Date(`${form.pickupDate}T${form.pickupTime}`).toISOString(),
        returnAt: new Date(`${form.returnDate}T${form.returnTime}`).toISOString(),
        pickupLocation: form.pickupLocation,
        returnLocation: form.returnLocation,
        customerNotes: form.message,
      });
      setSubmittedBooking(booking);
    } catch (error) {
      setSubmissionError(error.message?.startsWith('Please sign in') ? error.message : t('booking.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const dayLabel = (count) => t(count === 1 ? 'booking.daysOne' : 'booking.days', { count });

  if (submittedBooking) return (
    <div className="confirmation-card" role="status">
      <CheckCircle2 size={54} aria-hidden="true" />
      <p className="eyebrow">{t('booking.successEyebrow')}</p>
      <h2>{t('booking.successTitle', { name: form.name.split(' ')[0] })}</h2>
      <p>{t('booking.successText')}</p>
      <div className="confirmation-card__summary"><span>{selectedCar?.brand} {selectedCar?.model}</span><strong>{dayLabel(estimate.days)} · ฿{estimate.total.toLocaleString()}</strong></div>
      <p className="booking-reference">{t('booking.reference')}: <strong>{submittedBooking.id}</strong></p>
      <div className="confirmation-card__actions"><Link className="button button--primary" to="/bookings">{t('booking.viewBookings')}</Link><SecondaryButton type="button" onClick={() => { setSubmittedBooking(null); setForm({ ...initialForm, name: profile?.full_name || '', email: profile?.email || user?.email || '', phone: profile?.phone || '', carId: initialCarId }); }}>{t('booking.successAgain')}</SecondaryButton></div>
    </div>
  );

  const today = new Date().toISOString().split('T')[0];
  const fieldError = (name) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  const locationOptions = <>{locations.map((location) => <option key={location} value={location}>{t(`carData.location.${location}`)}</option>)}<option value="other">{t('booking.locationOther')}</option></>;

  return (
    <form className="booking-form" onSubmit={submit} noValidate>
      {submissionError && <div className="inline-alert inline-alert--error" role="alert">{submissionError}</div>}
      <div className="form-section"><div className="form-section__heading"><span>01</span><div><h2>{t('booking.section1')}</h2><p>{t('booking.section1Hint')}</p></div></div><div className="form-grid">
        <label>{t('booking.fullName')}<input name="name" value={form.name} onChange={update} placeholder={t('booking.fullNamePlaceholder')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{fieldError('name')}</label>
        <label>{t('booking.email')}<input name="email" type="email" value={form.email} onChange={update} placeholder={t('booking.emailPlaceholder')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{fieldError('email')}</label>
        <label className="span-2">{t('booking.phone')}<input name="phone" type="tel" value={form.phone} onChange={update} placeholder={t('booking.phonePlaceholder')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />{fieldError('phone')}</label>
      </div></div>
      <div className="form-section"><div className="form-section__heading"><span>02</span><div><h2>{t('booking.section2')}</h2><p>{t('booking.section2Hint')}</p></div></div><div className="form-grid">
        <label className="span-2">{t('booking.vehicle')}<select name="carId" value={form.carId} onChange={update} aria-invalid={Boolean(errors.carId)} aria-describedby={errors.carId ? 'carId-error' : undefined}><option value="">{t('booking.vehiclePlaceholder')}</option>{cars.filter((car) => car.available).map((car) => <option key={car.id} value={car.id}>{t('booking.vehicleOption', { year: car.year, brand: car.brand, model: car.model, price: car.pricePerDay })}</option>)}</select>{fieldError('carId')}</label>
        <label>{t('booking.pickupDate')}<input name="pickupDate" type="date" min={today} value={form.pickupDate} onChange={update} aria-invalid={Boolean(errors.pickupDate)} aria-describedby={errors.pickupDate ? 'pickupDate-error' : undefined} />{fieldError('pickupDate')}</label>
        <label>{t('booking.pickupTime')}<input name="pickupTime" type="time" value={form.pickupTime} onChange={update} aria-invalid={Boolean(errors.pickupTime)} aria-describedby={errors.pickupTime ? 'pickupTime-error' : undefined} />{fieldError('pickupTime')}</label>
        <label>{t('booking.returnDate')}<input name="returnDate" type="date" min={form.pickupDate || today} value={form.returnDate} onChange={update} aria-invalid={Boolean(errors.returnDate)} aria-describedby={errors.returnDate ? 'returnDate-error' : undefined} />{fieldError('returnDate')}</label>
        <label>{t('booking.returnTime')}<input name="returnTime" type="time" value={form.returnTime} onChange={update} aria-invalid={Boolean(errors.returnTime)} aria-describedby={errors.returnTime ? 'returnTime-error' : undefined} />{fieldError('returnTime')}</label>
        <label>{t('booking.pickupLocation')}<select name="pickupLocation" value={form.pickupLocation} onChange={update} aria-invalid={Boolean(errors.pickupLocation)} aria-describedby={errors.pickupLocation ? 'pickupLocation-error' : undefined}><option value="">{t('booking.locationPlaceholder')}</option>{locationOptions}</select>{fieldError('pickupLocation')}</label>
        <label>{t('booking.returnLocation')}<select name="returnLocation" value={form.returnLocation} onChange={update} aria-invalid={Boolean(errors.returnLocation)} aria-describedby={errors.returnLocation ? 'returnLocation-error' : undefined}><option value="">{t('booking.locationPlaceholder')}</option>{locationOptions}</select>{fieldError('returnLocation')}</label>
        <label className="span-2">{t('booking.message')}<textarea name="message" value={form.message} onChange={update} rows="4" placeholder={t('booking.messagePlaceholder')} /></label>
      </div></div>
      <div className="estimate-card"><div><CalendarDays aria-hidden="true" /><span><small>{t('booking.estimateDuration')}</small><strong>{estimate.days ? dayLabel(estimate.days) : '—'}</strong></span></div><div><small>{t('booking.estimateTotal')}</small><strong>{estimate.total ? `฿${estimate.total.toLocaleString()}` : '—'}</strong></div></div>
      <p className="estimate-note"><Info size={16} aria-hidden="true" />{t('booking.estimateNote')}</p>
      <label className="checkbox-label"><input type="checkbox" name="terms" checked={form.terms} onChange={update} /><span>{t('booking.terms')}</span></label>{fieldError('terms')}
      <PrimaryButton type="submit" className="button--wide" disabled={submitting}>{submitting ? t('booking.submitting') : t('booking.submit')}</PrimaryButton>
    </form>
  );
}
