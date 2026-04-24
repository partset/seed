import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type {
  ClientLoginFormValues,
  ClientSetupCodeRequestValues,
  ClientVerifySetupCodeValues,
} from "../types/clientAuth";

type ClientAuthContextValue = {
  user: User | null;
  session: Session | null;
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
  const [isLoading, setIsLoading] = useState(true);

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

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    }

    initializeClientAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) {
        return;
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(values: ClientLoginFormValues) {
    const normalizedEmail = values.email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: values.password,
    });

    if (error) {
      throw new Error(error.message || "Unable to sign in.");
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message || "Unable to sign out.");
    }

    setSession(null);
    setUser(null);
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
  }

  const value = useMemo<ClientAuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(session && user),
      isLoading,
      login: handleLogin,
      logout: handleLogout,
      sendSetupCode: handleSendSetupCode,
      verifySetupCodeAndSetPassword: handleVerifySetupCodeAndSetPassword,
    }),
    [user, session, isLoading],
  );

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}
