import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

const missingVariables = [
  ['REACT_APP_SUPABASE_URL', supabaseUrl],
  ['REACT_APP_SUPABASE_PUBLISHABLE_KEY', supabasePublishableKey],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

let configurationError = missingVariables.length
  ? `Supabase configuration error: missing ${missingVariables.join(', ')}. Add the missing variable${missingVariables.length === 1 ? '' : 's'} to .env.local and restart the application.`
  : null;

if (!configurationError) {
  try {
    const parsedUrl = new URL(supabaseUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Unsupported protocol.');
  } catch (_error) {
    configurationError = 'Supabase configuration error: REACT_APP_SUPABASE_URL must be a valid HTTP or HTTPS project URL.';
  }
}

export const supabaseConfigurationError = configurationError;
export const isSupabaseConfigured = !configurationError;

if (supabaseConfigurationError && process.env.NODE_ENV === 'development') {
  // The same message is rendered in the application; this makes setup failures
  // immediately visible to a developer looking at the browser console.
  console.error(supabaseConfigurationError);
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) throw new Error(supabaseConfigurationError);
  return supabase;
}
