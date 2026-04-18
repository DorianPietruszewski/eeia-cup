import Image from 'next/image';
import Link from 'next/link';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: '400'
});

export default function Home() {
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
              <p className="mt-1 text-sm text-white/62">turniejowy portal 2026</p>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-amber-200/90 sm:block">
            Fast entry
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div className="max-w-2xl">
            <p className={`${pixelify.className} inline-flex rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-xs text-fuchsia-100 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}>
              EEIA CUP 2026
            </p>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-tight text-balance text-white sm:text-5xl lg:text-[4.25rem]">
              Strona glowna w klimacie
              <span className="block bg-[linear-gradient(90deg,#f7c83a_0%,#e1a0ff_48%,#ffcf63_100%)] bg-clip-text text-transparent">
                EEIA CUP
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              Fiolet, zloto i pixelowy charakter inspirowany plakatami z katalogu
              <span className="font-medium text-white"> images/inspiracja</span>. Mniej blokow,
              wiecej oddechu, ten sam turniejowy charakter.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd45c_0%,#f4a51c_100%)] px-6 py-3 text-sm font-semibold text-[#1a0918] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(244,165,28,0.28)]"
              >
                Wejdz do gier
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Zaloguj sie
              </Link>
            </div>

          </div>

          <div className="relative mt-2 h-[clamp(360px,48vw,560px)] w-full max-w-[520px] justify-self-center lg:mt-4 lg:justify-self-end">
            <div aria-hidden className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-fuchsia-500/18 blur-3xl" />
            <div aria-hidden className="absolute -right-2 bottom-14 h-28 w-28 rounded-full bg-amber-400/16 blur-3xl" />

            <div className="h-full overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="relative h-full w-full overflow-hidden rounded-[26px] border border-white/10 bg-[#180a18]">
                <Image
                  src="/images/inspiracja/cs_win_fajny.png"
                  alt="Grafika inspirowana motywem EEIA CUP"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  className="object-cover object-[center_58%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,6,17,0.1)_0%,rgba(17,6,17,0.42)_55%,rgba(17,6,17,0.9)_100%)]" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className={`${pixelify.className} text-xs text-fuchsia-100/90`}>
                    MOTYW STARTOWY
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-amber-200/90">
                    2026
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="max-w-md">
                    <p className={`${pixelify.className} text-xl leading-none text-white sm:text-2xl`}>
                      EEIA CUP
                    </p>
                    <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/74 sm:text-sm sm:leading-6">
                      Jeden mocny obraz, jeden czytelny komunikat i mniej szumu na pierwszym ekranie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
