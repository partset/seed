import { useId, useMemo, useState } from "react";

interface ClientUpdateDescriptionProps {
  description: string;
  maxLength?: number;
}

export default function ClientUpdateDescription({
  description,
  maxLength = 140,
}: ClientUpdateDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionId = useId();

  const shouldTruncate = description.length > maxLength;

  const truncatedDescription = useMemo(() => {
    if (!shouldTruncate) {
      return description;
    }

    return `${description.slice(0, maxLength).trimEnd()}...`;
  }, [description, maxLength, shouldTruncate]);

  const visibleDescription = isExpanded ? description : truncatedDescription;

  return (
    <div className="mt-2 w-full overflow-hidden">
      <p
        id={descriptionId}
        className="whitespace-normal break-words [overflow-wrap:anywhere] text-sm leading-7 text-[var(--color-muted)]"
      >
        {visibleDescription}
      </p>

      {shouldTruncate ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={descriptionId}
          onClick={() => setIsExpanded((previousValue) => !previousValue)}
          className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:opacity-80"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      ) : null}
    </div>
  );
}
