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
    subtitle: 'Bohaterowie, przedmioty i umiejętności pod presją czasu.',
    image: '/images/inspiracja/lol_photo.png',
    gradient: 'from-cyan-400/45 via-indigo-500/25 to-slate-950/15',
    badge: 'Tryb LoL'
  },
  {
    slug: 'cs2',
    title: 'Counter-Strike 2',
    subtitle: 'Mapy, taktyka i esportowe smaczki w szybkich rundach.',
    image: '/images/inspiracja/cs2_photo.png',
    gradient: 'from-orange-400/50 via-amber-500/25 to-slate-950/20',
    badge: 'Tryb CS2'
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
          Brakuje konfiguracji Supabase w pliku .env. Uzupełnij zmienne i zrestartuj aplikację.
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f1118] px-4 py-8 text-white sm:px-6 lg:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(251,146,60,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_36%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.35),rgba(8,10,14,0.92))]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Panel gracza</p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                Wybierz grę i walcz o miejsce w rankingu
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                {isLoading ? 'Trwa ładowanie profilu...' : `Zalogowano jako: ${nickname}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Strona główna
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Zasady trybu</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-100 sm:text-sm">
              Nieskończona seria pytań
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-100 sm:text-sm">
              +1 punkt za poprawną odpowiedź
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-100 sm:text-sm">
              Błąd kończy podejście
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-100 sm:text-sm">
              Czas na odpowiedź przyspiesza z każdą dobrą serią
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {games.map((game) => (
            <article
              key={game.slug}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className="relative h-52 overflow-hidden sm:h-60">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient}`} />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {game.badge}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">{game.title}</h2>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <p className="text-sm leading-7 text-slate-200 sm:text-base">{game.subtitle}</p>
                <Link
                  href={`/game/${game.slug}`}
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Graj teraz
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
