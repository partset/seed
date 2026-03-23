import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminLoginForm from "./AdminLoginForm";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

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
      logout: vi.fn(),
    });
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
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password123",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/admin/leads");
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
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Invalid login credentials"),
    ).toBeInTheDocument();
  });
});
