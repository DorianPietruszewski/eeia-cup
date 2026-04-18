import { faqItems, scheduleItems } from '@/lib/eeia-content';

export function InfoGrid() {
  const items = [
    {
      title: 'Rejestracja',
      description: 'Miejsce na zasady zapisów, kategorie i wymagania uczestników.'
    },
    {
      title: 'Nagrody',
      description: 'Sekcja na podium, sponsorów i opisy nagród dla zwycięzców.'
    },
    {
      title: 'Materiały',
      description: 'Obszar na grafiki, logotypy, social media i pliki do pobrania.'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function ScheduleList() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {scheduleItems.map((item) => (
        <article key={item.time} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">{item.time}</p>
          <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function FaqList() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {faqItems.map((item) => (
        <details key={item.question} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <summary className="cursor-pointer list-none text-base font-semibold text-white">
            {item.question}
          </summary>
          <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
