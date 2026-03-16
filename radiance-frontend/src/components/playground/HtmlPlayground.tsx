import { useMemo, useState } from "react";
import { DEFAULT_HTML } from "../../constants/playground";
import PlaygroundToolbar from "./PlaygroundToolbar";
import PreviewFrame from "./PreviewFrame";

export default function HtmlPlayground() {
  const [editorValue, setEditorValue] = useState(DEFAULT_HTML);
  const [previewValue, setPreviewValue] = useState(DEFAULT_HTML);
  const [copyLabel, setCopyLabel] = useState("Copy");

  const characterCount = useMemo(() => editorValue.length, [editorValue]);

  function handleRun() {
    setPreviewValue(editorValue);
  }

  function handleReset() {
    setEditorValue(DEFAULT_HTML);
    setPreviewValue(DEFAULT_HTML);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(editorValue);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1500);
    } catch {
      setCopyLabel("Failed");
      window.setTimeout(() => setCopyLabel("Copy"), 1500);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 pb-14 pt-28 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Playground
        </p>

        <h1 className="font-[var(--font-display)] text-5xl uppercase leading-none text-foreground sm:text-7xl">
          Build Simple HTML
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
          Write HTML in the editor, preview it instantly, and experiment with
          simple structures, styles, and interactions.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <PlaygroundToolbar
          onRun={handleRun}
          onReset={handleReset}
          onCopy={handleCopy}
        />

        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/45">
          {characterCount} chars · {copyLabel}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">
              HTML Editor
            </p>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/35">
              Editable
            </span>
          </div>

          <textarea
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            spellCheck={false}
            className="h-[560px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm leading-6 text-foreground outline-none placeholder:text-foreground/25"
            placeholder="Write your HTML here..."
            aria-label="HTML editor"
          />
        </div>

        <PreviewFrame html={previewValue} />
      </div>
    </section>
  );
}
