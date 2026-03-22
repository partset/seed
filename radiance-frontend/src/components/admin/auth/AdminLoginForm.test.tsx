import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminLoginForm from "./AdminLoginForm";
import { loginAdmin } from "../../../services/api/admin/auth/loginAdmin";

const mockNavigate = vi.fn();

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

vi.mock("../../../services/api/admin/auth/loginAdmin", () => ({
  loginAdmin: vi.fn(),
}));

describe("AdminLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(loginAdmin).not.toHaveBeenCalled();
  });

  it("shows invalid email error", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alexexample.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(loginAdmin).not.toHaveBeenCalled();
  });

  it("navigates to /admin/ after successful login", async () => {
    const user = userEvent.setup();

    vi.mocked(loginAdmin).mockResolvedValue({
      user: {
        id: "user-123",
        email: "alex@example.com",
      },
      session: {
        access_token: "valid-token",
      },
    } as any);

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginAdmin).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/");
    });
  });

  it("shows backend/auth error when login fails", async () => {
    const user = userEvent.setup();

    vi.mocked(loginAdmin).mockRejectedValue(
      new Error("Invalid login credentials"),
    );

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
});
