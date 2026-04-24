type TaglineProps = {
  text: string;
};

export default function Tagline({ text }: TaglineProps) {
  return (
    <p className="animate-fade-up relative z-[2] mb-12 max-w-[600px] text-center text-[clamp(14px,1.5vw,16px)] leading-[1.55] font-light tracking-[0.01em] text-foreground/75">
      {text}
    </p>
  );
}
