import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ProjectMilestonesSection from "./ProjectMilestonesSection";
import type { ProjectMilestone } from "../../../types/projectMilestone";

const milestones: ProjectMilestone[] = [
  {
    id: "m2",
    projectId: "project-1",
    label: "Launch",
    displayOrder: 2,
    status: "upcoming",
    completedAt: null,
    createdAt: "2026-03-21T00:00:00.000Z",
  },
  {
    id: "m1",
    projectId: "project-1",
    label: "Design approved",
    displayOrder: 1,
    status: "complete",
    completedAt: "2026-03-20T00:00:00.000Z",
    createdAt: "2026-03-20T00:00:00.000Z",
  },
];

describe("ProjectMilestonesSection", () => {
  it("renders empty state when there are no milestones", () => {
    render(
      <ProjectMilestonesSection milestones={[]} onAddMilestone={vi.fn()} />,
    );

    expect(screen.getByText(/no milestones yet/i)).toBeInTheDocument();
  });

  it("renders milestones sorted by displayOrder", () => {
    render(
      <ProjectMilestonesSection
        milestones={milestones}
        onAddMilestone={vi.fn()}
      />,
    );

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Design approved");
    expect(headings[1]).toHaveTextContent("Launch");
  });

  it("opens and closes add milestone form", async () => {
    const user = userEvent.setup();

    render(
      <ProjectMilestonesSection milestones={[]} onAddMilestone={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /add milestone/i }));
    expect(
      screen.getByPlaceholderText(/enter milestone name/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(
      screen.queryByPlaceholderText(/enter milestone name/i),
    ).not.toBeInTheDocument();
  });

  it("submits a milestone and closes the form", async () => {
    const user = userEvent.setup();
    const onAddMilestone = vi.fn();

    render(
      <ProjectMilestonesSection
        milestones={[]}
        onAddMilestone={onAddMilestone}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add milestone/i }));
    await user.type(
      screen.getByPlaceholderText(/enter milestone name/i),
      "Backend complete",
    );
    await user.selectOptions(screen.getByRole("combobox"), "current");
    await user.click(screen.getByRole("button", { name: /add #1/i }));

    expect(onAddMilestone).toHaveBeenCalledWith({
      label: "Backend complete",
      status: "current",
    });

    expect(
      screen.queryByPlaceholderText(/enter milestone name/i),
    ).not.toBeInTheDocument();
  });
});
