import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import LeadsPage from "./LeadsPage";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { getAllLeads } from "../../services/api/lead/getAllLeads/api";

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: vi.fn(),
}));

vi.mock("../../services/api/lead/getAllLeads/api", () => ({
  getAllLeads: vi.fn(),
}));

const mockUseAdminAuth = vi.mocked(useAdminAuth);
const mockGetAllLeads = vi.mocked(getAllLeads);

const mockLeads = [
  {
    id: "lead-123",
    company_name: "Acme Co",
    first_name: "Alex",
    last_name: "Pham",
    email: "alex@test.com",
    phone: "1234567890",
    project_type: "Business Website",
    timeline: "2-4 weeks",
    message: "Need a website",
    status: "New" as const,
    created_at: "2026-03-22T00:00:00.000Z",
  },
  {
    id: "lead-456",
    company_name: "Beta Co",
    first_name: "Jamie",
    last_name: "Lee",
    email: "jamie@test.com",
    phone: "5555555555",
    project_type: "E-commerce",
    timeline: "1-2 months",
    message: "Need an online store",
    status: "Reviewing" as const,
    created_at: "2026-03-21T00:00:00.000Z",
  },
];

function createMockSession(): Session {
  return {
    access_token: "test-token",
    refresh_token: "test-refresh-token",
    expires_in: 3600,
    expires_at: 9999999999,
    token_type: "bearer",
    user: {
      id: "user-123",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2026-03-22T00:00:00.000Z",
    },
  };
}

function renderLeadsPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/leads"]}>
      <Routes>
        <Route path="/admin/leads" element={<LeadsPage />} />
        <Route
          path="/admin/leads/:leadId"
          element={<div>Lead Details Route</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LeadsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAdminAuth.mockReturnValue({
      session: createMockSession(),
      user: null,
      isAdmin: true,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("shows loading state before leads load", () => {
    mockGetAllLeads.mockReturnValue(new Promise(() => {}));

    renderLeadsPage();

    expect(screen.getByText(/loading leads/i)).toBeInTheDocument();
  });

  it("renders leads when api call succeeds", async () => {
    mockGetAllLeads.mockResolvedValue(mockLeads);

    renderLeadsPage();

    await waitFor(() => {
      expect(screen.getByText("Acme Co")).toBeInTheDocument();
      expect(screen.getByText("Beta Co")).toBeInTheDocument();
    });

    expect(mockGetAllLeads).toHaveBeenCalledWith("test-token");
    expect(screen.getByText("Alex Pham")).toBeInTheDocument();
    expect(screen.getByText("Jamie Lee")).toBeInTheDocument();
  });

  it("renders empty state when no leads are returned", async () => {
    mockGetAllLeads.mockResolvedValue([]);

    renderLeadsPage();

    await waitFor(() => {
      expect(screen.getByText(/no leads yet/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/once businesses submit the public lead form/i),
    ).toBeInTheDocument();
  });

  it("renders error state when api call fails", async () => {
    mockGetAllLeads.mockRejectedValue(new Error("Failed to load leads."));

    renderLeadsPage();

    await waitFor(() => {
      expect(screen.getByText("Failed to load leads.")).toBeInTheDocument();
    });
  });

  it("renders error state when there is no access token", async () => {
    mockUseAdminAuth.mockReturnValue({
      session: null,
      user: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderLeadsPage();

    await waitFor(() => {
      expect(
        screen.getByText("No active admin session found."),
      ).toBeInTheDocument();
    });

    expect(mockGetAllLeads).not.toHaveBeenCalled();
  });

  it("navigates to lead details when a lead row is clicked", async () => {
    const user = userEvent.setup();
    mockGetAllLeads.mockResolvedValue(mockLeads);

    renderLeadsPage();

    const row = (await screen.findByText("Acme Co")).closest("tr");
    expect(row).not.toBeNull();

    await user.click(row!);

    await waitFor(() => {
      expect(screen.getByText("Lead Details Route")).toBeInTheDocument();
    });
  });
});
