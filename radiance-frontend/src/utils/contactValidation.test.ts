import {
  formatUsPhoneNumber,
  getPhoneDigits,
  hasContactFormErrors,
  validateContactField,
  validateContactForm,
} from "./contactValidation";

describe("contactValidation", () => {
  describe("getPhoneDigits", () => {
    it("removes non-digit characters", () => {
      expect(getPhoneDigits("(555) 123-4567")).toBe("5551234567");
    });
  });

  describe("formatUsPhoneNumber", () => {
    it("returns an empty string for empty input", () => {
      expect(formatUsPhoneNumber("")).toBe("");
    });

    it("formats fewer than 4 digits", () => {
      expect(formatUsPhoneNumber("55")).toBe("(55");
    });

    it("formats 6 digits", () => {
      expect(formatUsPhoneNumber("555123")).toBe("(555) 123");
    });

    it("formats 10 digits", () => {
      expect(formatUsPhoneNumber("5551234567")).toBe("(555) 123-4567");
    });

    it("ignores extra digits beyond 10", () => {
      expect(formatUsPhoneNumber("5551234567899")).toBe("(555) 123-4567");
    });

    it("ignores non-digit characters", () => {
      expect(formatUsPhoneNumber("555-123-abcd-4567")).toBe("(555) 123-4567");
    });
  });

  describe("validateContactField", () => {
    it("requires first name", () => {
      expect(validateContactField("firstName", "")).toBe(
        "First name is required.",
      );
    });

    it("requires a valid email", () => {
      expect(validateContactField("email", "not-an-email")).toBe(
        "Please enter a valid email address.",
      );
    });

    it("requires exactly 10 digits for phone", () => {
      expect(validateContactField("phone", "(555) 123-456")).toBe(
        "Phone number must contain exactly 10 digits.",
      );
    });

    it("accepts a valid formatted phone number", () => {
      expect(validateContactField("phone", "(555) 123-4567")).toBe("");
    });

    it("requires project type", () => {
      expect(validateContactField("projectType", "")).toBe(
        "Project type is required.",
      );
    });

    it("requires message length of at least 10 characters", () => {
      expect(validateContactField("message", "Too short")).toBe(
        "Message must be at least 10 characters.",
      );
    });

    it("requires consent", () => {
      expect(validateContactField("consent", false)).toBe(
        "You must agree before submitting the form.",
      );
    });
  });

  describe("validateContactForm", () => {
    it("returns errors for an invalid form", () => {
      const result = validateContactForm({
        firstName: "",
        lastName: "",
        email: "bad",
        phone: "123",
        company: "",
        projectType: "",
        message: "short",
        consent: false,
      });

      expect(result.firstName).toBe("First name is required.");
      expect(result.lastName).toBe("Last name is required.");
      expect(result.email).toBe("Please enter a valid email address.");
      expect(result.phone).toBe("Phone number must contain exactly 10 digits.");
      expect(result.company).toBe("Company name is required.");
      expect(result.projectType).toBe("Project type is required.");
      expect(result.message).toBe("Message must be at least 10 characters.");
      expect(result.consent).toBe("You must agree before submitting the form.");
    });

    it("returns no errors for a valid form", () => {
      const result = validateContactForm({
        firstName: "Alex",
        lastName: "Pham",
        email: "alex@example.com",
        phone: "(555) 123-4567",
        company: "Seed",
        projectType: "Landing Page",
        message: "I need a landing page for my business.",
        consent: true,
      });

      expect(hasContactFormErrors(result)).toBe(false);
    });
  });

  describe("hasContactFormErrors", () => {
    it("returns true when any error exists", () => {
      expect(hasContactFormErrors({ email: "Invalid email" })).toBe(true);
    });

    it("returns false when all errors are empty", () => {
      expect(hasContactFormErrors({ email: "", phone: "" })).toBe(false);
    });
  });
});
