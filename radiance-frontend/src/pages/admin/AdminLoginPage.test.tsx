import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminLoginPage from "./AdminLoginPage";

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: () => ({
    user: null,
    session: null,
    isAdmin: false,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe("AdminLoginPage", () => {
  it("renders admin portal content", () => {
    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/internal access/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();

    expect(screen.getByText(/use your admin credentials/i)).toBeInTheDocument();

    expect(screen.getByText(/^leads$/i)).toBeInTheDocument();
    expect(screen.getByText(/^clients$/i)).toBeInTheDocument();
    expect(screen.getByText(/^projects$/i)).toBeInTheDocument();
  });
});
