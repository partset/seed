import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClientLoginPage from "./ClientLoginPage";

describe("ClientLoginPage", () => {
  it("renders client portal page content", () => {
    render(
      <MemoryRouter>
        <ClientLoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/client access/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /use your email and password to access your client portal/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/projects/i)).toBeInTheDocument();
    expect(screen.getByText(/files/i)).toBeInTheDocument();
    expect(screen.getByText(/^updates$/i)).toBeInTheDocument();

    expect(screen.getByText(/first-time setup/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /invited clients should create their password from the secure email link/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the client login form inside the page", () => {
    render(
      <MemoryRouter>
        <ClientLoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^sign in$/i }),
    ).toBeInTheDocument();
  });
});
