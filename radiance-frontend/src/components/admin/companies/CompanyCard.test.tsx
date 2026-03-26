import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CompanyCard from "./CompanyCard";
import type { AdminPortalCompanyRecord } from "../../../types/company";

const company: AdminPortalCompanyRecord = {
  id: "company-1",
  name: "Gequence",
  primaryEmail: "hello@gequence.com",
  primaryPhone: "123-456-7890",
  createdAt: "2026-03-20T00:00:00.000Z",
  projects: [
    {
      id: "project-1",
      companyId: "company-1",
      name: "Website Redesign",
      status: "active",
      currentPhase: "Build",
      nextStep: "QA review",
      startDate: "2026-03-01",
      targetLaunchDate: "2026-04-01",
      clientVisibleSummary: "In progress",
      createdAt: "2026-03-20T00:00:00.000Z",
    },
    {
      id: "project-2",
      companyId: "company-1",
      name: "CRM Setup",
      status: "planned",
      currentPhase: "",
      nextStep: "",
      startDate: null,
      targetLaunchDate: null,
      clientVisibleSummary: "",
      createdAt: "2026-03-21T00:00:00.000Z",
    },
  ],
};

describe("CompanyCard", () => {
  it("renders company info and project stats", () => {
    render(<CompanyCard company={company} />);

    expect(screen.getByText("Gequence")).toBeInTheDocument();
    expect(screen.getByText("hello@gequence.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("calls onClick with company id", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CompanyCard company={company} onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith("company-1");
  });

  it("renders fallback values when optional fields are missing", () => {
    render(
      <CompanyCard
        company={{
          ...company,
          primaryEmail: "",
          primaryPhone: "",
          projects: [],
        }}
      />,
    );

    expect(screen.getAllByText(/not provided/i)).toHaveLength(2);
    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  });
});
