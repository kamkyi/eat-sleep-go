import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigurationError } from '../lib/supabase';

const AuthContext = createContext(null);

function friendlyAuthError(error, fallback) {
  if (!error) return fallback;
  if (error.message === 'Invalid login credentials') return 'The email or password is incorrect.';
  if (error.message?.toLowerCase().includes('email not confirmed')) return 'Please confirm your email address before signing in.';
  if (error.message?.toLowerCase().includes('already registered')) return 'An account with this email already exists.';
  return error.message || fallback;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, role, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Supabase profile query failed.', error);
      throw new Error('We could not load your account profile.');
    }
    if (!data) throw new Error('Your account profile is missing. Ask an administrator to repair it in Supabase.');
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;

      if (error) {
        setAuthError(friendlyAuthError(error, 'We could not restore your session.'));
        setLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user || null);

      if (data.session?.user) {
        try {
          await loadProfile(data.session.user.id);
        } catch (profileError) {
          if (active) setAuthError(friendlyAuthError(profileError, 'We could not load your profile.'));
        }
      } else {
        setProfile(null);
      }

      if (active) setLoading(false);
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setAuthError(null);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Supabase recommends keeping the auth callback synchronous. Defer the
      // profile query so it cannot contend with the auth client lock.
      setTimeout(async () => {
        if (!active) return;
        try {
          await loadProfile(nextSession.user.id);
        } catch (profileError) {
          if (active) setAuthError(friendlyAuthError(profileError, 'We could not load your profile.'));
        } finally {
          if (active) setLoading(false);
        }
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const register = useCallback(async ({ email, password, fullName, phone }) => {
    if (!supabase) throw new Error(supabaseConfigurationError);
    setAuthError(null);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${process.env.PUBLIC_URL || ''}/`,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) throw new Error(friendlyAuthError(error, 'Registration failed.'));

    let nextProfile = null;
    if (data.session?.user) nextProfile = await loadProfile(data.session.user.id);
    return { ...data, profile: nextProfile };
  }, [loadProfile]);

  const login = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error(supabaseConfigurationError);
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw new Error(friendlyAuthError(error, 'Sign in failed.'));
    const nextProfile = await loadProfile(data.user.id);
    return { ...data, profile: nextProfile };
  }, [loadProfile]);

  const logout = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(friendlyAuthError(error, 'Sign out failed.'));
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return loadProfile(user.id);
  }, [loadProfile, user]);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    role: profile?.role || null,
    isAdmin: profile?.role === 'admin',
    loading,
    authError,
    configurationError: supabaseConfigurationError,
    register,
    login,
    logout,
    refreshProfile,
  }), [session, user, profile, loading, authError, register, login, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
