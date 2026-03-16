import { Link } from "react-router-dom";

type CTAButtonProps = {
  label: string;
  href: string;
  className?: string;
};

export default function CTAButton({
  label,
  href,
  className = "",
}: CTAButtonProps) {
  return (
    <Link
      to={href}
      className={`inline-block rounded-[2px] border border-foreground px-9 py-3.5 text-[14px] font-medium uppercase tracking-[0.2em] text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-foreground/8 ${className}`}
    >
      {label}
    </Link>
  );
}
