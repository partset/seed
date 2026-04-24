interface CompanyStatCardProps {
  label: string;
  value: string | number;
}

export default function CompanyStatCard({
  label,
  value,
}: CompanyStatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-medium text-[var(--color-foreground)]">
        {value}
      </p>
    </div>
  );
}
