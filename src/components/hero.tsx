import { eventStats } from '@/lib/eeia-content';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-glow md:p-10">
      <div className="absolute inset-0 bg-hero-grid [background-size:24px_24px] opacity-20" />
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-accent/30 bg-accentSoft px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            EEIA CUP 2026
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white text-balance md:text-6xl">
            Strona konkursowa dla wydarzenia EEIA CUP.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
            To jest startowy szkielet Next.js przygotowany pod Twoje wydarzenie. W kolejnym kroku
            podmienimy treści, grafiki, harmonogram i logikę konkursową na finalną wersję.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#info"
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Zobacz sekcje
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Kontakt
            </a>
          </div>
        </div>

        <div className="grid gap-3 rounded-[28px] border border-white/10 bg-black/20 p-4 backdrop-blur-md">
          {eventStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
