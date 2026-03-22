import { useState } from "react";
import ContactField from "./ContactField";
import ContactTextarea from "./ContactTextarea";
import type { ContactFormData } from "../../types/contact";
import { PROJECT_TYPE_OPTIONS } from "../../constants/contact";
import ContactSelect from "./ContactSelect";
import { submitLead } from "../../services/api/lead/submit/api";
import {
  formatUsPhoneNumber,
  validateContactField,
  validateContactForm,
  hasContactFormErrors,
  type ContactFormErrors,
} from "../../utils/contactValidation";

const initialFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  message: "",
  consent: false,
};

const initialTouchedState: Partial<Record<keyof ContactFormData, boolean>> = {};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [touched, setTouched] =
    useState<Partial<Record<keyof ContactFormData, boolean>>>(
      initialTouchedState,
    );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setFieldValue = <K extends keyof ContactFormData>(
    name: K,
    value: ContactFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]:
          typeof value === "boolean"
            ? validateContactField(name, value)
            : validateContactField(name, String(value)),
      }));
    }
  };

  const markFieldTouched = (name: keyof ContactFormData) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateContactField(name, formData[name]),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof ContactFormData;

    if (type === "checkbox") {
      setFieldValue(fieldName, checked);
      return;
    }

    if (name === "phone") {
      setFieldValue(fieldName, formatUsPhoneNumber(value));
      return;
    }

    setFieldValue(fieldName, value);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof ContactFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitted(false);

    const nextErrors = validateContactForm(formData);
    setErrors(nextErrors);

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      company: true,
      projectType: true,
      message: true,
      consent: true,
    });

    if (hasContactFormErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.company,
        projectType: formData.projectType,
        message: formData.message,
      });

      setIsSubmitted(true);
      setFormData(initialFormData);
      setTouched(initialTouchedState);
      setErrors({});
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur md:p-8">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="firstName"
            name="firstName"
            label="First name"
            value={formData.firstName}
            placeholder="John"
            required={true}
            error={touched.firstName ? errors.firstName : ""}
            onBlur={() => markFieldTouched("firstName")}
            onChange={handleInputChange}
          />

          <ContactField
            id="lastName"
            name="lastName"
            label="Last name"
            value={formData.lastName}
            placeholder="Kim"
            required={true}
            error={touched.lastName ? errors.lastName : ""}
            onBlur={() => markFieldTouched("lastName")}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            placeholder="you@example.com"
            required={true}
            error={touched.email ? errors.email : ""}
            onBlur={() => markFieldTouched("email")}
            onChange={handleInputChange}
          />

          <ContactField
            id="phone"
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            placeholder="(555) 123-4567"
            required={true}
            inputMode="numeric"
            maxLength={14}
            error={touched.phone ? errors.phone : ""}
            onBlur={() => markFieldTouched("phone")}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ContactField
            id="company"
            name="company"
            label="Company"
            value={formData.company}
            placeholder="Your business name"
            required={true}
            error={touched.company ? errors.company : ""}
            onBlur={() => markFieldTouched("company")}
            onChange={handleInputChange}
          />

          <div className="flex flex-col gap-2">
            <ContactSelect
              id="projectType"
              name="projectType"
              label="Project type"
              value={formData.projectType}
              placeholder="Select a project type"
              options={PROJECT_TYPE_OPTIONS}
              required={true}
              error={touched.projectType ? errors.projectType : ""}
              onBlur={() => markFieldTouched("projectType")}
              onChange={(name, value) =>
                setFieldValue(name as keyof ContactFormData, value)
              }
            />
          </div>
        </div>

        <ContactTextarea
          id="message"
          name="message"
          label="Message"
          value={formData.message}
          placeholder="Tell us about your goals, timeline, and what kind of website you need."
          required={true}
          rows={7}
          error={touched.message ? errors.message : ""}
          onBlur={() => markFieldTouched("message")}
          onChange={handleTextareaChange}
        />

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3 text-sm text-foreground/80">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleInputChange}
              onBlur={() => markFieldTouched("consent")}
              aria-invalid={Boolean(touched.consent && errors.consent)}
              aria-describedby={
                touched.consent && errors.consent ? "consent-error" : undefined
              }
              className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/5"
            />
            <span>
              I agree to the collection of my information for the purpose of
              responding to this inquiry.
            </span>
          </label>

          {touched.consent && errors.consent && (
            <p id="consent-error" className="text-sm text-[var(--color-error)]">
              {errors.consent}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-primary/20 bg-primary px-6 py-3 text-sm font-semibold text-background-dark transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Send Inquiry"}
          </button>

          {isSubmitted && (
            <p className="text-sm text-[var(--color-success)]">
              Your inquiry has been submitted. We will get back to you soon.
            </p>
          )}

          {submitError && (
            <p className="text-sm text-[var(--color-error)]">{submitError}</p>
          )}
        </div>
      </form>
    </div>
  );
}
