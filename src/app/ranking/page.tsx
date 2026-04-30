"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Pixelify_Sans } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: '400'
});

type LeaderboardRow = {
  display_name: string;
  best_points: number;
  best_points_at: string;
  mode: 'lol' | 'cs2';
};

const LEADERBOARD_TABLE = 'leaderboard_entries';

export default function Ranking() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'lol' | 'cs2' | null>(null);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase || isLoading) {
      setRows([]);
      return;
    }

    const client = supabase;

    async function loadRanking() {
      setLoadingRows(true);
      setFetchError('');

      if (!view) {
        setRows([]);
        setLoadingRows(false);
        return;
      }

      const selection = client
        .from(LEADERBOARD_TABLE)
        .select('display_name, best_points, best_points_at, mode')
        .eq('mode', view)
        .gt('best_points', 0)
        .order('best_points', { ascending: false })
        .order('best_points_at', { ascending: true });

      const { data, error } = await selection;

      if (error) {
        setFetchError(error.message);
        setRows([]);
      } else {
        setRows((data || []) as LeaderboardRow[]);
      }

      setLoadingRows(false);
    }

    loadRanking();
  }, [view, supabase]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#120611] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(188,95,255,0.22),transparent_0_32%),radial-gradient(circle_at_82%_14%,rgba(255,191,47,0.16),transparent_0_24%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_0_34%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,5,18,0.3),rgba(16,5,18,0.92))]" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-amber-400/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logo-eeia-cup.png" alt="Logo EEIA CUP" width={64} height={64} priority />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-100/85">EEIA CUP</p>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Ranking graczy</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/90 transition hover:-translate-y-0.5 hover:bg-white/12"
            >
              Strona główna
            </Link>
          </div>
        </header>

        <section className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Wybór trybu</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Wybierz odpowiedni tryb i zobacz wyniki najlepszych zawodników!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setView('lol')}
                className={`rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
                  view === 'lol'
                    ? 'border-amber-300/60 bg-amber-300/15 text-white shadow-[0_12px_30px_rgba(251,191,36,0.16)]'
                    : 'border-white/10 bg-black/20 text-slate-200 hover:bg-white/8'
                }`}
              >
                <span className="block text-[11px] uppercase tracking-[0.3em] text-white/55">Tryb</span>
                <span className="mt-1 block text-sm font-semibold">League of Legends</span>
              </button>

              <button
                onClick={() => setView('cs2')}
                className={`rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
                  view === 'cs2'
                    ? 'border-amber-300/60 bg-amber-300/15 text-white shadow-[0_12px_30px_rgba(251,191,36,0.16)]'
                    : 'border-white/10 bg-black/20 text-slate-200 hover:bg-white/8'
                }`}
              >
                <span className="block text-[11px] uppercase tracking-[0.3em] text-white/55">Tryb</span>
                <span className="mt-1 block text-sm font-semibold">Counter-Strike 2</span>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 flex-1 rounded-[32px] border border-white/10 bg-[#180a18]/85 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
          {!view ? (
            <div className="grid min-h-[280px] place-items-center text-center">
              <div>
                <p className="text-lg font-semibold text-white">Wybierz tryb rankingu</p>
                <p className="mt-2 text-sm text-slate-300">Lista wyników pojawi się po kliknięciu jednej z kart powyżej.</p>
              </div>
            </div>
          ) : loadingRows ? (
            <div className="space-y-3 py-4">
              <div className="h-14 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              <div className="h-14 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              <div className="h-14 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            </div>
          ) : fetchError ? (
            <div className="grid min-h-[240px] place-items-center text-center">
              <p className="text-sm text-rose-300">Błąd: {fetchError}</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="grid min-h-[240px] place-items-center text-center">
              <p className="text-sm text-slate-300">Brak punktów do wyświetlenia.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="hidden grid-cols-[72px_1fr_110px] gap-3 px-4 pb-2 text-[11px] uppercase tracking-[0.3em] text-slate-400 md:grid">
                <span>Miejsce</span>
                <span>Gracz</span>
                <span className="text-right">Punkty</span>
              </div>

              {rows.map((row, index) => {
                const place = index + 1;

                return (
                  <div
                    key={`${row.display_name}-${row.best_points}-${index}`}
                    className={`grid items-center gap-3 rounded-2xl border px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/8 sm:px-5 md:grid-cols-[72px_1fr_110px] ${
                      place === 1
                        ? 'border-amber-300/40 bg-amber-300/10 shadow-[0_16px_40px_rgba(251,191,36,0.08)]'
                        : place === 2
                          ? 'border-slate-300/20 bg-white/6'
                          : place === 3
                            ? 'border-orange-300/20 bg-orange-300/8'
                            : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:justify-start">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                        place === 1
                          ? 'bg-amber-300 text-slate-950'
                          : place === 2
                            ? 'bg-slate-200 text-slate-950'
                            : place === 3
                              ? 'bg-orange-300 text-slate-950'
                              : 'bg-white/10 text-white'
                      }`}>
                        {place}
                      </span>
                      <span className="md:hidden text-[11px] uppercase tracking-[0.3em] text-slate-400">Miejsce</span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-white sm:text-lg">{row.display_name}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 md:hidden">Punkty</span>
                      <span className="text-lg font-semibold text-amber-300 sm:text-xl">{row.best_points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
