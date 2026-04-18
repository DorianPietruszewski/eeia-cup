import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_55%_at_10%_8%,rgba(56,189,248,0.14),transparent),radial-gradient(60%_45%_at_90%_10%,rgba(251,146,60,0.12),transparent),radial-gradient(55%_40%_at_50%_100%,rgba(255,255,255,0.04),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-18 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,16,0.5),rgba(4,8,16,0.9))]" />

      <div className="pointer-events-none absolute -left-20 top-10 h-60 w-60 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/7" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

        <div className="relative flex items-center gap-4">
          <Image src="/images/logo-eeia-cup.png" alt="Logo EEIA CUP" width={82} height={82} priority />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-100">EEIA CUP</p>
            <p className="mt-1 text-sm text-slate-200">Edycja 2026</p>
          </div>
        </div>

        <h1 className="relative mt-7 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          Turniejowy quiz
          <br />
          LoL i CS2
        </h1>

        <p className="relative mt-4 max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
          Zaloguj sie, wybierz gre i odpowiadaj na czas. Prosta forma, szybka nawigacja i czytelny
          interfejs na telefonie oraz desktopie.
        </p>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/auth"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Zaloguj sie
          </Link>
          <Link
            href="/games"
            className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            Mam juz konto
          </Link>
        </div>

        <p className="relative mt-5 text-xs text-slate-200/90">Rejestracja i ranking przez Supabase w kolejnym etapie.</p>
      </section>
    </main>
  );
}
