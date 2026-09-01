import { useSearchParams } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { useI18n } from '../i18n';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { t } = useI18n();

  const location = searchParams.get('location') || '';
  const prefill = {
    pickupDate: searchParams.get('pickup') || '',
    returnDate: searchParams.get('dropoff') || '',
    pickupLocation: location,
    returnLocation: location,
  };

  return <section className="section booking-page"><div className="container booking-layout"><BookingForm initialCarId={searchParams.get('car') || ''} initialValues={prefill} /><aside className="booking-aside"><div><ShieldCheck aria-hidden="true" /><h2>{t('booking.asideTitle1')}</h2><p>{t('booking.asideText1')}</p></div><div><LockKeyhole aria-hidden="true" /><h2>{t('booking.asideTitle2')}</h2><p>{t('booking.asideText2')}</p></div><p className="booking-aside__note">{t('booking.asideNote')} <a href="#/contact">{t('booking.asideNoteLink')}</a> {t('booking.asideNoteEnd')}</p></aside></div></section>;
}
