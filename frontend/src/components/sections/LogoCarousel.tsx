import { clientLogos } from "../../constants/logos";

export default function LogoCarousel()
{
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="border-t border-white/10 py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Trusted Partners
          </p>
          <h2 className="text-2xl font-medium md:text-4xl">
            Companies We Have Worked With
          </h2>
        </div>

        <div className="logo-fade-mask overflow-hidden">
          <div className="logo-track flex w-max items-center gap-12 md:gap-16">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex h-20 min-w-[140px] items-center justify-center opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:min-w-[180px]"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-10 w-auto object-contain md:max-h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}