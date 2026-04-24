import { useState } from "react";
import AuthInput from "../../shared/auth/AuthInput";
import { useClientAuth } from "../../../hooks/useClientAuth";

type ClientRequestSetupCodeFormProps = {
  onSuccess: (email: string) => void;
};

type FormErrors = {
  email?: string;
  form?: string;
};

const INITIAL_ERRORS: FormErrors = {};

export default function ClientRequestSetupCodeForm({
  onSuccess,
}: ClientRequestSetupCodeFormProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendSetupCode } = useClientAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      setErrors({ email: "Email is required." });
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setErrors({ email: "Valid email is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors(INITIAL_ERRORS);

      await sendSetupCode({ email: normalizedEmail });
      onSuccess(normalizedEmail);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send setup code.";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <AuthInput
        id="client-setup-email"
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
        {isSubmitting ? "Sending Code..." : "Send Setup Code"}
      </button>
    </form>
  );
}
