import type { NavLink } from "../../constants/hero";
import CTAButton from "../hero/CTAButton";
import NavbarLink from "./NavbarLink";

type NavbarProps = {
  links: NavLink[];
  pricingLink: NavLink;
};

export default function Navbar({ links, pricingLink }: NavbarProps)
{
  return (
    <nav className="relative z-[100] bg-background-dark/95 px-5 py-3 backdrop-blur sm:px-7 lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:px-9 lg:py-7">
      <div className="relative flex flex-col items-center gap-1 lg:block">
        <ul className="animate-fade-in-delayed flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-11">
          {links.map((link) => (
            <li key={link.label}>
              <NavbarLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        <div className="lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
          <CTAButton
            label={pricingLink.label}
            href={pricingLink.href}
            className="px-6 py-2 text-[12px] tracking-[0.18em]"
          />
        </div>
      </div>
    </nav>
  );
}