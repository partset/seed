type SideLabelProps = {
  leftText: string;
  rightText: string;
};

export default function SideLabel({ leftText, rightText }: SideLabelProps) {
  return (
    <div className="fixed left-4 top-1/2 z-[999] hidden -translate-y-1/2 items-center md:flex">
      <div
        className="flex items-center gap-6 whitespace-nowrap text-[12px] uppercase tracking-[0.2em] text-foreground/25"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        <span>{leftText}</span>
        <span className="inline-block h-6 w-px bg-foreground/20" />
        <span>{rightText}</span>
      </div>
    </div>
  );
}
