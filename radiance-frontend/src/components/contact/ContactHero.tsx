import { CONTACT_INFO } from "../../constants/contact";

export default function ContactHero()
{
  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-5xl leading-[0.95] font-semibold text-foreground sm:text-6xl lg:text-7xl">
        {CONTACT_INFO.title}
      </h1>

      <p className="max-w-xl text-base leading-7 text-foreground/70">
        {CONTACT_INFO.description}
      </p>
    </div>
  );
}