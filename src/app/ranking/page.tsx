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

const SQL_LOL_RANKING = "select user_name, lol_points from users_tst where lol_points > 0 order by lol_points desc";
const SQL_CS2_RANKING = "select user_name, cs2_points from users_tst where cs2_points > 0 order by cs2_points desc";

export default function Ranking() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'lol' | 'cs2' | null>(null);
  const [rows, setRows] = useState<Array<{ user_name: string; LOL_points?: number; CS2_points?: number }>>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [fetchError, setFetchError] = useState('');

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

      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/auth');
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    if (!supabase || isLoading) {
      setRows([]);
      return;
    }

    async function loadRanking() {
      setLoadingRows(true);
      setFetchError('');

      const query = view === 'lol' ? SQL_LOL_RANKING : SQL_CS2_RANKING;
      const selection = view === 'lol'
        ? supabase.from('users_tst').select('user_name, LOL_points').gt('LOL_points', 0).order('LOL_points', { ascending: false })
        : supabase.from('users_tst').select('user_name, CS2_points').gt('CS2_points', 0).order('CS2_points', { ascending: false });

      const { data, error } = await selection;

      if (error) {
        setFetchError(error.message);
        setRows([]);
      } else {
        setRows(data || []);
      }

      setLoadingRows(false);
      console.debug('Ranking query:', query);
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
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/images/logo-eeia-cup.png" alt="Logo EEIA CUP" width={64} height={64} priority />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-100/85">EEIA CUP</p>
              <p className="mt-1 text-sm text-white/62">2026</p>
            </div>
          </div>

          <div className='flex items-center justify-between gap-4'>
            <Link
              href="/"
              className="hidden rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/90 transition hover:-translate-y-0.5 hover:bg-white/12 sm:inline-flex"
            >
              Strona główna
            </Link>
          </div>
        </header>

        <div className="relative mt-10 rounded-3xl text-center backdrop-blur-md">
          <h1 className="text-2xl font-semibold uppercase tracking-[0.25em] text-white">Ranking graczy</h1>
        </div>

                  <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setView('lol')}
              className={`rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5 ${
                view === 'lol'
                  ? 'bg-amber-300/80 text-white border-amber-300'
                  : 'bg-white/50 text-amber-200'
              }`}
            >
              League of Legends

            </button>
            <button
              onClick={() => setView('cs2')}
              className={`rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5 ${
                view === 'cs2'
                  ? 'bg-amber-300/80 text-white border-amber-300'
                  : 'bg-white/50 text-amber-200'
              }`}
            >
              Counter-Strike 2
            </button>
          </div>

        {view === 'lol' && (
        <div className="relative mt-10 flex-1 rounded-3xl border border-purple-300/30 bg-purple-300/20 p-6 backdrop-blur-md">
            <div className="mt-6">
              {loadingRows ? (
                <p className="text-sm text-slate-300">Ładowanie rankingu...</p>
              ) : fetchError ? (
                <p className="text-sm text-rose-300">Błąd: {fetchError}</p>
              ) : rows.length === 0 ? (
                <p className="text-sm text-slate-300">Brak punktów do wyświetlenia.</p>
              ) : (
                <div className="space-y-3 text-left">
                  {rows.map((row, index) => (
                    <div key={index} className="flex items-center justify-between rounded-2xl font-semibold tracking-[0.1em] border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3">
                      <span className="font-medium text-white">{row.user_name}</span>
                      <span className="text-amber-300">{row.LOL_points}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        )}
        {view === 'cs2' && (
        <div className="relative mt-10 flex-1 rounded-3xl border border-purple-300/30 bg-purple-300/20 p-6 backdrop-blur-md">
            <div className="mt-6">
              {loadingRows ? (
                <p className="text-sm text-slate-300">Ładowanie rankingu...</p>
              ) : fetchError ? (
                <p className="text-sm text-rose-300">Błąd: {fetchError}</p>
              ) : rows.length === 0 ? (
                <p className="text-sm text-slate-300">Brak punktów do wyświetlenia.</p>
              ) : (
                <div className="space-y-3 text-left">
                  {rows.map((row, index) => (
                    <div key={index} className="flex items-center justify-between rounded-2xl font-semibold tracking-[0.1em] border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3">
                      <span className="font-medium text-white">{row.user_name}</span>
                      <span className="text-amber-300">{row.CS2_points}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        )}

      </div>
    </main>
  );
}
