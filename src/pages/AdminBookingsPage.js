import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleX, Edit3, Flag, Search, UserRound } from 'lucide-react';
import BookingStatus from '../components/BookingStatus';
import { EmptyState, ErrorState, LoadingState, PrimaryButton, SecondaryButton } from '../components/UI';
import { cars } from '../data/cars';
import { getAllBookingsForAdmin, updateBookingAsAdmin } from '../lib/bookingService';

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function toLocalInput(value) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function AdminBookingCard({ booking, busy, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [form, setForm] = useState(() => ({
    customer_name: booking.customer_name,
    customer_email: booking.customer_email,
    customer_phone: booking.customer_phone,
    car_id: booking.car_id,
    car_label: booking.car_label,
    pickup_at: toLocalInput(booking.pickup_at),
    return_at: toLocalInput(booking.return_at),
    pickup_location: booking.pickup_location,
    return_location: booking.return_location,
    customer_notes: booking.customer_notes || '',
  }));

  useEffect(() => {
    setForm({
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      car_id: booking.car_id,
      car_label: booking.car_label,
      pickup_at: toLocalInput(booking.pickup_at),
      return_at: toLocalInput(booking.return_at),
      pickup_location: booking.pickup_location,
      return_location: booking.return_location,
      customer_notes: booking.customer_notes || '',
    });
  }, [booking]);

  const updateField = ({ target }) => {
    if (target.name === 'car_id') {
      const car = cars.find((item) => item.id === target.value);
      setForm((current) => ({
        ...current,
        car_id: target.value,
        car_label: car ? `${car.year} ${car.brand} ${car.model}` : current.car_label,
      }));
      return;
    }
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const save = async (event) => {
    event.preventDefault();
    setEditError('');
    const pickup = new Date(form.pickup_at);
    const returnDate = new Date(form.return_at);
    if (!form.customer_name.trim() || !form.customer_email.trim() || !form.customer_phone.trim()) return setEditError('Customer contact details are required.');
    if (!form.car_id || !form.car_label.trim()) return setEditError('Select a car.');
    if (!form.pickup_location.trim() || !form.return_location.trim()) return setEditError('Pickup and return locations are required.');
    if (!(returnDate > pickup)) return setEditError('Return must be after pickup.');

    const selectedCar = cars.find((item) => item.id === form.car_id);
    const success = await onUpdate(booking.id, {
      ...form,
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim(),
      customer_phone: form.customer_phone.trim(),
      pickup_at: pickup.toISOString(),
      return_at: returnDate.toISOString(),
      pickup_location: form.pickup_location.trim(),
      return_location: form.return_location.trim(),
      customer_notes: form.customer_notes.trim() || null,
      car_details: selectedCar ? {
        brand: selectedCar.brand,
        model: selectedCar.model,
        year: selectedCar.year,
        price_per_day: selectedCar.pricePerDay,
      } : booking.car_details,
    }, 'Booking details updated.');
    if (success) setEditing(false);
  };

  const updateStatus = (status, message) => onUpdate(booking.id, { status }, message);

  return (
    <article className="admin-booking-card">
      <header>
        <div><span className="booking-card__id">Booking ID</span><h2>{booking.id}</h2></div>
        <BookingStatus status={booking.status} />
      </header>
      <div className="admin-booking-card__summary">
        <div><small>Customer</small><strong>{booking.customer_name}</strong><span>{booking.customer_email} · {booking.customer_phone}</span></div>
        <div><small>Selected car</small><strong>{booking.car_label}</strong><span>Car ID: {booking.car_id}</span></div>
        <div><small>Pickup</small><strong>{formatDateTime(booking.pickup_at)}</strong><span>{booking.pickup_location}</span></div>
        <div><small>Return</small><strong>{formatDateTime(booking.return_at)}</strong><span>{booking.return_location}</span></div>
      </div>
      <div className="booking-creator"><UserRound size={18} aria-hidden="true" /><span><small>Created by account</small><strong>{booking.customer?.full_name || 'Profile name not provided'}</strong> · {booking.customer?.email || 'No profile email'} · {booking.customer?.phone || 'No profile phone'}</span></div>
      <details className="booking-details">
        <summary>View full booking details</summary>
        <dl>
          <div><dt>Booking ID</dt><dd>{booking.id}</dd></div>
          <div><dt>Customer full name</dt><dd>{booking.customer_name}</dd></div>
          <div><dt>Customer email</dt><dd>{booking.customer_email}</dd></div>
          <div><dt>Customer phone</dt><dd>{booking.customer_phone}</dd></div>
          <div><dt>Selected car</dt><dd>{booking.car_label} ({booking.car_id})</dd></div>
          <div><dt>Pickup</dt><dd>{formatDateTime(booking.pickup_at)} · {booking.pickup_location}</dd></div>
          <div><dt>Return</dt><dd>{formatDateTime(booking.return_at)} · {booking.return_location}</dd></div>
          <div><dt>Status</dt><dd>{booking.status}</dd></div>
          <div><dt>Customer notes</dt><dd>{booking.customer_notes || '—'}</dd></div>
          <div><dt>Booking created</dt><dd>{formatDateTime(booking.created_at)}</dd></div>
        </dl>
      </details>
      {editing && (
        <form className="admin-edit-form" onSubmit={save}>
          <h3>Edit booking information</h3>
          {editError && <div className="inline-alert inline-alert--error" role="alert">{editError}</div>}
          <div className="form-grid">
            <label>Customer full name<input name="customer_name" value={form.customer_name} onChange={updateField} /></label>
            <label>Customer email<input name="customer_email" type="email" value={form.customer_email} onChange={updateField} /></label>
            <label>Customer phone<input name="customer_phone" type="tel" value={form.customer_phone} onChange={updateField} /></label>
            <label>Selected car<select name="car_id" value={form.car_id} onChange={updateField}>{cars.map((car) => <option key={car.id} value={car.id}>{car.year} {car.brand} {car.model}</option>)}</select></label>
            <label>Pickup date and time<input name="pickup_at" type="datetime-local" value={form.pickup_at} onChange={updateField} /></label>
            <label>Return date and time<input name="return_at" type="datetime-local" value={form.return_at} onChange={updateField} /></label>
            <label>Pickup location<input name="pickup_location" value={form.pickup_location} onChange={updateField} /></label>
            <label>Return location<input name="return_location" value={form.return_location} onChange={updateField} /></label>
            <label className="span-2">Customer notes<textarea name="customer_notes" rows="3" value={form.customer_notes} onChange={updateField} /></label>
          </div>
          <div className="admin-edit-form__actions"><button className="button button--primary" type="submit" disabled={busy}>Save changes</button><button className="button button--secondary" type="button" onClick={() => setEditing(false)} disabled={busy}>Close editor</button></div>
        </form>
      )}
      <footer className="admin-booking-card__actions">
        <button className="button button--secondary" type="button" onClick={() => setEditing((value) => !value)} disabled={busy}><Edit3 size={17} aria-hidden="true" />Edit details</button>
        {booking.status === 'pending' && <button className="button button--primary" type="button" onClick={() => updateStatus('confirmed', 'Booking confirmed.')} disabled={busy}><CheckCircle2 size={17} aria-hidden="true" />Confirm</button>}
        {['pending', 'confirmed'].includes(booking.status) && <button className="button button--danger" type="button" onClick={() => updateStatus('cancelled', 'Booking cancelled.')} disabled={busy}><CircleX size={17} aria-hidden="true" />Cancel</button>}
        {booking.status === 'confirmed' && <button className="button button--primary" type="button" onClick={() => updateStatus('completed', 'Booking marked completed.')} disabled={busy}><Flag size={17} aria-hidden="true" />Complete</button>}
      </footer>
    </article>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBookings(await getAllBookingsForAdmin());
    } catch (_error) {
      setError('All bookings could not be loaded. Confirm this account has profiles.role = admin and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (status !== 'all' && booking.status !== status) return false;
      if (!term) return true;
      return [
        booking.id,
        booking.customer_name,
        booking.customer_email,
        booking.customer_phone,
        booking.customer?.full_name,
        booking.customer?.email,
        booking.customer?.phone,
      ].some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [bookings, search, status]);

  const updateBooking = async (bookingId, changes, message) => {
    setBusyId(bookingId);
    setError('');
    setNotice('');
    try {
      const updated = await updateBookingAsAdmin(bookingId, changes);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? updated : booking));
      setNotice(message);
      return true;
    } catch (_error) {
      setError('The booking could not be updated. Check the dates and current status, then try again.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="section admin-dashboard">
      <div className="container">
        <div className="section-top">
          <div className="section-heading"><p className="eyebrow">Operations</p><h1>Admin booking dashboard</h1><p className="section-heading__description">Review every request, see who created it, and manage the booking lifecycle.</p></div>
          <PrimaryButton to="/booking">Create booking</PrimaryButton>
        </div>
        <div className="admin-toolbar">
          <label><Search size={18} aria-hidden="true" /><span>Search bookings</span><input type="search" placeholder="Name, email, phone, or booking ID" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option></select></label>
        </div>
        {notice && <div className="inline-alert inline-alert--success" role="status">{notice}</div>}
        {error && <ErrorState title="Admin action unavailable" message={error} action={<SecondaryButton type="button" onClick={loadBookings}>Reload bookings</SecondaryButton>} />}
        {loading ? <LoadingState label="Loading all bookings…" /> : !error && filteredBookings.length === 0 ? <EmptyState title={bookings.length ? 'No bookings match' : 'No bookings yet'} message={bookings.length ? 'Change the search or status filter.' : 'New customer requests will appear here.'} /> : (
          <div className="admin-booking-list">
            {filteredBookings.map((booking) => <AdminBookingCard key={booking.id} booking={booking} busy={busyId === booking.id} onUpdate={updateBooking} />)}
          </div>
        )}
      </div>
    </section>
  );
}
