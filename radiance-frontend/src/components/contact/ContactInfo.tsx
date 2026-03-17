import { CONTACT_INFO, CONTACT_SERVICES } from "../../constants/contact";

export default function ContactInfo()
{
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground/50">
              {CONTACT_INFO.emailLabel}
            </p>
            <p className="mt-1 text-base font-medium text-foreground">
              {CONTACT_INFO.email}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground/50">
              {CONTACT_INFO.locationLabel}
            </p>
            <p className="mt-1 text-base font-medium text-foreground">
              {CONTACT_INFO.location}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground/50">
              Response time
            </p>
            <p className="mt-1 text-base font-medium text-foreground">
              {CONTACT_INFO.responseTime}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
          What we can help with
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {CONTACT_SERVICES.map((service) => (
            <li
              key={service}
              className="text-sm leading-6 text-foreground/75"
            >
              • {service}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}