const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export default function BookingStatus({ status }) {
  return <span className={`booking-status booking-status--${status}`}>{LABELS[status] || status}</span>;
}

