import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminProjectDetailsPage from "./AdminProjectDetailsPage";

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
          status: "planned",
          currentPhase: "Discovery",
          nextStep: "Review scope",
          startDate: "2026-03-01",
          targetLaunchDate: "2026-04-01",
          clientVisibleSummary: "Planning phase",
        },
      ],
    },
  ],
  adminPortalMockProjectDetails: {
    "project-1": {
      id: "project-1",
      companyId: "company-1",
      name: "Client Portal",
      status: "planned",
      currentPhase: "Discovery",
      nextStep: "Review scope",
      startDate: "2026-03-01",
      targetLaunchDate: "2026-04-01",
      clientVisibleSummary: "Planning phase",
      createdAt: "2026-03-01T00:00:00.000Z",
      updates: [
        {
          id: "update-1",
          projectId: "project-1",
          title: "Kickoff complete",
          description: "Initial kickoff call done.",
          isVisibleToClient: true,
          createdAt: "2026-03-20T00:00:00.000Z",
          createdByAdminName: "Alex",
        },
      ],
      documents: [
        {
          id: "doc-1",
          projectId: "project-1",
          title: "Wireframes",
          description: "Homepage wireframes",
          category: "Design",
          fileName: "wireframes.pdf",
          fileType: "pdf",
          fileSizeBytes: 2048,
          isVisibleToClient: true,
          uploadedByAdminName: "Alex",
          createdAt: "2026-03-20T00:00:00.000Z",
        },
      ],
      milestones: [
        {
          id: "milestone-1",
          projectId: "project-1",
          label: "Discovery complete",
          displayOrder: 1,
          status: "complete",
          createdAt: "2026-03-10T00:00:00.000Z",
        },
      ],
    },
  },
}));

describe("AdminProjectDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      companyId: "company-1",
      projectId: "project-1",
    });
  });

  it("renders project details page content", () => {
    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /client portal/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/project details/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /updates/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /documents/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /milestones/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Discovery")).toBeInTheDocument();
    expect(screen.getByText("Kickoff complete")).toBeInTheDocument();
    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("Discovery complete")).toBeInTheDocument();
  });

  it("updates project meta fields locally", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    const currentPhaseInput = screen.getByPlaceholderText(
      /enter current project phase/i,
    );
    await user.clear(currentPhaseInput);
    await user.type(currentPhaseInput, "Development");

    expect(currentPhaseInput).toHaveValue("Development");
  });

  it("adds a new update to the page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /add update/i }));
    await user.type(
      screen.getByPlaceholderText(/enter update title/i),
      "QA Started",
    );
    await user.type(
      screen.getByPlaceholderText(/describe what changed/i),
      "Testing is now in progress",
    );
    await user.click(screen.getByRole("button", { name: /save update/i }));

    expect(screen.getByText("QA Started")).toBeInTheDocument();
    expect(screen.getByText("Testing is now in progress")).toBeInTheDocument();
    expect(screen.getAllByText(/current admin/i).length).toBeGreaterThan(0);
  });

  it("adds a new milestone to the page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /add milestone/i }));
    await user.type(
      screen.getByPlaceholderText(/enter milestone name/i),
      "Backend completed",
    );
    await user.selectOptions(screen.getAllByRole("combobox")[1], "current");
    await user.click(screen.getByRole("button", { name: /add #2/i }));

    expect(screen.getByText("Backend completed")).toBeInTheDocument();
    expect(screen.getByText(/milestone #2/i)).toBeInTheDocument();
  });

  it("navigates using breadcrumb buttons", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Companies" }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin");

    await user.click(screen.getByRole("button", { name: "Gequence" }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/company-1");
  });

  it("renders not found state when params are invalid", () => {
    mockUseParams.mockReturnValue({
      companyId: "missing-company",
      projectId: "missing-project",
    });

    render(
      <MemoryRouter>
        <AdminProjectDetailsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/project not found/i)).toBeInTheDocument();
  });
});
