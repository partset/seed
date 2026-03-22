import AdminLoginForm from "../components/admin/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-background-dark)] text-[var(--color-foreground)]">
      <div className="hero-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[2px] border border-[rgba(240,236,228,0.14)] bg-[rgba(255,255,255,0.02)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between border-b border-[rgba(240,236,228,0.1)] p-8 lg:border-r lg:border-b-0 lg:p-12">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Internal Access
              </p>

              <div className="space-y-4">
                <h1
                  className="text-5xl leading-none sm:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ADMIN
                  <br />
                  PORTAL
                </h1>

                <p className="max-w-md text-[14px] leading-7 text-[var(--color-muted)]">
                  Sign in to manage incoming leads, convert businesses into
                  clients, track project progress, upload documents, and monitor
                  payments.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 text-[12px] uppercase tracking-[0.16em] text-[var(--color-muted)] sm:grid-cols-3">
              <div className="rounded-[2px] border border-[rgba(240,236,228,0.1)] px-4 py-4">
                Leads
              </div>
              <div className="rounded-[2px] border border-[rgba(240,236,228,0.1)] px-4 py-4">
                Clients
              </div>
              <div className="rounded-[2px] border border-[rgba(240,236,228,0.1)] px-4 py-4">
                Projects
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="mx-auto max-w-md space-y-8">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
                  Welcome Back
                </p>

                <div className="space-y-2">
                  <h2 className="text-2xl font-medium uppercase tracking-[0.12em]">
                    Sign In
                  </h2>
                  <p className="text-[13px] leading-6 text-[var(--color-muted)]">
                    Use your admin credentials to access the internal portal.
                  </p>
                </div>
              </div>

              <AdminLoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
