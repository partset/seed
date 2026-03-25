import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ClientUpdatesPanel from "./ClientUpdatesPanel";
import type { ClientProjectUpdate } from "../../../types/clientPortal";

const mockNavigate = vi.fn();
const mockClientUpdatesTable = vi.fn();

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

vi.mock("../updates/ClientUpdatesTable", () => ({
  default: (props: { updates: ClientProjectUpdate[] }) => {
    mockClientUpdatesTable(props);

    return <div data-testid="client-updates-table">Mock Updates Table</div>;
  },
}));

describe("ClientUpdatesPanel", () => {
  const mockUpdates: ClientProjectUpdate[] = [
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
      title: "Content received",
      description: "Content for the services page was received.",
      dateLabel: "Mar 22, 2026",
      createdAt: "2026-03-22T10:00:00.000Z",
    },
    {
      id: "update-4",
      title: "Proposal sent",
      description: "Initial proposal was sent to the client.",
      dateLabel: "Mar 18, 2026",
      createdAt: "2026-03-18T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the panel content", () => {
    render(<ClientUpdatesPanel updates={mockUpdates} />);

    expect(screen.getByText(/project activity/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /recent updates/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/review the latest notes from your project team/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId("client-updates-table")).toBeInTheDocument();
  });

  it("passes the 3 most recent updates to ClientUpdatesTable", () => {
    render(<ClientUpdatesPanel updates={mockUpdates} />);

    expect(mockClientUpdatesTable).toHaveBeenCalledTimes(1);

    const passedProps = mockClientUpdatesTable.mock.calls[0][0];
    expect(passedProps.updates).toHaveLength(3);

    expect(passedProps.updates[0].id).toBe("update-2");
    expect(passedProps.updates[1].id).toBe("update-3");
    expect(passedProps.updates[2].id).toBe("update-1");
  });

  it("navigates to the updates page when view all is clicked", async () => {
    const user = userEvent.setup();

    render(<ClientUpdatesPanel updates={mockUpdates} />);

    await user.click(screen.getByRole("button", { name: /view all/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/client/updates");
  });
});
