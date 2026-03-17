import { useEffect, useRef, useState } from "react";

type ContactSelectProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  options: readonly string[];
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  onChange: (name: string, value: string) => void;
};

export default function ContactSelect({
  id,
  name,
  label,
  value,
  placeholder = "Select an option",
  options,
  required = false,
  error = "",
  onBlur,
  onChange,
}: ContactSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const hasError = Boolean(error);
  const describedBy = hasError ? `${id}-error` : undefined;
  const selectedIndex = options.findIndex((option) => option === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: string) => {
    onChange(name, option);
    setIsOpen(false);
    onBlur?.();
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const nextIndex =
        selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;

      onChange(name, options[nextIndex]);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const nextIndex =
        selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;

      onChange(name, options[nextIndex]);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      onBlur?.();
    }
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      <div className="relative">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          onClick={handleToggle}
          onBlur={(event) => {
            const nextFocused = event.relatedTarget as Node | null;

            if (
              containerRef.current &&
              nextFocused &&
              containerRef.current.contains(nextFocused)
            ) {
              return;
            }

            onBlur?.();
          }}
          onKeyDown={handleKeyDown}
          className={`flex min-h-[48px] w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm outline-none transition ${
            hasError
              ? "border-[var(--color-error-border)] bg-white/10 text-foreground"
              : "border-white/10 bg-white/5 text-foreground focus:border-primary focus:bg-white/10"
          }`}
        >
          <span className={value ? "text-foreground" : "text-foreground/40"}>
            {value || placeholder}
          </span>

          <span
            className={`ml-4 text-xs text-foreground/60 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-labelledby={id}
            tabIndex={-1}
            className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[var(--color-background-dark)] p-2 shadow-xl"
          >
            {options.map((option) => {
              const isSelected = value === option;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center rounded-xl px-3 py-3 text-left text-sm transition ${
                    isSelected
                      ? "bg-white/10 text-primary"
                      : "text-foreground/80 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {hasError && (
        <p id={`${id}-error`} className="text-sm text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
