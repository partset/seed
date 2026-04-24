import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ClientVerifySetupCodeForm from "./ClientVerifySetupCodeForm";
import { useClientAuth } from "../../../hooks/useClientAuth";

const mockNavigate = vi.fn();
const mockVerifySetupCodeAndSetPassword = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../hooks/useClientAuth", () => ({
  useClientAuth: vi.fn(),
}));

const mockUseClientAuth = vi.mocked(useClientAuth);

describe("ClientVerifySetupCodeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseClientAuth.mockReturnValue({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      sendSetupCode: vi.fn(),
      verifySetupCodeAndSetPassword: mockVerifySetupCodeAndSetPassword,
    });
  });

  it("renders setup email, fields, and submit button", () => {
    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("client@test.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/6-digit code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/create password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /verify code & create password/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Setup code is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please confirm your password."),
    ).toBeInTheDocument();

    expect(mockVerifySetupCodeAndSetPassword).not.toHaveBeenCalled();
  });

  it("shows validation error when password is too short", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "short");
    await user.type(screen.getByLabelText(/confirm password/i), "short");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Password must be at least 8 characters."),
    ).toBeInTheDocument();

    expect(mockVerifySetupCodeAndSetPassword).not.toHaveBeenCalled();
  });

  it("shows validation error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password456");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();

    expect(mockVerifySetupCodeAndSetPassword).not.toHaveBeenCalled();
  });

  it("calls verifySetupCodeAndSetPassword and navigates on success", async () => {
    const user = userEvent.setup();

    mockVerifySetupCodeAndSetPassword.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    await waitFor(() => {
      expect(mockVerifySetupCodeAndSetPassword).toHaveBeenCalledTimes(1);
    });

    expect(mockVerifySetupCodeAndSetPassword).toHaveBeenCalledWith({
      email: "client@test.com",
      code: "123456",
      password: "password123",
      confirmPassword: "password123",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/client/dashboard", {
        replace: true,
      });
    });
  });

  it("shows form error when verifySetupCodeAndSetPassword fails", async () => {
    const user = userEvent.setup();

    mockVerifySetupCodeAndSetPassword.mockRejectedValue(
      new Error("Invalid or expired setup code."),
    );

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Invalid or expired setup code."),
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows fallback form error when verifySetupCodeAndSetPassword rejects with non-Error", async () => {
    const user = userEvent.setup();

    mockVerifySetupCodeAndSetPassword.mockRejectedValue("unknown failure");

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Unable to verify setup code."),
    ).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/create password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show passwords/i }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide passwords/i }));

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  it("calls onBack when use different email is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={onBack} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /use different email/i }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();

    let resolveVerify: (() => void) | undefined;
    mockVerifySetupCodeAndSetPassword.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveVerify = resolve;
        }),
    );

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/6-digit code/i), "123456");
    await user.type(screen.getByLabelText(/create password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      screen.getByRole("button", { name: /finishing setup/i }),
    ).toBeDisabled();

    resolveVerify?.();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /verify code & create password/i }),
      ).toBeInTheDocument();
    });
  });

  it("clears field errors when the user types again", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientVerifySetupCodeForm email="client@test.com" onBack={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /verify code & create password/i }),
    );

    expect(
      await screen.findByText("Setup code is required."),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/6-digit code/i), "1");

    await waitFor(() => {
      expect(
        screen.queryByText("Setup code is required."),
      ).not.toBeInTheDocument();
    });
  });
});
