'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { GAME_MODES } from '@/lib/game-content';
import { getPlayerDisplayNameFromUser, getSupabaseBrowserClient, hasSupabaseConfig } from '@/lib/supabase-browser';

type QuestionRow = {
  id: number;
  question: string | null;
  optA: string | null;
  optB: string | null;
  optC: string | null;
  optD: string | null;
  correct: number | null;
};

type LoadedQuestion = {
  prompt: string;
  answers: string[];
  correctIndex: number;
};

function getRoundTime(correctAnswers: number) {
  if (correctAnswers < 10) {
    return 45;
  }

  if (correctAnswers < 20) {
    return 40;
  }

  const phaseThreeTime = 30 - Math.floor((correctAnswers - 20) / 5);
  return Math.max(3, phaseThreeTime);
}

function normalizeCorrectIndex(correct: number | null) {
  if (correct === null || Number.isNaN(correct)) {
    return 0;
  }

  if (correct >= 1 && correct <= 4) {
    return correct - 1;
  }

  if (correct >= 0 && correct <= 3) {
    return correct;
  }

  return 0;
}

function mapQuestionRows(rows: QuestionRow[]): LoadedQuestion[] {
  return rows
    .map((row) => ({
      prompt: row.question?.trim() ?? '',
      answers: [row.optA ?? '', row.optB ?? '', row.optC ?? '', row.optD ?? ''],
      correctIndex: normalizeCorrectIndex(row.correct)
    }))
    .filter((question) => question.prompt.length > 0 && question.answers.every((answer) => answer.length > 0));
}

function shuffleIndices(length: number) {
  const indices = Array.from({ length }, (_, index) => index);

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[randomIndex]] = [indices[randomIndex], indices[index]];
  }

  return indices;
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
  const [questions, setQuestions] = useState<LoadedQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState('');
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundDuration, setRoundDuration] = useState(getRoundTime(0));
  const [timeLeft, setTimeLeft] = useState(getRoundTime(0));
  const [feedback, setFeedback] = useState('');
  const [forceFinished, setForceFinished] = useState(false);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);
  const hasSubmittedResultRef = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setIsLoadingAuth(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      if (!data.session?.user) {
        supabase.auth.signOut();
        router.replace('/auth');
        return;
      }

      setNickname(getPlayerDisplayNameFromUser(data.session.user));
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        supabase.auth.signOut();
        router.replace('/auth');
        return;
      }

      setNickname(getPlayerDisplayNameFromUser(session.user));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    if (!supabase || !mode) {
      setQuestions([]);
      setIsLoadingQuestions(false);
      return;
    }

    const client = supabase;
    const currentMode = mode;

    let mounted = true;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setQuestionsError('');
      setQuestions([]);
      setQuestionOrder([]);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setRoundDuration(getRoundTime(0));
      setTimeLeft(getRoundTime(0));
      setFeedback('');
      setForceFinished(false);

      const { data, error } = await client
        .from(currentMode.questionsTable)
        .select('id, question, optA, optB, optC, optD, correct')
        .order('id', { ascending: true });

      if (!mounted) {
        return;
      }

      if (error) {
        setQuestionsError('Nie udało się pobrać pytań z bazy danych.');
        setIsLoadingQuestions(false);
        return;
      }

      const loadedQuestions = mapQuestionRows((data ?? []) as QuestionRow[]);

      if (loadedQuestions.length === 0) {
        setQuestionsError('W tej chwili nie ma pytań w bazie danych dla tego trybu.');
        setIsLoadingQuestions(false);
        return;
      }

      setQuestions(loadedQuestions);
      setQuestionOrder(shuffleIndices(loadedQuestions.length));
      setIsLoadingQuestions(false);
    }

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, [mode, supabase]);

  useEffect(() => {
    const nextRoundTime = getRoundTime(score);
    setRoundDuration(nextRoundTime);
    setTimeLeft(nextRoundTime);
  }, [currentIndex, score]);

  const isFinished = useMemo(() => {
    if (!mode || isLoadingQuestions) {
      return false;
    }

    return forceFinished;
  }, [mode, forceFinished, isLoadingQuestions]);

  useEffect(() => {
    if (!supabase || !mode || !isFinished || isLoadingAuth || hasSubmittedResultRef.current) {
      return;
    }

    const client = supabase;
    const currentMode = mode;

    let mounted = true;

    async function submitResult() {
      hasSubmittedResultRef.current = true;
      setIsSubmittingResult(true);

      const { data, error } = await client.auth.getUser();

      if (!mounted) {
        return;
      }

      if (error || !data.user) {
        client.auth.signOut();
        router.replace('/auth');
        setIsSubmittingResult(false);
        return;
      }

      const displayName = getPlayerDisplayNameFromUser(data.user);
      const { error: submitError } = await client.rpc('record_best_score', {
        p_mode: currentMode.slug,
        p_display_name: displayName,
        p_points: score
      });

      if (!mounted) {
        return;
      }

      if (submitError) {
        setFeedback(`Nie udało się zapisać wyniku: ${submitError.message}`);
      }

      setIsSubmittingResult(false);
    }

    submitResult();

    return () => {
      mounted = false;
    };
  }, [isFinished, isLoadingAuth, mode, router, score, supabase]);

  useEffect(() => {
    if (!mode || isFinished || isLoadingQuestions || questions.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFeedback('Czas minął. Lecimy dalej.');
          // setStreak(0);          
          setForceFinished(true);          
          setCurrentIndex((current) => current + 0.5);
          return getRoundTime(0);
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, isFinished, currentIndex, isLoadingQuestions, questions.length]);

  if (!hasConfig) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-rose-400/35 bg-rose-500/10 p-5 text-sm text-rose-100">
          Brakuje konfiguracji Supabase w pliku .env. Uzupełnij zmienne i zrestartuj aplikację.
        </div>
      </main>
    );
  }

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

  const question = questions[questionOrder[currentIndex]];
  const timerProgress = Math.max(0, Math.min(100, (timeLeft / roundDuration) * 100));
  const formattedTime = `00:${String(timeLeft).padStart(2, '0')}`;

  function advanceToNextQuestion() {
    setCurrentIndex((value) => {
      const nextIndex = value + 1;

      if (nextIndex >= questions.length) {
        setQuestionOrder(shuffleIndices(questions.length));
        return 0;
      }

      return nextIndex;
    });
  }

  function chooseAnswer(index: number) {
    if (!question) {
      return;
    }

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      setFeedback('Dobrze! Kolejna runda bedzie szybsza.');
      advanceToNextQuestion();
    } else {
      // setStreak(0);
      setForceFinished(true);
      setFeedback('Zła odpowiedziedź.')
      
    }
  }

  function restart() {
    const nextOrder = shuffleIndices(questions.length);

    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setQuestionOrder(nextOrder);
    setRoundDuration(getRoundTime(0));
    setTimeLeft(getRoundTime(0));
    setForceFinished(false);
    setIsSubmittingResult(false);
    hasSubmittedResultRef.current = false;
    setFeedback('Nowa seria rozpoczęta.');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f1118] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(251,146,60,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_36%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.35),rgba(8,10,14,0.92))]" />
      <div className="relative mx-auto max-w-5xl space-y-4 sm:space-y-6">
        <header className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
          <div className="relative h-48 sm:h-60">
            <Image src={mode.image} alt={mode.title} fill className="object-cover" priority />
            <div className={`absolute inset-0 bg-gradient-to-r ${mode.themeClass} via-slate-950/55`} />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-14">
              <h1 className={`${mode.slug === 'cs2' ? 'mt-4' : 'mt-2'} text-2xl font-semibold text-white sm:text-3xl`}>
                {mode.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-100">{mode.subtitle}</p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">Gracz</p>
              <p className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
                {isLoadingAuth ? '' : nickname}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/5 p-3 sm:p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/75 sm:text-xs">STREAK</p>
              <p className="mt-1 text-base font-semibold text-cyan-300 sm:text-lg">{streak}</p>
            </div>

            <div className="col-span-2 rounded-2xl border border-amber-300/20 bg-amber-500/5 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-200/80 sm:text-xs">Czas rundy</p>
                <p className="text-base font-semibold text-orange-300 sm:text-lg">{formattedTime}</p>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 sm:p-6">
          {isLoadingQuestions ? (
            <div className="py-10 text-center text-slate-300">Ładowanie pytań z bazy danych...</div>
          ) : questionsError ? (
            <div className="space-y-4 py-10 text-center">
              <p className="text-sm text-rose-200">{questionsError}</p>
              <Link href="/games" className="underline decoration-dotted underline-offset-4">
                Wybór gry
              </Link>
            </div>
          ) : isFinished ? (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-white">Koniec serii</h2>
              <p className="text-sm text-slate-300">
                Wynik: {score}<br/>
                Jeśli chcesz, zagraj ponownie.
              </p>
              {isSubmittingResult ? <p className="text-sm text-slate-400">Zapisuję wynik do rankingu...</p> : null}
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
                    Pytanie
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{question.prompt}</h2>
                  <p className="mt-2 text-sm text-slate-300">Wybierz poprawną odpowiedź. Każda dobra odpowiedź daje 1 punkt.</p>
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
          <Link href="/games" className="rounded-xl bg-slate-700/20 border border-slate-700/30 px-4 py-2 text-sm font-semibold text-white">
            Wybór gry
          </Link>
          <Link href="/" className="rounded-xl bg-slate-700/20 border border-slate-700/30 px-4 py-2 text-sm font-semibold text-white">
            Strona główna
          </Link>
        </div>
      </div>
    </main>
  );
}
