import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ClientRequestSetupCodeForm from "./ClientRequestSetupCodeForm";
import { useClientAuth } from "../../../hooks/useClientAuth";

const mockSendSetupCode = vi.fn();

vi.mock("../../../hooks/useClientAuth", () => ({
  useClientAuth: vi.fn(),
}));

const mockUseClientAuth = vi.mocked(useClientAuth);

describe("ClientRequestSetupCodeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseClientAuth.mockReturnValue({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      sendSetupCode: mockSendSetupCode,
      verifySetupCodeAndSetPassword: vi.fn(),
    });
  });

  it("renders email input and submit button", () => {
    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send setup code/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when email is empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(mockSendSetupCode).not.toHaveBeenCalled();
  });

  it("shows validation error when email is invalid", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    expect(
      await screen.findByText("Valid email is required."),
    ).toBeInTheDocument();
    expect(mockSendSetupCode).not.toHaveBeenCalled();
  });

  it("calls sendSetupCode and onSuccess with normalized email on success", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    mockSendSetupCode.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={onSuccess} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "  CLIENT@TEST.COM  ");
    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    await waitFor(() => {
      expect(mockSendSetupCode).toHaveBeenCalledTimes(1);
    });

    expect(mockSendSetupCode).toHaveBeenCalledWith({
      email: "client@test.com",
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("client@test.com");
  });

  it("shows form error when sendSetupCode fails", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    mockSendSetupCode.mockRejectedValue(new Error("Unable to send OTP."));

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={onSuccess} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    expect(await screen.findByText("Unable to send OTP.")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows fallback form error when sendSetupCode rejects with non-Error", async () => {
    const user = userEvent.setup();

    mockSendSetupCode.mockRejectedValue("unknown failure");

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    expect(
      await screen.findByText("Unable to send setup code."),
    ).toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();

    let resolveRequest: (() => void) | undefined;
    mockSendSetupCode.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "client@test.com");
    await user.click(screen.getByRole("button", { name: /send setup code/i }));

    expect(
      screen.getByRole("button", { name: /sending code/i }),
    ).toBeDisabled();

    resolveRequest?.();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /send setup code/i }),
      ).toBeInTheDocument();
    });
  });

  it("clears email and form errors when user types again", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientRequestSetupCodeForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /send setup code/i }));
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "c");

    await waitFor(() => {
      expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
    });
  });
});
