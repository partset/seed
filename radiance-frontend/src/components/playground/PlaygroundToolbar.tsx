type PlaygroundToolbarProps = {
  onRun: () => void;
  onReset: () => void;
  onCopy: () => void;
};

const buttonBase =
  "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200";

export default function PlaygroundToolbar({
  onRun,
  onReset,
  onCopy,
}: PlaygroundToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onRun}
        className={`${buttonBase} border-transparent bg-[var(--color-primary)] text-black hover:opacity-90`}
      >
        Run
      </button>

      <button
        type="button"
        onClick={onReset}
        className={`${buttonBase} border-white/15 bg-white/5 text-foreground hover:bg-white/10`}
      >
        Reset
      </button>

      <button
        type="button"
        onClick={onCopy}
        className={`${buttonBase} border-white/15 bg-white/5 text-foreground hover:bg-white/10`}
      >
        Copy
      </button>
    </div>
  );
}
