import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useClientAuth } from "../../../hooks/useClientAuth";

export default function ClientProtectedRoute() {
  const { isAuthenticated, isLoading, isClient } = useClientAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-background-dark)] px-6 text-[var(--color-foreground)]">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Loading client portal...
        </p>
      </main>
    );
  }

  if (!isAuthenticated || !isClient) {
    return <Navigate to="/client/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
