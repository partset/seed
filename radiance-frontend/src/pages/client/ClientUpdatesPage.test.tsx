import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ClientUpdatesPage from "./ClientUpdatesPage";

const mockClientUpdatesTable = vi.fn();

vi.mock("../../components/client/updates/ClientUpdatesTable", () => ({
  default: (props: { updates: Array<{ id: string; createdAt: string }> }) => {
    mockClientUpdatesTable(props);
    return <div data-testid="client-updates-table">Mock Updates Table</div>;
  },
}));

vi.mock("../../constants/clientPortalMockData", () => ({
  clientProjectUpdates: [
    {
      id: "update-1",
      title: "Homepage feedback added",
      description: "Client feedback was added to the homepage draft.",
      dateLabel: "Mar 20, 2026",
      createdAt: "2026-03-20T10:00:00.000Z",
    },
    {
      id: "update-2",
      title: "Wireframe approved",
      description: "The wireframe was approved and moved forward.",
      dateLabel: "Mar 24, 2026",
      createdAt: "2026-03-24T10:00:00.000Z",
    },
    {
      id: "update-3",
      title: "Proposal sent",
      description: "Initial proposal was sent to the client.",
      dateLabel: "Mar 18, 2026",
      createdAt: "2026-03-18T10:00:00.000Z",
    },
  ],
}));

describe("ClientUpdatesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page hero content and total update count", () => {
    render(<ClientUpdatesPage />);

    expect(screen.getByText(/client portal/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /updates/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /review the full history of project notes and progress updates from your team/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/^total updates$/i)).toBeInTheDocument();
    expect(screen.getByText(/^3$/i)).toBeInTheDocument();

    expect(screen.getByTestId("client-updates-table")).toBeInTheDocument();
  });

  it("passes updates sorted by newest createdAt first", () => {
    render(<ClientUpdatesPage />);

    expect(mockClientUpdatesTable).toHaveBeenCalledTimes(1);

    const passedProps = mockClientUpdatesTable.mock.calls[0][0];

    expect(passedProps.updates).toHaveLength(3);
    expect(passedProps.updates[0].id).toBe("update-2");
    expect(passedProps.updates[1].id).toBe("update-1");
    expect(passedProps.updates[2].id).toBe("update-3");
  });
});
