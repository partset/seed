import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ClientLoginForm from "./ClientLoginForm";
import { useClientAuth } from "../../../hooks/useClientAuth";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

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

describe("ClientLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseClientAuth.mockReturnValue({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      sendSetupCode: vi.fn(),
      verifySetupCodeAndSetPassword: vi.fn(),
    });
  });

  it("renders email, password, and sign in button", () => {
    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required."),
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("calls login and navigates on success", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: "client@test.com",
      password: "password123",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/client/dashboard", {
        replace: true,
      });
    });
  });

  it("shows form error when login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid login credentials"));

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Invalid login credentials"),
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/^password$/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("clears field error when user updates the field", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "c");

    await waitFor(() => {
      expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
    });
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();

    let resolveLogin: (() => void) | undefined;
    mockLogin.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    resolveLogin?.();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });
  });
});
