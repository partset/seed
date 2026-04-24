import { describe, it, expect } from "vitest";
import {
  validateAdminLogin,
  hasAdminLoginErrors,
} from "./adminLoginValidation";

describe("validateAdminLogin", () => {
  it("returns email required when email is missing", () => {
    const result = validateAdminLogin({
      email: "",
      password: "password123",
    });

    expect(result).toEqual({
      email: "Email is required.",
    });
  });

  it("returns email format error when email is invalid", () => {
    const result = validateAdminLogin({
      email: "alexexample.com",
      password: "password123",
    });

    expect(result).toEqual({
      email: "Please enter a valid email address.",
    });
  });

  it("returns password required when password is missing", () => {
    const result = validateAdminLogin({
      email: "alex@example.com",
      password: "",
    });

    expect(result).toEqual({
      password: "Password is required.",
    });
  });

  it("returns both errors when both fields are invalid", () => {
    const result = validateAdminLogin({
      email: "",
      password: "",
    });

    expect(result).toEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
  });

  it("returns empty object when values are valid", () => {
    const result = validateAdminLogin({
      email: "alex@example.com",
      password: "password123",
    });

    expect(result).toEqual({});
  });
});

describe("hasAdminLoginErrors", () => {
  it("returns true when errors exist", () => {
    expect(
      hasAdminLoginErrors({
        email: "Email is required.",
      }),
    ).toBe(true);
  });

  it("returns false when no errors exist", () => {
    expect(hasAdminLoginErrors({})).toBe(false);
  });
});
