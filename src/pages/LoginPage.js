import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, profile, loading, login, configurationError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!loading && user && profile) {
    return <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/booking'} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!form.password) return setError('Enter your password.');

    setSubmitting(true);
    try {
      const result = await login(form);
      const requestedPath = location.state?.from?.pathname;
      const destination = result.profile?.role === 'admin'
        ? '/admin/dashboard'
        : requestedPath && !requestedPath.startsWith('/admin')
          ? requestedPath
          : '/booking';
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Sign in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section auth-page">
      <div className="container auth-card">
        <div className="auth-card__intro">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to continue your journey.</h1>
          <p>Manage your requests, check booking status, or continue to the admin dashboard.</p>
        </div>
        <form className="auth-form" onSubmit={submit} noValidate>
          <LogIn aria-hidden="true" />
          <h2>Login</h2>
          {configurationError && <div className="inline-alert inline-alert--error" role="alert">{configurationError}</div>}
          {error && <div className="inline-alert inline-alert--error" role="alert">{error}</div>}
          <label>Email address<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} disabled={submitting} /></label>
          <label>Password<input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} disabled={submitting} /></label>
          <button className="button button--primary button--wide" type="submit" disabled={submitting || Boolean(configurationError)}>{submitting ? 'Signing in…' : 'Sign in'}</button>
          <p className="auth-form__switch">New here? <Link to="/register">Create a customer account</Link>.</p>
        </form>
      </div>
    </section>
  );
}

