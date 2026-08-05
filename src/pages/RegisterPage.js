import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const emptyForm = { fullName: '', phone: '', email: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { user, profile, loading, register, configurationError } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && user && profile) {
    return <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/booking'} replace />;
  }

  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  const validate = () => {
    if (!form.fullName.trim()) return 'Enter your full name.';
    if (!form.phone.trim()) return 'Enter your phone number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 8) return 'Use a password with at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'The passwords do not match.';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    setNotice('');
    const validationError = validate();
    if (validationError) return setError(validationError);

    setError('');
    setSubmitting(true);
    try {
      const result = await register(form);
      if (result.session) {
        navigate(result.profile?.role === 'admin' ? '/admin/dashboard' : '/booking', { replace: true });
      } else {
        setForm(emptyForm);
        setNotice('Account created. Check your email for the confirmation link, then sign in.');
      }
    } catch (registrationError) {
      setError(registrationError.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section auth-page">
      <div className="container auth-card">
        <div className="auth-card__intro">
          <p className="eyebrow">Your account</p>
          <h1>Book, track, and travel with confidence.</h1>
          <p>Every new account starts with the customer role. Your booking history stays connected to your account.</p>
        </div>
        <form className="auth-form" onSubmit={submit} noValidate>
          <UserPlus aria-hidden="true" />
          <h2>Register</h2>
          {configurationError && <div className="inline-alert inline-alert--error" role="alert">{configurationError}</div>}
          {error && <div className="inline-alert inline-alert--error" role="alert">{error}</div>}
          {notice && <div className="inline-alert inline-alert--success" role="status">{notice} <Link to="/login">Go to login</Link>.</div>}
          <label>Full name<input name="fullName" autoComplete="name" value={form.fullName} onChange={update} disabled={submitting} /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} disabled={submitting} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" value={form.email} onChange={update} disabled={submitting} /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} disabled={submitting} /><small>At least 8 characters.</small></label>
          <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update} disabled={submitting} /></label>
          <button className="button button--primary button--wide" type="submit" disabled={submitting || Boolean(configurationError)}>{submitting ? 'Creating account…' : 'Create account'}</button>
          <p className="auth-form__switch">Already registered? <Link to="/login">Sign in</Link>.</p>
        </form>
      </div>
    </section>
  );
}

