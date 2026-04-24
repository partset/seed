type AdminAuthInputProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
};

export default function AdminAuthInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  disabled = false,
}: AdminAuthInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-[2px] border bg-transparent px-4 py-3 text-[14px] text-[var(--color-foreground)] outline-none transition duration-200 placeholder:text-[var(--color-muted)] ${
          error
            ? "border-[var(--color-error-border)]"
            : "border-[rgba(240,236,228,0.18)] focus:border-[var(--color-primary)]"
        } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
      />

      {error ? (
        <p id={`${id}-error`} className="text-[12px] text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
