import { leadStatusOptions } from "../../../constants/leadStatusOptions";
import type { LeadStatus } from "../../../types/lead";

export interface LeadEditFormValues {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  status: LeadStatus;
}

interface LeadEditFormProps {
  values: LeadEditFormValues;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isSaving: boolean;
  error?: string;
  leadId: string;
  createdAtLabel: string;
}

interface FieldProps {
  label: string;
  name: keyof LeadEditFormValues;
  value: string;
  onChange: LeadEditFormProps["onChange"];
  type?: string;
  fullWidth?: boolean;
}

function LeadEditField({
  label,
  name,
  value,
  onChange,
  type = "text",
  fullWidth = false,
}: FieldProps) {
  return (
    <label
      className={`block rounded-[2px] border border-white/10 bg-white/5 px-4 py-4 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {label}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-3 w-full border-none bg-transparent text-[14px] leading-7 text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]"
      />
    </label>
  );
}

export default function LeadEditForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isSaving,
  error = "",
  leadId,
  createdAtLabel,
}: LeadEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Edit Lead
            </p>

            <div className="space-y-2">
              <h2
                className="text-3xl uppercase md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {values.companyName || "Untitled Lead"}
              </h2>

              <p className="text-[14px] leading-7 text-[var(--color-muted)]">
                Submitted on {createdAtLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Lead ID
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {leadId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[2px] border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] px-4 py-4">
          <p className="text-sm leading-7 text-[var(--color-error)]">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <LeadEditField
          label="Company Name"
          name="companyName"
          value={values.companyName}
          onChange={onChange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <LeadEditField
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={onChange}
          />
          <LeadEditField
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={onChange}
          />
        </div>

        <LeadEditField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
        />

        <LeadEditField
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={onChange}
        />

        <LeadEditField
          label="Project Type"
          name="projectType"
          value={values.projectType}
          onChange={onChange}
        />

        <label className="block rounded-[2px] border border-white/10 bg-white/5 px-4 py-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Status
          </span>

          <select
            name="status"
            value={values.status}
            onChange={onChange}
            className="mt-3 w-full border-none bg-transparent text-[14px] leading-7 text-[var(--color-foreground)] outline-none"
          >
            {leadStatusOptions.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-black text-white"
              >
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-[2px] border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Submitted
          </p>

          <p className="mt-3 text-[14px] leading-7 text-[var(--color-foreground)]">
            {createdAtLabel}
          </p>
        </div>

        <label className="block rounded-[2px] border border-white/10 bg-white/5 px-4 py-4 md:col-span-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Message
          </span>

          <textarea
            name="message"
            value={values.message}
            onChange={onChange}
            rows={6}
            className="mt-3 w-full resize-none border-none bg-transparent text-[14px] leading-7 text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-[2px] border border-[var(--color-primary)] px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
