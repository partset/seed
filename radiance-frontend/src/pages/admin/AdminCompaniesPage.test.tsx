import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminCompaniesPage from "./AdminCompaniesPage";

const mockNavigate = vi.fn();

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

vi.mock("../../constants/adminPortalMockData", () => ({
  adminPortalMockCompanies: [
    {
      id: "company-1",
      name: "Gequence",
      primaryEmail: "hello@gequence.com",
      primaryPhone: "111-111-1111",
      createdAt: "2026-03-20T00:00:00.000Z",
      projects: [
        {
          id: "project-1",
          companyId: "company-1",
          name: "Site Build",
          status: "active",
          currentPhase: "Build",
          nextStep: "QA",
          startDate: "2026-03-01",
          targetLaunchDate: "2026-04-01",
          clientVisibleSummary: "In progress",
        },
      ],
    },
    {
      id: "company-2",
      name: "Radiance",
      primaryEmail: "team@radiance.com",
      primaryPhone: "222-222-2222",
      createdAt: "2026-03-19T00:00:00.000Z",
      projects: [
        {
          id: "project-2",
          companyId: "company-2",
          name: "CRM",
          status: "completed",
          currentPhase: "Done",
          nextStep: "",
          startDate: "2026-02-01",
          targetLaunchDate: "2026-03-01",
          clientVisibleSummary: "Completed",
        },
      ],
    },
  ],
}));

describe("AdminCompaniesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page heading and summary stats", () => {
    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /companies/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/working companies/i)).toBeInTheDocument();
    expect(screen.getByText("Gequence")).toBeInTheDocument();
    expect(screen.getByText("Radiance")).toBeInTheDocument();
  });

  it("filters companies by company name", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/search by company or email/i),
      "gequence",
    );

    expect(screen.getByText("Gequence")).toBeInTheDocument();
    expect(screen.queryByText("Radiance")).not.toBeInTheDocument();
  });

  it("filters companies by primary email", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/search by company or email/i),
      "team@radiance.com",
    );

    expect(screen.getByText("Radiance")).toBeInTheDocument();
    expect(screen.queryByText("Gequence")).not.toBeInTheDocument();
  });

  it("shows empty state when search finds no companies", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/search by company or email/i),
      "unknown",
    );

    expect(screen.getByText(/no companies found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try a different search term/i),
    ).toBeInTheDocument();
  });

  it("navigates to company details when a company card is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /company gequence/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/company-1");
  });
});
