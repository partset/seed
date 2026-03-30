import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminCompaniesPage from "./AdminCompaniesPage";
import type { Company } from "../../types/company";

const mockNavigate = vi.fn();
const mockGetAllCompanies = vi.fn();

const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "Gequence",
    primaryEmail: "hello@gequence.com",
    primaryPhone: "111-111-1111",
    totalProjects: 2,
    activeProjects: 1,
    latestProjectName: "Site Build",
  },
  {
    id: "company-2",
    name: "Radiance",
    primaryEmail: "team@radiance.com",
    primaryPhone: "222-222-2222",
    totalProjects: 1,
    activeProjects: 0,
    latestProjectName: "CRM",
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
  };
});

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: () => ({
    session: {
      access_token: "mock-token",
    },
  }),
}));

vi.mock("../../services/api/company/getAllCompanies/api", () => ({
  getAllCompanies: (...args: unknown[]) => mockGetAllCompanies(...args),
}));

describe("AdminCompaniesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllCompanies.mockResolvedValue(mockCompanies);
  });

  it("renders page heading and loaded companies", async () => {
    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /^companies$/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/loading companies/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
      expect(screen.getByText("Radiance")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { level: 2, name: /working companies/i }),
    ).toBeInTheDocument();
  });

  it("renders the top summary stats from API data", async () => {
    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

    const companiesStatLabel = screen
      .getAllByText(/^companies$/i)
      .find((node) => node.tagName.toLowerCase() === "p");
    const projectsStatLabel = screen
      .getAllByText(/^projects$/i)
      .find((node) => node.tagName.toLowerCase() === "p");
    const activeProjectsStatLabel = screen
      .getAllByText(/^active projects$/i)
      .find((node) => node.tagName.toLowerCase() === "p");

    expect(companiesStatLabel).toBeDefined();
    expect(projectsStatLabel).toBeDefined();
    expect(activeProjectsStatLabel).toBeDefined();

    const companiesStatCard = companiesStatLabel?.parentElement;
    const projectsStatCard = projectsStatLabel?.parentElement;
    const activeProjectsStatCard = activeProjectsStatLabel?.parentElement;

    expect(companiesStatCard).not.toBeNull();
    expect(projectsStatCard).not.toBeNull();
    expect(activeProjectsStatCard).not.toBeNull();

    expect(
      within(companiesStatCard as HTMLElement).getByText("2"),
    ).toBeInTheDocument();
    expect(
      within(projectsStatCard as HTMLElement).getByText("3"),
    ).toBeInTheDocument();
    expect(
      within(activeProjectsStatCard as HTMLElement).getByText("1"),
    ).toBeInTheDocument();
  });

  it("calls getAllCompanies with the access token", async () => {
    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockGetAllCompanies).toHaveBeenCalledWith("mock-token");
    });
  });

  it("filters companies by company name", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

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

    await waitFor(() => {
      expect(screen.getByText("Radiance")).toBeInTheDocument();
    });

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

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/search by company or email/i),
      "unknown",
    );

    expect(screen.getByText(/no companies found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try a different search term/i),
    ).toBeInTheDocument();
  });

  it("navigates to company details with route state when a company card is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Gequence")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /gequence/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/company-1", {
      state: { company: mockCompanies[0] },
    });
  });

  it("shows an error state when the API call fails", async () => {
    mockGetAllCompanies.mockRejectedValueOnce(
      new Error("Failed to load companies."),
    );

    render(
      <MemoryRouter>
        <AdminCompaniesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load companies.")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to load companies")).toBeInTheDocument();
  });
});
