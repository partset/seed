import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type {
  AdminLoginErrors,
  AdminLoginFormValues,
} from "../../../types/adminAuth";
import {
  hasAdminLoginErrors,
  validateAdminLogin,
} from "../../../utils/auth/adminLoginValidation";
import AdminAuthInput from "./AdminAuthInput";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const INITIAL_VALUES: AdminLoginFormValues = {
  email: "",
  password: "",
};

const INITIAL_ERRORS: AdminLoginErrors = {};

export default function AdminLoginForm() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [values, setValues] = useState<AdminLoginFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<AdminLoginErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateAdminLogin(values);

    if (hasAdminLoginErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors(INITIAL_ERRORS);

    try {
      await login(values);
      navigate("/admin/leads");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      setErrors({
        form: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-5">
        <AdminAuthInput
          id="admin-email"
          name="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <AdminAuthInput
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={values.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-primary)]"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>

            <Link
              to="/admin/forgot-password"
              className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition duration-200 hover:text-[var(--color-primary)]"
            >
              Forgot Password
            </Link>
          </div>
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
