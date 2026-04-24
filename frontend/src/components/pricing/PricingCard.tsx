import CTAButton from "../hero/CTAButton";
import type { PricingTier } from "../../constants/pricing";

type PricingCardProps = {
  tier: PricingTier;
  featured?: boolean;
};

export default function PricingCard({
  tier,
  featured = false,
}: PricingCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-[28px] border bg-white/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 ${
        featured ? "border-foreground/20" : "border-white/10"
      }`}
    >
      <div className="mb-8">
        <h2 className="text-center font-[var(--font-display)] text-4xl uppercase tracking-wide text-[var(--color-primary)] sm:text-5xl">
          {tier.name}
        </h2>

        <p className="mt-6 text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {tier.price}
        </p>

        <p className="mx-auto mt-6 max-w-[28ch] text-center text-base leading-8 text-foreground/70">
          {tier.description}
        </p>
      </div>

      <ul className="mb-10 flex flex-1 flex-col gap-4">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-[15px] leading-7 text-foreground/75"
          >
            <span className="mt-1 text-[var(--color-primary)]">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <CTAButton
        label={tier.ctaLabel}
        href={tier.ctaHref}
        className="w-full rounded-full border-0 bg-[var(--color-foreground)] px-6 py-4 text-center text-[13px] font-semibold tracking-[0.15em] text-black hover:bg-[var(--color-primary)]/90 hover:text-black"
      />
    </article>
  );
}
