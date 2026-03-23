import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import LeadDetailsPage from "./LeadDetailsPage";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { getLead } from "../../services/api/lead/getLead/api";
import { modifyLead } from "../../services/api/lead/modifyLead/api";
import { convertLeadToClient } from "../../services/api/lead/convertToClient/api";

vi.mock("../../hooks/useAdminAuth", () => ({
  useAdminAuth: vi.fn(),
}));

vi.mock("../../services/api/lead/getLead/api", () => ({
  getLead: vi.fn(),
}));

vi.mock("../../services/api/lead/modifyLead/api", () => ({
  modifyLead: vi.fn(),
}));

vi.mock("../../services/api/lead/convertToClient/api", () => ({
  convertLeadToClient: vi.fn(),
}));

const mockUseAdminAuth = vi.mocked(useAdminAuth);
const mockGetLead = vi.mocked(getLead);
const mockModifyLead = vi.mocked(modifyLead);
const mockConvertLeadToClient = vi.mocked(convertLeadToClient);

const mockLead = {
  id: "lead-123",
  company_name: "Acme Co",
  first_name: "Alex",
  last_name: "Pham",
  email: "alex@test.com",
  phone: "1234567890",
  project_type: "Business Website",
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
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /convert to client/i }),
    ).toBeInTheDocument();
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

  it("enters edit mode when edit button is clicked", async () => {
    mockGetLead.mockResolvedValue(mockLead);

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme Co")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alex")).toBeInTheDocument();
  });

  it("cancels edit mode and returns to read-only details", async () => {
    mockGetLead.mockResolvedValue(mockLead);

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByDisplayValue("Acme Co"), {
      target: { value: "Updated Co" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Acme Co" }),
    ).toBeInTheDocument();
  });

  it("submits edited values and returns updated lead details", async () => {
    mockGetLead.mockResolvedValue(mockLead);
    mockModifyLead.mockResolvedValue({
      ...mockLead,
      company_name: "Updated Co",
      first_name: "Alexander",
      status: "Reviewing",
    });

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    fireEvent.change(screen.getByDisplayValue("Acme Co"), {
      target: { name: "companyName", value: "Updated Co" },
    });

    fireEvent.change(screen.getByDisplayValue("Alex"), {
      target: { name: "firstName", value: "Alexander" },
    });

    fireEvent.change(screen.getByDisplayValue("New"), {
      target: { name: "status", value: "Reviewing" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockModifyLead).toHaveBeenCalledWith("test-token", "lead-123", {
        companyName: "Updated Co",
        firstName: "Alexander",
        lastName: "Pham",
        email: "alex@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        message: "Need a website",
        status: "Reviewing",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Updated Co" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Alexander Pham")).toBeInTheDocument();
  });

  it("shows save error when modifyLead fails", async () => {
    mockGetLead.mockResolvedValue(mockLead);
    mockModifyLead.mockRejectedValue(new Error("Failed to update lead"));

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to update lead")).toBeInTheDocument();
    });
  });

  it("calls convertLeadToClient and updates status after success", async () => {
    mockGetLead.mockResolvedValue(mockLead);
    mockConvertLeadToClient.mockResolvedValue({
      success: true,
      data: {
        message: "Lead converted to client successfully",
        company: {
          id: "company-123",
          name: "Acme Co",
          primary_email: "alex@test.com",
          primary_phone: "1234567890",
        },
        project: {
          id: "project-123",
          company_id: "company-123",
          name: "Acme Co - Business Website",
          status: "active",
        },
      },
      error: "",
    });

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /convert to client/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /convert to client/i }));

    await waitFor(() => {
      expect(mockConvertLeadToClient).toHaveBeenCalledWith(
        "test-token",
        "lead-123",
        {
          companyName: "Acme Co",
          email: "alex@test.com",
          phone: "1234567890",
          projectType: "Business Website",
          projectName: "Acme Co - Business Website",
        },
      );
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /already converted/i }),
      ).toBeDisabled();
    });
  });

  it("shows convert error when convertLeadToClient fails", async () => {
    mockGetLead.mockResolvedValue(mockLead);
    mockConvertLeadToClient.mockRejectedValue(
      new Error("Failed to convert lead to client"),
    );

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /convert to client/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /convert to client/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to convert lead to client"),
      ).toBeInTheDocument();
    });
  });

  it("disables convert button while converting", async () => {
    mockGetLead.mockResolvedValue(mockLead);
    mockConvertLeadToClient.mockReturnValue(new Promise(() => {}));

    renderLeadDetailsPage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /convert to client/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /convert to client/i }));

    expect(screen.getByRole("button", { name: /converting/i })).toBeDisabled();
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
