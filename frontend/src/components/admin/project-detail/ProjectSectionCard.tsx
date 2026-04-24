import type { ReactNode } from "react";

interface ProjectSectionCardProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ProjectSectionCard({
  title,
  description,
  action,
  children,
}: ProjectSectionCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2
            className="text-3xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            {description}
          </p>
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
}
