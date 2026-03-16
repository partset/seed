import { Link } from "react-router-dom";

type NavbarLinkProps = {
  label: string;
  href: string;
};

export default function NavbarLink({ label, href }: NavbarLinkProps) {
  return (
    <Link
      to={href}
      className="group relative font-mono text-[14px] font-medium uppercase tracking-[0.15em] text-foreground/55 transition-opacity duration-200 hover:text-foreground hover:opacity-100 sm:text-[14px]"
    >
      {label}
      <span className="absolute -bottom-[5px] left-0 right-0 h-px origin-center scale-x-0 bg-foreground transition-transform duration-200 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
