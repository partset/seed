interface PaymentHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PaymentHero({
  eyebrow,
  title,
  description,
  action,
}: PaymentHeroProps) {
  return (
    <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
            {eyebrow}
          </p>

          <h1
            className="text-5xl uppercase md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
            {description}
          </p>
        </div>

        {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
      </div>
    </div>
  );
}
