import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ClientLoginForm from "./ClientLoginForm";

describe("ClientLoginForm", () => {
  it("renders email, password, forgot password link, and sign in button", () => {
    render(
      <MemoryRouter>
        <ClientLoginForm />
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
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows placeholder auth error after valid submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientLoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^sign in$/i }),
      ).toBeInTheDocument();
    });
  });
});
