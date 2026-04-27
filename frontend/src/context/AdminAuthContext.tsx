import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { checkAdmin } from "../services/api/admin/auth/checkAdmin";
import { loginAdmin } from "../services/api/admin/auth/loginAdmin";
import type { AdminLoginFormValues } from "../types/adminAuth";

type AdminAuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: AdminLoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
};

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);

type AdminAuthProviderProps = {
  children: ReactNode;
};

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAdminAuth() {
      setIsLoading(true);

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!currentSession?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const adminResponse = await checkAdmin();

        if (!isMounted) {
          return;
        }

        if (!adminResponse.data.isAdmin) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
        setIsAdmin(true);
      } catch {
        await supabase.auth.signOut();

        if (!isMounted) {
          return;
        }

        setSession(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAdminAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) {
        return;
      }

      if (!newSession?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      setSession(newSession);
      setUser(newSession.user);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(values: AdminLoginFormValues) {
    setIsLoading(true);

    try {
      await loginAdmin(values);

      const {
        data: { session: freshSession },
      } = await supabase.auth.getSession();

      setSession(freshSession);
      setUser(freshSession?.user ?? null);
      setIsAdmin(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      session,
      isAdmin,
      isAuthenticated: Boolean(session && user && isAdmin),
      isLoading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [user, session, isAdmin, isLoading],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
