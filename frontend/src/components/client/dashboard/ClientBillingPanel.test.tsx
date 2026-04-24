import { render, screen } from "@testing-library/react";
import ClientBillingPanel from "./ClientBillingPanel";
import type { ClientBillingSummary } from "../../../types/clientPortal";

describe("ClientBillingPanel", () => {
  const mockBilling: ClientBillingSummary = {
    invoiceLabel: "Invoice #1042",
    status: "Pending",
    amountDue: "$2,500",
    dueDate: "April 15, 2026",
  };

  it("renders billing panel content", () => {
    render(<ClientBillingPanel billing={mockBilling} />);

    expect(screen.getByText(/billing/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /invoice snapshot/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /review your current invoice status and upcoming payment deadline/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/^current invoice$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /invoice #1042/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/^status$/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();

    expect(screen.getByText(/amount due/i)).toBeInTheDocument();
    expect(screen.getByText(/\$2,500/i)).toBeInTheDocument();

    expect(screen.getByText(/due date/i)).toBeInTheDocument();
    expect(screen.getByText(/april 15, 2026/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /pay now/i }),
    ).toBeInTheDocument();
  });
});
