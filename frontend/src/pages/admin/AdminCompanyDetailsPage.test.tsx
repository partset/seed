import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminCompanyDetailsPage from "./AdminCompanyDetailsPage";
import type { Company } from "../../types/company";
import type { Project } from "../../types/project";

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseLocation = vi.fn();
const mockGetProjectByCompanyId = vi.fn();

const mockCompany: Company = {
  id: "company-1",
  name: "Gequence",
  primaryEmail: "hello@gequence.com",
  primaryPhone: "111-111-1111",
  totalProjects: 2,
  activeProjects: 1,
  latestProjectName: "Client Portal",
};

const mockProjects: Project[] = [
  {
    id: "project-1",
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
    name: "CRM Setup",
    status: "completed",
    currentPhase: "Done",
    nextStep: "",
    startDate: "2026-02-01",
    targetLaunchDate: "2026-03-01",
    clientVisibleSummary: "Completed",
  },
];

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: () => ({
    session: {
      access_token: "mock-token",
    },
  }),
}));

vi.mock("../../services/api/project/getProjectByCompanyId/api", () => ({
  getProjectByCompanyId: (...args: unknown[]) =>
    mockGetProjectByCompanyId(...args),
}));

describe("AdminCompanyDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ companyId: "company-1" });
    mockUseLocation.mockReturnValue({
      state: {
        company: mockCompany,
      },
    });
    mockGetProjectByCompanyId.mockResolvedValue(mockProjects);
  });

  it("renders loading state first", () => {
    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading company details/i)).toBeInTheDocument();
  });

  it("loads and renders company details and project content", async () => {
    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

    expect(screen.getByText(/company overview/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /^projects$/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Client Portal")).toBeInTheDocument();
    expect(screen.getByText("CRM Setup")).toBeInTheDocument();
  });

  it("calls getProjectByCompanyId with token and company id", async () => {
    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockGetProjectByCompanyId).toHaveBeenCalledWith(
        "mock-token",
        "company-1",
      );
    });
  });

  it("navigates back to companies", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /back to companies/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("navigates to project details when a project is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Client Portal")).toBeInTheDocument();
    });

    await user.click(
      screen.getByText("Client Portal").closest("button") as HTMLButtonElement,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/admin/company-1/project-1");
  });

  it("renders company not found state when route state is missing", async () => {
    mockUseLocation.mockReturnValue({ state: null });

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/company not found/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/company details were not passed to this page/i),
    ).toBeInTheDocument();
  });

  it("renders empty state when no projects are returned", async () => {
    mockGetProjectByCompanyId.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
    });
  });

  it("renders API error state when project fetch fails", async () => {
    mockGetProjectByCompanyId.mockRejectedValueOnce(
      new Error("Failed to load projects."),
    );

    render(
      <MemoryRouter>
        <AdminCompanyDetailsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/failed to load company details/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to load projects.")).toBeInTheDocument();
  });
});
