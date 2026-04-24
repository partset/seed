import type { FooterLink } from "../../constants/hero";
import LiveClock from "./LiveClock";
import FooterNavLink from "./FooterNavLink";

type BottomBarProps = {
  location: string;
  timezone: string;
  centerLinks: FooterLink[];
  copyright: string;
  socialLinks: FooterLink[];
};

export default function BottomBar({
  location,
  timezone,
  centerLinks,
  copyright,
  socialLinks,
}: BottomBarProps) {
  return (
    <div className="animate-fade-in-bottom relative z-[2] flex flex-wrap items-end justify-between gap-3 border-t border-white/10 px-5 py-8 sm:px-9">
      <div className="flex flex-col gap-1">
        <LiveClock timezone={timezone} />
        <span className="text-[14px] uppercase tracking-[0.15em] text-foreground/30">
          {location}
        </span>
      </div>

      <div className="hidden items-center gap-2.5 lg:flex">
        {centerLinks.map((link, index) => (
          <div key={link.label} className="flex items-center gap-2.5">
            <FooterNavLink label={link.label} href={link.href} />
            {index < centerLinks.length - 1 && (
              <span className="text-[14px] text-foreground/20">|</span>
            )}
          </div>
        ))}

        <span className="text-[14px] tracking-[0.1em] text-foreground/30">
          | {copyright}
        </span>
      </div>

      <div className="flex gap-5">
        {socialLinks.map((link) => (
          <FooterNavLink key={link.label} label={link.label} href={link.href} />
        ))}
      </div>
    </div>
  );
}
