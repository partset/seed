import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";
import ProjectMetaForm from "./ProjectMetaForm";
import type { AdminPortalProjectRecord } from "../../../types/company";

const mockProject: AdminPortalProjectRecord = {
  id: "project-1",
  companyId: "company-1",
  name: "AIsle Landing Page",
  status: "planned",
  currentPhase: "Discovery",
  nextStep: "Review wireframes",
  startDate: "2026-03-01",
  targetLaunchDate: "2026-04-01",
  clientVisibleSummary: "Initial planning in progress.",
  updates: [],
  documents: [],
  milestones: [],
  createdAt: "2026-03-01T00:00:00.000Z",
};

function StatefulProjectMetaForm({
  onProjectChange = () => {},
}: {
  onProjectChange?: (project: AdminPortalProjectRecord) => void;
}) {
  const [project, setProject] = useState(mockProject);

  function handleProjectChange(updatedProject: AdminPortalProjectRecord) {
    setProject(updatedProject);
    onProjectChange(updatedProject);
  }

  return (
    <ProjectMetaForm project={project} onProjectChange={handleProjectChange} />
  );
}

describe("ProjectMetaForm", () => {
  it("renders current project values", () => {
    render(<ProjectMetaForm project={mockProject} onProjectChange={vi.fn()} />);

    expect(screen.getByDisplayValue("Discovery")).toBeInTheDocument();
    expect(screen.getByDisplayValue("planned")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Review wireframes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-04-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-03-01")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Initial planning in progress."),
    ).toBeInTheDocument();
  });

  it("calls onProjectChange when current phase changes", async () => {
    const user = userEvent.setup();
    const onProjectChange = vi.fn();

    render(<StatefulProjectMetaForm onProjectChange={onProjectChange} />);

    const input = screen.getByPlaceholderText(/enter current project phase/i);
    await user.clear(input);
    await user.type(input, "Development");

    expect(input).toHaveValue("Development");
    expect(onProjectChange).toHaveBeenLastCalledWith({
      ...mockProject,
      currentPhase: "Development",
    });
  });

  it("calls onProjectChange when status changes", async () => {
    const user = userEvent.setup();
    const onProjectChange = vi.fn();

    render(<StatefulProjectMetaForm onProjectChange={onProjectChange} />);

    await user.selectOptions(screen.getByDisplayValue("planned"), "active");

    expect(onProjectChange).toHaveBeenLastCalledWith({
      ...mockProject,
      status: "active",
    });
  });

  it("updates textarea fields", async () => {
    const user = userEvent.setup();
    const onProjectChange = vi.fn();

    render(<StatefulProjectMetaForm onProjectChange={onProjectChange} />);

    const nextStep = screen.getByPlaceholderText(/describe the next action/i);
    await user.clear(nextStep);
    await user.type(nextStep, "Send proposal");

    expect(nextStep).toHaveValue("Send proposal");
    expect(onProjectChange).toHaveBeenLastCalledWith({
      ...mockProject,
      nextStep: "Send proposal",
    });
  });
});
