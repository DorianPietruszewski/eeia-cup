'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseBrowserClient, hasSupabaseConfig } from '@/lib/supabase-browser';

export default function AuthPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const hasConfig = hasSupabaseConfig();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!mounted) {
        return;
      }

      if (!authError && data.user) {
        router.replace('/games');
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace('/games');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError('Brakuje konfiguracji Supabase. Ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes('@')) {
      setError('Podaj poprawny adres e-mail.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    const emailRedirectTo = typeof window === 'undefined' ? undefined : `${window.location.origin}/auth`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo
      }
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setMessage('Wysłano link logowania na podany e-mail. Otwórz skrzynkę i kliknij link.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-white">Logowanie do EEIA CUP</h1>
            <Image src="/images/logo-eeia-cup.png" alt="EEIA CUP" width={72} height={72} />
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Podaj e-mail, na który zostanie wysłany link logowania bez hasła.
          </p>

          {!hasConfig ? (
            <p className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              Brakuje zmiennych Supabase w pliku .env. Uzupelnij je i zrestartuj serwer.
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-sm font-medium text-slate-200" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
                setMessage('');
              }}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-slate-300"
              placeholder="np. gracz@eeia.pl"
              autoComplete="email"
            />

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

            <button
              type="submit"
              disabled={loading || !hasConfig}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              {loading ? 'Wysyłanie...' : 'Wyślij link logowania'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
            <Link href="/" className="underline decoration-dotted underline-offset-4">
              Wróć na stronę główną
            </Link>
            <span>Autoryzacja przez Supabase</span>
          </div>
        </section>
      </div>
    </main>
  );
}
