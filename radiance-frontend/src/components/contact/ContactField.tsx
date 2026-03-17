type ContactFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ContactField({
  id,
  name,
  label,
  type = "text",
  value,
  placeholder,
  required = false,
  error = "",
  inputMode,
  maxLength,
  onBlur,
  onChange,
}: ContactFieldProps) {
  const hasError = Boolean(error);
  const describedBy = hasError ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition ${
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
