import type { ReactNode } from 'react';

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SectionCard({ eyebrow, title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow backdrop-blur-xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted md:text-base">{description}</p>
        </div>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
