import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, MapPin, XCircle } from 'lucide-react';
import BookingStatus from '../components/BookingStatus';
import { EmptyState, ErrorState, LoadingState, PrimaryButton } from '../components/UI';
import { cancelMyBooking, getMyBookings } from '../lib/bookingService';

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [notice, setNotice] = useState('');

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBookings(await getMyBookings());
    } catch (_error) {
      setError('We could not load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const cancel = async (bookingId) => {
    setCancellingId(bookingId);
    setNotice('');
    setError('');
    try {
      const updated = await cancelMyBooking(bookingId);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? updated : booking));
      setNotice('Your pending booking was cancelled.');
    } catch (_error) {
      setError('The booking could not be cancelled. It may no longer be pending.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section className="section bookings-page">
      <div className="container">
        <div className="section-top">
          <div className="section-heading"><p className="eyebrow">Your journeys</p><h1>My bookings</h1><p className="section-heading__description">Review each request and follow its current status.</p></div>
          <PrimaryButton to="/booking">Create a booking</PrimaryButton>
        </div>
        {notice && <div className="inline-alert inline-alert--success" role="status">{notice}</div>}
        {error && <ErrorState title="Booking request unavailable" message={error} action={<button className="button button--secondary" type="button" onClick={loadBookings}>Try again</button>} />}
        {loading ? <LoadingState label="Loading your bookings…" /> : !error && bookings.length === 0 ? <EmptyState title="No bookings yet" message="Choose a car and send your first booking request." action={<PrimaryButton to="/booking">Book a car</PrimaryButton>} /> : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card__heading"><div><span className="booking-card__id">#{booking.id}</span><h2>{booking.car_label}</h2></div><BookingStatus status={booking.status} /></div>
                <div className="booking-card__route">
                  <div><CalendarDays aria-hidden="true" /><span><small>Pickup</small><strong>{formatDateTime(booking.pickup_at)}</strong></span></div>
                  <div><MapPin aria-hidden="true" /><span><small>From</small><strong>{booking.pickup_location}</strong></span></div>
                  <div><CalendarDays aria-hidden="true" /><span><small>Return</small><strong>{formatDateTime(booking.return_at)}</strong></span></div>
                  <div><MapPin aria-hidden="true" /><span><small>To</small><strong>{booking.return_location}</strong></span></div>
                </div>
                {booking.customer_notes && <p className="booking-card__notes"><strong>Notes:</strong> {booking.customer_notes}</p>}
                <footer><span>Created {formatDateTime(booking.created_at)}</span>{booking.status === 'pending' && <button className="button button--secondary" type="button" onClick={() => cancel(booking.id)} disabled={cancellingId === booking.id}><XCircle size={17} aria-hidden="true" />{cancellingId === booking.id ? 'Cancelling…' : 'Cancel request'}</button>}</footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

