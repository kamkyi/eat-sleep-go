import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

const missingVariables = [
  ['REACT_APP_SUPABASE_URL', supabaseUrl],
  ['REACT_APP_SUPABASE_PUBLISHABLE_KEY', supabasePublishableKey],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingVariables.length > 0) {
  throw new Error(
    `Supabase configuration error: missing ${missingVariables.join(
      ', '
    )}. Add the missing variable${
      missingVariables.length === 1 ? '' : 's'
    } to .env.local and restart the application.`
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
