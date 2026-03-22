import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ContactForm from "./ContactForm";
import { submitLead } from "../../services/api/lead/submit/api";

vi.mock("../../services/api/leads/submit/api", () => ({
  submitLead: vi.fn(),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows required validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    expect(screen.getByText("Company name is required.")).toBeInTheDocument();
    expect(screen.getByText("Project type is required.")).toBeInTheDocument();
    expect(screen.getByText("Message is required.")).toBeInTheDocument();
    expect(
      screen.getByText("You must agree before submitting the form."),
    ).toBeInTheDocument();
  });

  it("auto-formats the phone number as the user types", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "5551234567");

    expect(phoneInput).toHaveValue("(555) 123-4567");
  });

  it("shows a phone validation error when fewer than 10 digits are entered", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "555123456");
    await user.tab();

    expect(
      screen.getByText("Phone number must contain exactly 10 digits."),
    ).toBeInTheDocument();
  });

  it("allows selecting a project type from the custom select", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const projectTypeButton = screen.getByRole("button", {
      name: /project type/i,
    });

    await user.click(projectTypeButton);
    await user.click(screen.getByRole("option", { name: /landing page/i }));

    expect(projectTypeButton).toHaveTextContent("Landing Page");
  });

  it("submits successfully when all required fields are valid", async () => {
    const user = userEvent.setup();

    vi.mocked(submitLead).mockResolvedValue({
      success: true,
      data: { leadId: "123" },
      error: "",
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/first name/i), "Alex");
    await user.type(screen.getByLabelText(/last name/i), "Pham");
    await user.type(screen.getByLabelText(/^email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/phone/i), "5551234567");
    await user.type(screen.getByLabelText(/company/i), "Seed");

    const projectTypeButton = screen.getByRole("button", {
      name: /project type/i,
    });

    await user.click(projectTypeButton);
    await user.click(screen.getByRole("option", { name: /landing page/i }));

    await user.type(
      screen.getByLabelText(/message/i),
      "I need a landing page for my company.",
    );

    await user.click(
      screen.getByLabelText(/i agree to the collection of my information/i),
    );

    await user.click(screen.getByRole("button", { name: /send inquiry/i }));

    await waitFor(() => {
      expect(submitLead).toHaveBeenCalledWith({
        firstName: "Alex",
        lastName: "Pham",
        email: "alex@example.com",
        phone: "(555) 123-4567",
        companyName: "Seed",
        projectType: "Landing Page",
        message: "I need a landing page for my company.",
      });
    });

    expect(
      await screen.findByText(
        "Your inquiry has been submitted. We will get back to you soon.",
      ),
    ).toBeInTheDocument();
  });
});
