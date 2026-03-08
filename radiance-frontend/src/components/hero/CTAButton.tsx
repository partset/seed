type CTAButtonProps = {
  label: string;
  href: string;
};

export default function CTAButton({ label, href }: CTAButtonProps) {
  return (
    <div className="animate-fade-in-cta relative z-[2] mt-[52px]">
      <a
        href={href}
        className="inline-block rounded-[2px] border border-foreground bg-transparent px-9 py-3.5 text-[14px] font-medium uppercase tracking-[0.2em] text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-foreground/8"
      >
        {label}
      </a>
    </div>
  );
}
