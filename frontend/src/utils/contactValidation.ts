import type { ContactFormData } from "../types/contact";

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatUsPhoneNumber(value: string): string {
  const digits = getPhoneDigits(value).slice(0, 10);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function validateContactField(
  name: keyof ContactFormData,
  value: string | boolean,
): string {
  switch (name) {
    case "firstName":
      return typeof value === "string" && isEmpty(value)
        ? "First name is required."
        : "";

    case "lastName":
      return typeof value === "string" && isEmpty(value)
        ? "Last name is required."
        : "";

    case "email":
      if (typeof value !== "string" || isEmpty(value)) {
        return "Email is required.";
      }

      if (!emailRegex.test(value.trim())) {
        return "Please enter a valid email address.";
      }

      return "";

    case "phone": {
      if (typeof value !== "string" || isEmpty(value)) {
        return "Phone number is required.";
      }

      const digits = getPhoneDigits(value);

      if (digits.length !== 10) {
        return "Phone number must contain exactly 10 digits.";
      }

      return "";
    }

    case "company":
      return typeof value === "string" && isEmpty(value)
        ? "Company name is required."
        : "";

    case "projectType":
      return typeof value === "string" && isEmpty(value)
        ? "Project type is required."
        : "";

    case "message":
      if (typeof value !== "string" || isEmpty(value)) {
        return "Message is required.";
      }

      if (value.trim().length < 10) {
        return "Message must be at least 10 characters.";
      }

      return "";

    case "consent":
      return value === true ? "" : "You must agree before submitting the form.";

    default:
      return "";
  }
}

export function validateContactForm(
  formData: ContactFormData,
): ContactFormErrors {
  return {
    firstName: validateContactField("firstName", formData.firstName),
    lastName: validateContactField("lastName", formData.lastName),
    email: validateContactField("email", formData.email),
    phone: validateContactField("phone", formData.phone),
    company: validateContactField("company", formData.company),
    projectType: validateContactField("projectType", formData.projectType),
    message: validateContactField("message", formData.message),
    consent: validateContactField("consent", formData.consent),
  };
}

export function hasContactFormErrors(errors: ContactFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
