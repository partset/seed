import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ClientLoginPage from "./ClientLoginPage";

vi.mock("../../components/shared/auth/AuthSplitLayout", () => ({
  default: ({
    formEyebrow,
    formTitle,
    formDescription,
    footerContent,
    children,
  }: {
    formEyebrow: string;
    formTitle: string;
    formDescription: string;
    footerContent: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div>
      <div>{formEyebrow}</div>
      <div>{formTitle}</div>
      <div>{formDescription}</div>
      <div>{footerContent}</div>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock("../../components/client/auth/ClientLoginForm", () => ({
  default: () => <div>Mock Client Login Form</div>,
}));

vi.mock("../../components/client/auth/ClientRequestSetupCodeForm", () => ({
  default: ({ onSuccess }: { onSuccess: (email: string) => void }) => (
    <div>
      <div>Mock Request Setup Code Form</div>
      <button onClick={() => onSuccess("client@test.com")}>
        Trigger Setup Success
      </button>
    </div>
  ),
}));

vi.mock("../../components/client/auth/ClientVerifySetupCodeForm", () => ({
  default: ({ email, onBack }: { email: string; onBack: () => void }) => (
    <div>
      <div>Mock Verify Setup Code Form</div>
      <div>{email}</div>
      <button onClick={onBack}>Go Back</button>
    </div>
  ),
}));

describe("ClientLoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login mode by default", () => {
    render(<ClientLoginPage />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use your email and password to access your client portal.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Mock Client Login Form")).toBeInTheDocument();
  });

  it("switches to request-code mode when first-time setup is clicked", async () => {
    const user = userEvent.setup();

    render(<ClientLoginPage />);

    await user.click(screen.getByRole("button", { name: /first-time setup/i }));

    expect(
      screen.getByRole("button", { name: /first-time setup/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Get Setup Code")).toBeInTheDocument();
    expect(
      screen.getByText(
        "First time here? Enter your email and we will send a one-time setup code.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mock Request Setup Code Form"),
    ).toBeInTheDocument();
  });

  it("switches to verify-code mode after request-code success", async () => {
    const user = userEvent.setup();

    render(<ClientLoginPage />);

    await user.click(screen.getByRole("button", { name: /first-time setup/i }));
    await user.click(
      screen.getByRole("button", { name: /trigger setup success/i }),
    );

    expect(screen.getByText("Verify Your Code")).toBeInTheDocument();
    expect(screen.getByText("Create Password")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter the code sent to your email and create a password for future sign-ins.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Mock Verify Setup Code Form")).toBeInTheDocument();
    expect(screen.getByText("client@test.com")).toBeInTheDocument();
  });

  it("returns to request-code mode when verify form back is clicked", async () => {
    const user = userEvent.setup();

    render(<ClientLoginPage />);

    await user.click(screen.getByRole("button", { name: /first-time setup/i }));
    await user.click(
      screen.getByRole("button", { name: /trigger setup success/i }),
    );
    await user.click(screen.getByRole("button", { name: /go back/i }));

    expect(screen.getByText("Get Setup Code")).toBeInTheDocument();
    expect(
      screen.getByText(
        "First time here? Enter your email and we will send a one-time setup code.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Get Setup Code")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Request Setup Code Form"),
    ).toBeInTheDocument();
  });

  it("returns to login mode when sign in is clicked", async () => {
    const user = userEvent.setup();

    render(<ClientLoginPage />);

    await user.click(screen.getByRole("button", { name: /first-time setup/i }));
    expect(
      screen.getByText("Mock Request Setup Code Form"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Mock Client Login Form")).toBeInTheDocument();
  });
});
