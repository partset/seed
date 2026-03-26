import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminCompanyDetailsPage from "./AdminCompanyDetailsPage";

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
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
          name: "Client Portal",
          status: "active",
          currentPhase: "Development",
          nextStep: "Write tests",
          startDate: "2026-03-01",
          targetLaunchDate: "2026-04-01",
          clientVisibleSummary: "In progress",
        },
        {
          id: "project-2",
          companyId: "company-1",
          name: "CRM Setup",
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

describe("AdminCompanyDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders company details and project stats", () => {
    mockUseParams.mockReturnValue({ companyId: "company-1" });

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gequence")).toBeInTheDocument();
    expect(screen.getByText(/company overview/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /projects/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.getByText("Client Portal")).toBeInTheDocument();
    expect(screen.getByText("CRM Setup")).toBeInTheDocument();
  });

  it("navigates back to companies", async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ companyId: "company-1" });

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /back to companies/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("navigates to project details when project is clicked", async () => {
    const user = userEvent.setup();
    mockUseParams.mockReturnValue({ companyId: "company-1" });

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByText("Client Portal").closest("button") as HTMLButtonElement,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/admin/company-1/project-1");
  });

  it("renders not found state for unknown company", () => {
    mockUseParams.mockReturnValue({ companyId: "missing-company" });

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/company not found/i)).toBeInTheDocument();
  });
});
