type FooterNavLinkProps = {
  label: string;
  href: string;
};

export default function FooterNavLink({ label, href }: FooterNavLinkProps) {
  return (
    <a
      href={href}
      className="text-[14px] uppercase tracking-[0.15em] text-foreground/35 transition-colors duration-200 hover:text-foreground"
    >
      {label}
    </a>
  );
}
