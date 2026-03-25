import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ClientUpdatesTable from "./ClientUpdatesTable";
import type { ClientProjectUpdate } from "../../../types/clientPortal";

const mockClientUpdateDescription = vi.fn();

vi.mock("./ClientUpdateDescription", () => ({
  default: (props: { description: string }) => {
    mockClientUpdateDescription(props);
    return (
      <div data-testid="client-update-description">{props.description}</div>
    );
  },
}));

describe("ClientUpdatesTable", () => {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers and update data", () => {
    render(<ClientUpdatesTable updates={mockUpdates} />);

    expect(screen.getByText(/^update$/i)).toBeInTheDocument();
    expect(screen.getByText(/^date$/i)).toBeInTheDocument();

    expect(screen.getByText(/homepage feedback added/i)).toBeInTheDocument();
    expect(screen.getByText(/wireframe approved/i)).toBeInTheDocument();

    expect(screen.getByText(/mar 20, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 24, 2026/i)).toBeInTheDocument();
  });

  it("passes each update description to ClientUpdateDescription", () => {
    render(<ClientUpdatesTable updates={mockUpdates} />);

    expect(mockClientUpdateDescription).toHaveBeenCalledTimes(2);

    expect(mockClientUpdateDescription).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        description: "Client feedback was added to the homepage draft.",
      }),
    );

    expect(mockClientUpdateDescription).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        description: "The wireframe was approved and moved forward.",
      }),
    );
  });
});
