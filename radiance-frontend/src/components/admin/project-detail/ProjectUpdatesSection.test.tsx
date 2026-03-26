import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ProjectUpdatesSection from "./ProjectUpdatesSection";
import type { ProjectUpdate } from "../../../types/projectUpdate";

const updates: ProjectUpdate[] = [
  {
    id: "update-1",
    projectId: "project-1",
    title: "Homepage approved",
    description: "Client approved the homepage mockup.",
    isVisibleToClient: true,
    createdAt: "2026-03-20T00:00:00.000Z",
    createdByAdminName: "Alex",
  },
  {
    id: "update-2",
    projectId: "project-1",
    title: "Internal revision",
    description: "Refactoring component structure.",
    isVisibleToClient: false,
    createdAt: "2026-03-21T00:00:00.000Z",
    createdByAdminName: "Taylor",
  },
];

describe("ProjectUpdatesSection", () => {
  it("renders empty state when there are no updates", () => {
    render(<ProjectUpdatesSection updates={[]} onAddUpdate={vi.fn()} />);

    expect(screen.getByText(/no updates yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/once the team logs progress updates/i),
    ).toBeInTheDocument();
  });

  it("renders update cards when updates exist", () => {
    render(<ProjectUpdatesSection updates={updates} onAddUpdate={vi.fn()} />);

    expect(screen.getByText("Homepage approved")).toBeInTheDocument();
    expect(screen.getByText("Internal revision")).toBeInTheDocument();
    expect(screen.getByText(/client visible/i)).toBeInTheDocument();
    expect(screen.getByText(/internal only/i)).toBeInTheDocument();
  });

  it("opens and closes the add update form", async () => {
    const user = userEvent.setup();

    render(<ProjectUpdatesSection updates={[]} onAddUpdate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /add update/i }));
    expect(
      screen.getByPlaceholderText(/enter update title/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(
      screen.queryByPlaceholderText(/enter update title/i),
    ).not.toBeInTheDocument();
  });

  it("submits a new update and closes the form", async () => {
    const user = userEvent.setup();
    const onAddUpdate = vi.fn();

    render(<ProjectUpdatesSection updates={[]} onAddUpdate={onAddUpdate} />);

    await user.click(screen.getByRole("button", { name: /add update/i }));
    await user.type(
      screen.getByPlaceholderText(/enter update title/i),
      "New release",
    );
    await user.type(
      screen.getByPlaceholderText(/describe what changed/i),
      "Deployed production build",
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(onAddUpdate).toHaveBeenCalledWith({
      title: "New release",
      description: "Deployed production build",
      isVisibleToClient: true,
    });

    expect(
      screen.queryByPlaceholderText(/enter update title/i),
    ).not.toBeInTheDocument();
  });
});
