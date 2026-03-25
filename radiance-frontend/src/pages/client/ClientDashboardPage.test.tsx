import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ClientDashboardPage from "./ClientDashboardPage";

vi.mock("../../components/client/dashboard/ClientBillingPanel", () => ({
  default: ({ billing }: { billing: { invoiceLabel: string } }) => (
    <div data-testid="billing-panel">{billing.invoiceLabel}</div>
  ),
}));

vi.mock("../../components/client/dashboard/ClientDocumentsPanel", () => ({
  default: ({ documents }: { documents: Array<{ id: string }> }) => (
    <div data-testid="documents-panel">Documents: {documents.length}</div>
  ),
}));

vi.mock("../../components/client/dashboard/ClientOverviewCard", () => ({
  default: ({
    eyebrow,
    title,
    description,
  }: {
    eyebrow: string;
    title: string;
    description: string;
  }) => (
    <div data-testid="overview-card">
      <span>{eyebrow}</span>
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
}));

vi.mock("../../components/client/dashboard/ClientProgressTimeline", () => ({
  default: ({ milestones }: { milestones: Array<{ id: string }> }) => (
    <div data-testid="progress-timeline">Milestones: {milestones.length}</div>
  ),
}));

vi.mock("../../components/client/dashboard/ClientSupportPanel", () => ({
  default: ({ support }: { support: { contactName: string } }) => (
    <div data-testid="support-panel">{support.contactName}</div>
  ),
}));

vi.mock("../../components/client/dashboard/ClientUpdatesPanel", () => ({
  default: ({ updates }: { updates: Array<{ id: string }> }) => (
    <div data-testid="updates-panel">Updates: {updates.length}</div>
  ),
}));

vi.mock("../../constants/clientPortalMockData", () => ({
  clientBillingSummary: {
    invoiceLabel: "Invoice #999",
  },
  clientProjectDocuments: [{ id: "doc-1" }, { id: "doc-2" }],
  clientProjectMilestones: [
    { id: "milestone-1" },
    { id: "milestone-2" },
    { id: "milestone-3" },
  ],
  clientProjectSummary: {
    projectName: "Radiance Redesign",
    websiteStatus: "In Progress",
    currentPhase: "Design",
    nextStep: "Approve Homepage",
    balanceDue: "$1,500",
    invoiceDueDate: "April 15, 2026",
  },
  clientProjectUpdates: [{ id: "update-1" }, { id: "update-2" }],
  clientSupportSummary: {
    contactName: "Radiance Support Team",
  },
}));

describe("ClientDashboardPage", () => {
  it("renders the dashboard hero content", () => {
    render(<ClientDashboardPage />);

    expect(screen.getByText(/client portal/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /stay up to date on your project, review shared files, and track the next steps needed to move your website forward/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/^project$/i)).toBeInTheDocument();
    expect(screen.getByText(/radiance redesign/i)).toBeInTheDocument();
  });

  it("renders all four overview cards with the correct content", () => {
    render(<ClientDashboardPage />);

    const overviewCards = screen.getAllByTestId("overview-card");
    expect(overviewCards).toHaveLength(4);

    expect(screen.getByText(/website status/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();

    expect(screen.getByText(/current phase/i)).toBeInTheDocument();
    expect(screen.getByText(/^design$/i)).toBeInTheDocument();

    expect(screen.getByText(/^next step$/i)).toBeInTheDocument();
    expect(screen.getByText(/approve homepage/i)).toBeInTheDocument();

    expect(screen.getByText(/balance due/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1,500/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your next invoice is currently due on april 15, 2026/i),
    ).toBeInTheDocument();
  });

  it("renders the child dashboard sections with the correct mock data", () => {
    render(<ClientDashboardPage />);

    expect(screen.getByTestId("updates-panel")).toHaveTextContent("Updates: 2");
    expect(screen.getByTestId("progress-timeline")).toHaveTextContent(
      "Milestones: 3",
    );
    expect(screen.getByTestId("documents-panel")).toHaveTextContent(
      "Documents: 2",
    );
    expect(screen.getByTestId("billing-panel")).toHaveTextContent(
      "Invoice #999",
    );
    expect(screen.getByTestId("support-panel")).toHaveTextContent(
      "Radiance Support Team",
    );
  });
});
