interface LeadInfoRowProps {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}

export default function LeadInfoRow({
  label,
  value,
  fullWidth = false,
}: LeadInfoRowProps) {
  return (
    <div
      className={`rounded-[2px] border border-white/10 bg-white/5 px-4 py-4 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {label}
      </p>

      <p className="mt-2 text-[14px] leading-7 text-[var(--color-foreground)]">
        {value && value.trim().length > 0 ? value : "Not provided"}
      </p>
    </div>
  );
}
