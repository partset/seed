export default function ClientSupportPanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Need Help?
        </p>

        <h2
          className="mt-3 text-3xl uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Support
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Contact our project team if you have questions about files, billing,
          or next steps.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Team
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            Gequence Support Team
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Email
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            support@gequence.com
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Phone
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            (111) - 111 - 1111
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Office Hours
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            Mon - Fri, 9:00 AM - 5:00 PM
          </p>
        </div>
      </div>
    </section>
  );
}
