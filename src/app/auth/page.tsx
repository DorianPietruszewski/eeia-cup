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
  const [password, setPassword] = useState('');
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

    return () => {
      mounted = false;
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

    if (password.length < 6) {
      setError('Hasło musi zawierać co najmniej 6 znaków.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/games');
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-lg rounded-3xl bg-fuchsia-300/25 border border-fuchsia-300/30 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-white">Logowanie do EEIA CUP</h1>
            <Image src="/images/logo-eeia-cup.png" alt="EEIA CUP" width={72} height={72} />
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Zaloguj się podając e-mail i hasło.
          </p>

          {!hasConfig ? (
            <p className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              Brakuje zmiennych Supabase w pliku .env. Uzupełnij je i zrestartuj serwer.
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
                setMessage('');
              }}
              className="w-full rounded-xl border border-fuchsia-300/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-fuchsia-300/25 focus:ring-1 focus:ring-fuchsia-300/25 focus:bg-black/60"
              placeholder="np. gracz@eeia.pl"
              autoComplete="email"
            />

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
                setMessage('');
              }}
              className="w-full rounded-xl border border-fuchsia-300/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-fuchsia-300/25 focus:ring-1 focus:ring-fuchsia-300/25 focus:bg-black/60"
              placeholder="Twoje hasło"
              autoComplete="current-password"
            />

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

            <button
              type="submit"
              disabled={loading || !hasConfig}
              className="w-full rounded-xl bg-amber-500/75 px-4 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/25 hover:ring-1 hover:ring-fuchsia-300/25 hover:bg-black/60 hover:text-white "
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
            <Link href="/" className="rounded-xl bg-white/75 px-4 py-3 text-sm font-semibold text-fuchsia-950 transition hover:border-fuchsia-300/25 hover:ring-1 hover:ring-fuchsia-300/25 hover:bg-black/60 hover:text-white">
              Strona główna
            </Link>
            <Link href="/auth/register" className="rounded-xl bg-fuchsia-500/75 px-4 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/25 hover:ring-1 hover:ring-fuchsia-300/25 hover:bg-black/60">
              Rejestracja
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
