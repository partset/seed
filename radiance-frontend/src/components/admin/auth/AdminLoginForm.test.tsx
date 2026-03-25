import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminLoginForm from "./AdminLoginForm";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockLogout = vi.fn();

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

vi.mock("../../../hooks/useAdminAuth", () => ({
  useAdminAuth: vi.fn(),
}));

const mockUseAdminAuth = vi.mocked(useAdminAuth);

describe("AdminLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAdminAuth.mockReturnValue({
      user: null,
      session: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: mockLogout,
    });
  });

  it("renders email, password, forgot password link, and sign in button", () => {
    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /forgot password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^sign in$/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitted with empty fields", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("navigates to /admin/leads after successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/leads");
    });
  });

  it("shows backend/auth error when login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid login credentials"));

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(
      await screen.findByText("Invalid login credentials"),
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("disables submit button while submitting", async () => {
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
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    const submitButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(submitButton);

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    resolveLogin?.();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/leads");
    });
  });
});
