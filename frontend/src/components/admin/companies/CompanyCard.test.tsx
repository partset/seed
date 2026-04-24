import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CompanyCard from "./CompanyCard";
import type { Company } from "../../../types/company";

const company: Company = {
  id: "company-1",
  name: "Gequence",
  primaryEmail: "hello@gequence.com",
  primaryPhone: "123-456-7890",
  totalProjects: 2,
  activeProjects: 1,
  latestProjectName: "Website Redesign",
};

describe("CompanyCard", () => {
  it("renders company info and project stats", () => {
    render(<CompanyCard company={company} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /gequence/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("hello@gequence.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();

    const projectsLabel = screen.getByText(/^projects$/i);
    const activeLabel = screen.getByText(/^active$/i);
    const latestProjectLabel = screen.getByText(/^latest project$/i);

    const projectsCard = projectsLabel.parentElement;
    const activeCard = activeLabel.parentElement;
    const latestProjectCard = latestProjectLabel.parentElement;

    expect(projectsCard).not.toBeNull();
    expect(activeCard).not.toBeNull();
    expect(latestProjectCard).not.toBeNull();

    expect(
      within(projectsCard as HTMLElement).getByText("2"),
    ).toBeInTheDocument();

    expect(
      within(activeCard as HTMLElement).getByText("1"),
    ).toBeInTheDocument();

    expect(
      within(latestProjectCard as HTMLElement).getByText("Website Redesign"),
    ).toBeInTheDocument();
  });

  it("calls onClick with the full company object", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CompanyCard company={company} onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(company);
  });

  it("renders fallback values when optional fields are missing", () => {
    render(
      <CompanyCard
        company={{
          ...company,
          primaryEmail: "",
          primaryPhone: "",
          latestProjectName: "",
        }}
      />,
    );

    expect(screen.getAllByText(/not provided/i)).toHaveLength(2);
    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  });
});
