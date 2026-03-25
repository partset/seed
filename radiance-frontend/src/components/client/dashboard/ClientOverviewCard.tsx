interface ClientOverviewCardProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function ClientOverviewCard({
  eyebrow,
  title,
  description,
}: ClientOverviewCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
        {eyebrow}
      </p>

      <h2
        className="mt-3 text-3xl uppercase md:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
        {description}
      </p>
    </article>
  );
}
