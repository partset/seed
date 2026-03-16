import type { NavLink } from "../../constants/hero";
import CTAButton from "../hero/CTAButton";
import NavbarLink from "./NavbarLink";

type NavbarProps = {
  links: NavLink[];
  pricingLink: NavLink;
};

export default function Navbar({ links, pricingLink }: NavbarProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] px-5 py-[18px] sm:px-9 sm:py-7">
      <div className="relative flex flex-col items-center gap-4 sm:block">
        <ul className="animate-fade-in-delayed flex list-none flex-wrap items-center justify-center gap-6 sm:gap-11">
          {links.map((link) => (
            <li key={link.label}>
              <NavbarLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
          <CTAButton
            label={pricingLink.label}
            href={pricingLink.href}
            className="px-6 py-2.5 text-[12px] tracking-[0.18em]"
          />
        </div>
      </div>
    </nav>
  );
}
