type ContactTextareaProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function ContactTextarea({
  id,
  name,
  label,
  value,
  placeholder,
  required = false,
  rows = 6,
  error = "",
  onBlur,
  onChange,
}: ContactTextareaProps) {
  const hasError = Boolean(error);
  const describedBy = hasError ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onBlur={onBlur}
        onChange={onChange}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition ${
          hasError
            ? "border-[var(--color-error-border)] bg-white/10"
            : "border-white/10 bg-white/5 focus:border-primary focus:bg-white/10"
        }`}
      />

      {hasError && (
        <p id={`${id}-error`} className="text-sm text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
