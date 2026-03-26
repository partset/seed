import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ProjectCard from "./ProjectCard";
import type { Project } from "../../../types/project";

const project: Project = {
  id: "project-1",
  companyId: "company-1",
  name: "Client Portal",
  status: "active",
  currentPhase: "Development",
  targetLaunchDate: "2026-04-30",
  nextStep: "Finish testing",
  clientVisibleSummary: "Portal is being built now.",
  startDate: "2026-03-01",
  createdAt: "2026-03-20T00:00:00.000Z",
};

describe("ProjectCard", () => {
  it("renders project details", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText("Client Portal")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("2026-04-30")).toBeInTheDocument();
    expect(screen.getByText("Finish testing")).toBeInTheDocument();
    expect(screen.getByText("Portal is being built now.")).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("calls onClick with project id", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ProjectCard project={project} onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith("project-1");
  });

  it("renders fallbacks when project values are missing", () => {
    render(
      <ProjectCard
        project={{
          ...project,
          currentPhase: "",
          targetLaunchDate: "",
          nextStep: "",
          clientVisibleSummary: "",
        }}
      />,
    );

    expect(screen.getAllByText(/not set/i).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/no summary added yet\./i)).toBeInTheDocument();
  });
});
