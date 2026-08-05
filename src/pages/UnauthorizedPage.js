import { ShieldX } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/UI';

export default function UnauthorizedPage() {
  return (
    <section className="section">
      <div className="container access-denied">
        <ShieldX size={52} aria-hidden="true" />
        <p className="eyebrow">Access denied</p>
        <h1>This area is for administrators.</h1>
        <p>Your account is signed in, but its profile does not have the admin role.</p>
        <div><PrimaryButton to="/booking">Make a booking</PrimaryButton><SecondaryButton to="/bookings">My bookings</SecondaryButton></div>
      </div>
    </section>
  );
}

