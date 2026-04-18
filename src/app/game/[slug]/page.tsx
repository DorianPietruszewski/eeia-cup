'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { GAME_MODES } from '@/lib/game-content';
import { getPlayerNameFromEmail, getSupabaseBrowserClient, hasSupabaseConfig } from '@/lib/supabase-browser';

function getRoundTime(streak: number) {
  return Math.max(5, 12 - streak);
}

export default function GameModePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const hasConfig = hasSupabaseConfig();
  const slug = params.slug === 'lol' || params.slug === 'cs2' ? params.slug : null;
  const mode = slug ? GAME_MODES[slug] : null;

  const [nickname, setNickname] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getRoundTime(0));
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!supabase) {
      setIsLoadingAuth(false);
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
      setIsLoadingAuth(false);
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

  if (!hasConfig) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-rose-400/35 bg-rose-500/10 p-5 text-sm text-rose-100">
          Brakuje konfiguracji Supabase w pliku .env. Uzupełnij zmienne i zrestartuj aplikacje.
        </div>
      </main>
    );
  }

  useEffect(() => {
    setTimeLeft(getRoundTime(streak));
  }, [currentIndex, streak]);

  const isFinished = useMemo(() => {
    if (!mode) {
      return false;
    }

    return currentIndex >= mode.questions.length;
  }, [currentIndex, mode]);

  useEffect(() => {
    if (!mode || isFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFeedback('Czas minął. Lecimy dalej.');
          setStreak(0);
          setCurrentIndex((current) => current + 1);
          return getRoundTime(0);
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, isFinished]);

  if (!mode) {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-center text-white">
        <div>
          <p className="text-lg">Nie znaleziono wybranego trybu gry.</p>
          <Link href="/games" className="mt-4 inline-block underline underline-offset-4">
            Wróć do wyboru
          </Link>
        </div>
      </main>
    );
  }

  const question = mode.questions[currentIndex];

  function chooseAnswer(index: number) {
    if (!question) {
      return;
    }

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      setFeedback('Dobrze! Kolejna runda bedzie szybsza.');
    } else {
      setStreak(0);
      setFeedback('Nie tym razem. Probuj dalej.');
    }

    setCurrentIndex((value) => value + 1);
  }

  function restart() {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback('Nowa seria rozpoczęta.');
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
        <header className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
          <div className="relative h-40 sm:h-52">
            <Image src={mode.image} alt={mode.title} fill className="object-cover" priority />
            <div className={`absolute inset-0 bg-gradient-to-r ${mode.themeClass} via-slate-950/55`} />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">Tryb quizowy</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{mode.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-100">{mode.subtitle}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Gracz</p>
            <p className="mt-1 truncate text-base font-semibold text-white">
              {isLoadingAuth ? 'Ladowanie...' : nickname}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Punkty</p>
            <p className="mt-1 text-xl font-semibold text-white">{score}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Streak</p>
            <p className="mt-1 text-xl font-semibold text-cyan-300">{streak}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Czas rundy</p>
            <p className="mt-1 text-xl font-semibold text-orange-300">{timeLeft}s</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:p-6">
          {isFinished ? (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Koniec serii</h2>
              <p className="text-sm text-slate-300">
                Wynik: {score}/{mode.questions.length}. Jesli chcesz, zagraj ponownie.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={restart}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Zagraj ponownie
                </button>
                <Link href="/games" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white">
                  Wybierz inną grę
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Pytanie {currentIndex + 1}/{mode.questions.length}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{question.prompt}</h2>
                  <p className="mt-2 text-sm text-slate-300">{question.flavor}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {question.answers.map((answer, index) => (
                  <button
                    key={answer}
                    onClick={() => chooseAnswer(index)}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    {answer}
                  </button>
                ))}
              </div>

              {feedback ? <p className="mt-4 text-sm text-slate-200">{feedback}</p> : null}
            </div>
          )}
        </section>

        <div className="flex justify-between text-sm text-slate-300">
          <Link href="/games" className="underline decoration-dotted underline-offset-4">
            Wróć do wyboru gry
          </Link>
          <Link href="/" className="underline decoration-dotted underline-offset-4">
            Strona główna
          </Link>
        </div>
      </div>
    </main>
  );
}
