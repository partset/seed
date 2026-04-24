import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LeadDetailsCard from "./LeadDetailsCard";
import type { Lead } from "../../../types/lead";

const mockLead: Lead = {
  id: "lead-123",
  company_name: "Acme Co",
  first_name: "Alex",
  last_name: "Pham",
  email: "alex@test.com",
  phone: "1234567890",
  project_type: "Business Website",
  message: "Need a website",
  status: "New",
  created_at: "2026-03-22T00:00:00.000Z",
};

describe("LeadDetailsCard", () => {
  it("renders lead details", () => {
    render(<LeadDetailsCard lead={mockLead} />);

    expect(
      screen.getByRole("heading", { name: "Acme Co" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Alex Pham")).toBeInTheDocument();
    expect(screen.getByText("alex@test.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Business Website")).toBeInTheDocument();
    expect(screen.getByText("Need a website")).toBeInTheDocument();
  });

  it("renders convert button when handler is provided", () => {
    render(<LeadDetailsCard lead={mockLead} onConvertToClient={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /convert to client/i }),
    ).toBeInTheDocument();
  });

  it("does not render convert button when handler is not provided", () => {
    render(<LeadDetailsCard lead={mockLead} />);

    expect(
      screen.queryByRole("button", { name: /convert to client/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onConvertToClient when button is clicked", () => {
    const onConvertToClient = vi.fn();

    render(
      <LeadDetailsCard lead={mockLead} onConvertToClient={onConvertToClient} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /convert to client/i }));

    expect(onConvertToClient).toHaveBeenCalledTimes(1);
  });

  it("shows converting state and disables button", () => {
    render(
      <LeadDetailsCard
        lead={mockLead}
        onConvertToClient={vi.fn()}
        isConverting
      />,
    );

    const button = screen.getByRole("button", { name: /converting/i });

    expect(button).toBeDisabled();
  });

  it("shows already converted state and disables button", () => {
    render(
      <LeadDetailsCard
        lead={{ ...mockLead, status: "Converted to Client" }}
        onConvertToClient={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: /already converted/i });

    expect(button).toBeDisabled();
  });

  it("renders convert error message when provided", () => {
    render(
      <LeadDetailsCard
        lead={mockLead}
        onConvertToClient={vi.fn()}
        convertError="Failed to convert lead"
      />,
    );

    expect(screen.getByText("Failed to convert lead")).toBeInTheDocument();
  });
});
