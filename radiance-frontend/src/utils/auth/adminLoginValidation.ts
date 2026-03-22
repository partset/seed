import type {
  AdminLoginErrors,
  AdminLoginFormValues,
} from "../../types/adminAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAdminLogin(
  values: AdminLoginFormValues,
): AdminLoginErrors {
  const errors: AdminLoginErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function hasAdminLoginErrors(errors: AdminLoginErrors): boolean {
  return Boolean(errors.email || errors.password || errors.form);
}
