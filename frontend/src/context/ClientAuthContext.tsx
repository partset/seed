import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { checkClient } from "../services/api/client/auth/checkClient";
import { loginClient } from "../services/api/client/auth/loginClient";
import type {
  ClientLoginFormValues,
  ClientSetupCodeRequestValues,
  ClientVerifySetupCodeValues,
} from "../types/clientAuth";

type ClientAuthContextValue = {
  user: User | null;
  session: Session | null;
  isClient: boolean;
  companyId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: ClientLoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  sendSetupCode: (values: ClientSetupCodeRequestValues) => Promise<void>;
  verifySetupCodeAndSetPassword: (
    values: ClientVerifySetupCodeValues,
  ) => Promise<void>;
};

export const ClientAuthContext = createContext<
  ClientAuthContextValue | undefined
>(undefined);

type ClientAuthProviderProps = {
  children: ReactNode;
};

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeClientAuth() {
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
        setIsClient(false);
        setIsLoading(false);
        setCompanyId(null);
        return;
      }

      try {
        const clientResponse = await checkClient();

        if (!isMounted) {
          return;
        }

        if (!clientResponse.data.isClient) {
          await supabase.auth.signOut();

          setSession(null);
          setUser(null);
          setIsClient(false);
          setIsLoading(false);
          setCompanyId(null);
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
        setIsClient(true);
        setCompanyId(clientResponse.data.companyId);
      } catch {
        await supabase.auth.signOut();

        if (!isMounted) {
          return;
        }

        setSession(null);
        setUser(null);
        setIsClient(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeClientAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) {
        return;
      }

      if (!newSession?.user) {
        setSession(null);
        setUser(null);
        setIsClient(false);
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

  async function handleLogin(values: ClientLoginFormValues) {
    setIsLoading(true);

    try {
      const result = await loginClient(values);

      const {
        data: { session: freshSession },
      } = await supabase.auth.getSession();

      setSession(freshSession);
      setUser(freshSession?.user ?? null);
      setIsClient(true);
      setCompanyId(result.companyId);
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
      setIsClient(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendSetupCode(values: ClientSetupCodeRequestValues) {
    const normalizedEmail = values.email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      throw new Error(error.message || "Unable to send setup code.");
    }
  }

  async function handleVerifySetupCodeAndSetPassword(
    values: ClientVerifySetupCodeValues,
  ) {
    const normalizedEmail = values.email.trim().toLowerCase();
    const normalizedCode = values.code.trim();

    if (!values.password.trim()) {
      throw new Error("Password is required.");
    }

    if (values.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (values.password !== values.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedCode,
      type: "email",
    });

    if (verifyError) {
      throw new Error(verifyError.message || "Invalid or expired setup code.");
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (passwordError) {
      throw new Error(passwordError.message || "Unable to set password.");
    }

    const clientResponse = await checkClient();

    if (!clientResponse.data.isClient) {
      await supabase.auth.signOut();
      throw new Error("You do not have access to the client portal.");
    }

    const {
      data: { session: freshSession },
    } = await supabase.auth.getSession();

    setSession(freshSession);
    setUser(freshSession?.user ?? null);
    setIsClient(true);
  }

  const value = useMemo<ClientAuthContextValue>(
    () => ({
      user,
      session,
      isClient,
      companyId,
      isAuthenticated: Boolean(session && user && isClient),
      isLoading,
      login: handleLogin,
      logout: handleLogout,
      sendSetupCode: handleSendSetupCode,
      verifySetupCodeAndSetPassword: handleVerifySetupCodeAndSetPassword,
    }),
    [user, session, isClient, isLoading],
  );

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}
