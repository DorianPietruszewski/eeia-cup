import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return browserClient;
}

export function getPlayerNameFromEmail(email?: string | null) {
  if (!email) {
    return 'Gracz';
  }

  const [name] = email.split('@');

  if (!name) {
    return 'Gracz';
  }

  return name;
}

type SupabaseUserLike = {
  email?: string | null;
  user_metadata?: {
    nickname?: string | null;
  } | null;
};

export function getPlayerDisplayNameFromUser(user?: SupabaseUserLike | null) {
  const nickname = user?.user_metadata?.nickname?.trim();

  if (nickname) {
    return nickname;
  }

  return getPlayerNameFromEmail(user?.email);
}
