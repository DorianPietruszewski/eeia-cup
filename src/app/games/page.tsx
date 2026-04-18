'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlayerNameFromEmail, getSupabaseBrowserClient, hasSupabaseConfig } from '@/lib/supabase-browser';

const games = [
  {
    slug: 'lol',
    title: 'League of Legends',
    subtitle: 'Umiejetnosci, przedmioty i bohaterowie pod presja czasu.',
    image: '/images/inspiracja/Liga_git_1.png',
    gradient: 'from-cyan-400/40 to-indigo-500/20'
  },
  {
    slug: 'cs2',
    title: 'Counter-Strike 2',
    subtitle: 'Mapy, skiny i sceny z esportu na szybkie decyzje.',
    image: '/images/inspiracja/cs_win_fajny_1.png',
    gradient: 'from-orange-400/45 to-amber-600/25'
  }
] as const;

export default function GamesPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const hasConfig = hasSupabaseConfig();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) {
        return;
      }

      if (error || !data.user) {
        router.replace('/auth');
        return;
      }

      setNickname(getPlayerNameFromEmail(data.user.email));
      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/auth');
        return;
      }

      setNickname(getPlayerNameFromEmail(session.user.email));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleLogout() {
    if (!supabase) {
      router.push('/');
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
  }

  if (!hasConfig) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-rose-400/35 bg-rose-500/10 p-5 text-sm text-rose-100">
          Brakuje konfiguracji Supabase w pliku .env. Uzupełnij zmienne i zrestartuj aplikacje.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Panel gracza</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Wybierz tryb gry, {isLoading ? '' : nickname}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Wyloguj
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <article
              key={game.slug}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60"
            >
              <div className="relative h-44 overflow-hidden sm:h-52">
                <Image src={game.image} alt={game.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} via-slate-950/45`} />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white">{game.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{game.subtitle}</p>
                <Link
                  href={`/game/${game.slug}`}
                  className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Start
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
