import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

export default function AdminProtectedRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-background-dark)] px-6 text-[var(--color-foreground)]">
        <div className="rounded-[2px] border border-[rgba(240,236,228,0.14)] bg-[rgba(255,255,255,0.02)] px-6 py-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
