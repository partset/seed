import { CONTACT_INFO } from "../../constants/contact";

export default function ContactHero()
{
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {CONTACT_INFO.eyebrow}
      </p>

      <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        {CONTACT_INFO.title}
      </h1>

      <p className="max-w-xl text-base leading-7 text-foreground/70">
        {CONTACT_INFO.description}
      </p>
    </div>
  );
}