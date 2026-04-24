import { useState } from "react";

interface AddUpdateFormProps {
  onSubmit: (payload: {
    title: string;
    description: string;
    isVisibleToClient: boolean;
  }) => void;
}

export default function AddUpdateForm({ onSubmit }: AddUpdateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleToClient, setIsVisibleToClient] = useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      isVisibleToClient,
    });

    setTitle("");
    setDescription("");
    setIsVisibleToClient(true);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-black/20 p-4"
    >
      <div className="grid gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Update Title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Enter update title"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Describe what changed"
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-[var(--color-foreground)]">
          <input
            type="checkbox"
            checked={isVisibleToClient}
            onChange={(event) => setIsVisibleToClient(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/30"
          />
          Visible to client
        </label>
        <div>
          <button
            type="submit"
            className="rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
          >
            Save Update
          </button>
        </div>
      </div>
    </form>
  );
}
