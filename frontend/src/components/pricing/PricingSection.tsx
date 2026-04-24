import CTAButton from "../hero/CTAButton";
import { pricingCustomEstimate, pricingTiers } from "../../constants/pricing";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Pick the perfect{" "}
          <span className="text-[var(--color-primary)]">pricing plan</span>
        </h1>

        <p className="mt-5 text-lg leading-8 text-foreground/65">
          Choose the tier that best fits your business and website goals.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {pricingTiers.map((tier, index) => (
          <PricingCard key={tier.id} tier={tier} featured={index === 1} />
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-4xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {pricingCustomEstimate.title}
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-foreground/70">
          {pricingCustomEstimate.description}
        </p>

        <div className="mt-8 flex justify-center">
          <CTAButton
            label={pricingCustomEstimate.ctaLabel}
            href={pricingCustomEstimate.ctaHref}
            className="rounded-full border border-foreground/20 px-8 py-3.5 text-[13px] tracking-[0.15em]"
          />
        </div>
      </div>
    </section>
  );
}
