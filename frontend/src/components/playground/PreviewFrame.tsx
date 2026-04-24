type PreviewFrameProps = {
  html: string;
  title?: string;
};

export default function PreviewFrame({
  html,
  title = "HTML Preview",
}: PreviewFrameProps) {
  return (
    <div className="h-full min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
          {title}
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/35">
          Live
        </span>
      </div>

      <iframe
        title={title}
        srcDoc={html}
        sandbox="allow-scripts allow-modals"
        className="h-[560px] w-full bg-white"
      />
    </div>
  );
}
