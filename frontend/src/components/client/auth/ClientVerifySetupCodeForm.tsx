import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../shared/auth/AuthInput";
import { useClientAuth } from "../../../hooks/useClientAuth";

type ClientVerifySetupCodeFormProps = {
  email: string;
  onBack: () => void;
};

type FormErrors = {
  code?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

const INITIAL_ERRORS: FormErrors = {};

export default function ClientVerifySetupCodeForm({
  email,
  onBack,
}: ClientVerifySetupCodeFormProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const { verifySetupCodeAndSetPassword } = useClientAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!code.trim()) {
      nextErrors.code = "Setup code is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (nextErrors.code || nextErrors.password || nextErrors.confirmPassword) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors(INITIAL_ERRORS);

      await verifySetupCodeAndSetPassword({
        email,
        code,
        password,
        confirmPassword,
      });

      navigate("/client", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to verify setup code.";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Setup Email
        </p>
        <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
          {email}
        </p>
      </div>

      <div className="space-y-5">
        <AuthInput
          id="client-setup-code"
          name="code"
          type="text"
          label="6-Digit Code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setErrors((prev) => ({ ...prev, code: "", form: "" }));
          }}
          placeholder="Enter your code"
          autoComplete="one-time-code"
          error={errors.code}
          disabled={isSubmitting}
        />

        <AuthInput
          id="client-setup-password"
          name="password"
          type={showPasswords ? "text" : "password"}
          label="Create Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: "", form: "" }));
          }}
          placeholder="Create your password"
          autoComplete="new-password"
          error={errors.password}
          disabled={isSubmitting}
        />

        <AuthInput
          id="client-setup-confirm-password"
          name="confirmPassword"
          type={showPasswords ? "text" : "password"}
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "",
              form: "",
            }));
          }}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPasswords((prev) => !prev)}
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-primary)]"
          >
            {showPasswords ? "Hide Passwords" : "Show Passwords"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-primary)]"
          >
            Use Different Email
          </button>
        </div>
      </div>

      {errors.form ? (
        <div className="rounded-[2px] border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.06)] px-4 py-3">
          <p className="text-[12px] text-[var(--color-error)]">{errors.form}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-block w-full rounded-[2px] border border-[var(--color-foreground)] px-9 py-3.5 text-[14px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Finishing Setup..." : "Verify Code & Create Password"}
      </button>
    </form>
  );
}
