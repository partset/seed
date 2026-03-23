import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import LeadDetailsPage from "./LeadDetailsPage";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { getLead } from "../../services/api/lead/getLead/api";

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: vi.fn(),
}));

vi.mock("../../services/api/lead/getLead/api", () => ({
  getLead: vi.fn(),
}));

const mockUseAdminAuth = vi.mocked(useAdminAuth);
const mockGetLead = vi.mocked(getLead);

const mockLead = {
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
};

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

function renderLeadDetailsPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/leads/lead-123"]}>
      <Routes>
        <Route path="/admin/leads" element={<div>Back to Leads Page</div>} />
        <Route path="/admin/leads/:leadId" element={<LeadDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LeadDetailsPage", () => {
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

  it("shows loading state before lead details load", () => {
    mockGetLead.mockReturnValue(new Promise(() => {}));

    renderLeadDetailsPage();

    expect(screen.getByText(/loading lead details/i)).toBeInTheDocument();
  });

  it("renders lead details when api call succeeds", async () => {
    mockGetLead.mockResolvedValue(mockLead);

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Acme Co" }),
      ).toBeInTheDocument();
    });

    expect(mockGetLead).toHaveBeenCalledWith("test-token", "lead-123");
    expect(screen.getByText("Alex Pham")).toBeInTheDocument();
    expect(screen.getByText("alex@test.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Business Website")).toBeInTheDocument();
    expect(screen.getByText("Need a website")).toBeInTheDocument();
  });

  it("renders error state when api call fails", async () => {
    mockGetLead.mockRejectedValue(new Error("Failed to fetch lead"));

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch lead")).toBeInTheDocument();
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

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByText("No active admin session found."),
      ).toBeInTheDocument();
    });

    expect(mockGetLead).not.toHaveBeenCalled();
  });

  it("renders back to leads action", async () => {
    mockGetLead.mockResolvedValue(mockLead);

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /back to leads/i }),
      ).toBeInTheDocument();
    });
  });
});
