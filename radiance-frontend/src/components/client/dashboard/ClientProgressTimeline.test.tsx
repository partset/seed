import { render, screen } from "@testing-library/react";
import ClientProgressTimeline from "./ClientProgressTimeline";
import type { ClientProjectMilestone } from "../../../types/clientPortal";

describe("ClientProgressTimeline", () => {
  const mockMilestones: ClientProjectMilestone[] = [
    {
      id: "milestone-1",
      label: "Discovery",
      status: "complete",
    },
    {
      id: "milestone-2",
      label: "Design",
      status: "current",
    },
    {
      id: "milestone-3",
      label: "Launch",
      status: "upcoming",
    },
  ];

  it("renders timeline heading and milestone labels", () => {
    render(<ClientProgressTimeline milestones={mockMilestones} />);

    expect(screen.getByText(/project progress/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /timeline/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /follow each stage of your project from planning through launch/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/design/i)).toBeInTheDocument();
    expect(screen.getByText(/^launch$/i)).toBeInTheDocument();
  });

  it("shows the correct status labels for each milestone", () => {
    render(<ClientProgressTimeline milestones={mockMilestones} />);

    expect(screen.getByText(/complete/i)).toBeInTheDocument();
    expect(screen.getByText(/current/i)).toBeInTheDocument();
    expect(screen.getByText(/upcoming/i)).toBeInTheDocument();
  });
});
