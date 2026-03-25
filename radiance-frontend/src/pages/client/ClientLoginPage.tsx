import { useState } from "react";
import ClientLoginForm from "../../components/client/auth/ClientLoginForm";
import ClientRequestSetupCodeForm from "../../components/client/auth/ClientRequestSetupCodeForm";
import ClientVerifySetupCodeForm from "../../components/client/auth/ClientVerifySetupCodeForm";
import AuthSplitLayout from "../../components/shared/auth/AuthSplitLayout";

type ClientAuthMode = "login" | "request-code" | "verify-code";

export default function ClientLoginPage() {
  const [mode, setMode] = useState<ClientAuthMode>("login");
  const [setupEmail, setSetupEmail] = useState("");

  const formEyebrow =
    mode === "login"
      ? "Welcome Back"
      : mode === "request-code"
        ? "First-Time Setup"
        : "Verify Your Code";

  const formTitle =
    mode === "login"
      ? "Sign In"
      : mode === "request-code"
        ? "Get Setup Code"
        : "Create Password";

  const formDescription =
    mode === "login"
      ? "Use your email and password to access your client portal."
      : mode === "request-code"
        ? "First time here? Enter your email and we will send a one-time setup code."
        : "Enter the code sent to your email and create a password for future sign-ins.";

  return (
    <AuthSplitLayout
      accessLabel="Client Access"
      title={
        <>
          CLIENT
          <br />
          PORTAL
        </>
      }
      description="Sign in to view project updates, shared documents, progress, and important information related to your company’s work with our team."
      featureItems={[
        { label: "Projects" },
        { label: "Files" },
        { label: "Updates" },
      ]}
      formEyebrow={formEyebrow}
      formTitle={formTitle}
      formDescription={formDescription}
      footerContent={
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Portal Access Options
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-[2px] border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition duration-200 ${
                mode === "login"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-white/10 text-[var(--color-muted)] hover:bg-white/5"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setMode("request-code")}
              className={`rounded-[2px] border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition duration-200 ${
                mode === "request-code" || mode === "verify-code"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-white/10 text-[var(--color-muted)] hover:bg-white/5"
              }`}
            >
              First-Time Setup
            </button>
          </div>

          <p className="text-[12px] leading-6 text-[var(--color-muted)]">
            If your company was just onboarded, use first-time setup to receive
            your one-time code and create your portal password.
          </p>
        </div>
      }
    >
      {mode === "login" ? <ClientLoginForm /> : null}

      {mode === "request-code" ? (
        <ClientRequestSetupCodeForm
          onSuccess={(email) => {
            setSetupEmail(email);
            setMode("verify-code");
          }}
        />
      ) : null}

      {mode === "verify-code" ? (
        <ClientVerifySetupCodeForm
          email={setupEmail}
          onBack={() => {
            setSetupEmail("");
            setMode("request-code");
          }}
        />
      ) : null}
    </AuthSplitLayout>
  );
}
