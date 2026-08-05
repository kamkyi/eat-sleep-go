import { Navigate, useLocation } from 'react-router-dom';
import { ErrorState, LoadingState } from './UI';
import { useAuth } from '../context/AuthContext';

function GuardState({ children, adminOnly = false }) {
  const { user, profile, loading, authError, configurationError } = useAuth();
  const location = useLocation();

  if (loading) return <section className="section"><div className="container"><LoadingState label="Restoring your account…" /></div></section>;
  if (configurationError) return <section className="section"><div className="container"><ErrorState title="Supabase is not configured" message={configurationError} /></div></section>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (authError && !profile) return <section className="section"><div className="container"><ErrorState title="Profile unavailable" message={authError} /></div></section>;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return children;
}

export function ProtectedRoute({ children }) {
  return <GuardState>{children}</GuardState>;
}

export function AdminRoute({ children }) {
  return <GuardState adminOnly>{children}</GuardState>;
}

