import type { NavLink } from "../../constants/hero";
import NavbarLink from "./NavbarLink";

type NavbarProps = {
  links: NavLink[];
};

export default function Navbar({ links }: NavbarProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center px-5 py-[18px] sm:px-9 sm:py-7">
      <ul className="animate-fade-in-delayed flex list-none items-center gap-6 sm:gap-11">
        {links.map((link) => (
          <li key={link.label}>
            <NavbarLink label={link.label} href={link.href} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
