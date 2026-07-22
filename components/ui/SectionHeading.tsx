export function SectionHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
      {eyebrow ? <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--neon-cyan)]">{eyebrow}</p> : null}
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-tight text-white md:text-5xl">{title}</h2>
      {intro ? <p className="text-base leading-7 text-[color:var(--text-muted)] md:text-lg">{intro}</p> : null}
    </div>
  );
}
