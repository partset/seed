import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../shared/auth/AuthInput";
import { useClientAuth } from "../../../hooks/useClientAuth";

type ClientLoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const INITIAL_ERRORS: ClientLoginErrors = {};

export default function ClientLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ClientLoginErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useClientAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nextErrors: ClientLoginErrors = {};

    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = "Valid email is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors(INITIAL_ERRORS);

      await login({
        email: normalizedEmail,
        password,
      });

      navigate("/client", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-5">
        <AuthInput
          id="client-login-email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((prev) => ({ ...prev, email: "", form: "" }));
          }}
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <AuthInput
            id="client-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((prev) => ({ ...prev, password: "", form: "" }));
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-primary)]"
          >
            {showPassword ? "Hide Password" : "Show Password"}
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
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
