import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ClientDocumentsPanel from "./ClientDocumentsPanel";
import type { ClientProjectDocument } from "../../../types/clientPortal";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      projectId: "project-1",
    }),
  };
});

describe("ClientDocumentsPanel", () => {
  const mockDocuments: ClientProjectDocument[] = [
    {
      id: "doc-1",
      title: "Brand Questionnaire",
      category: "Discovery",
      uploadedAt: "2026-03-20T10:00:00.000Z",
      uploadedAtLabel: "Mar 20, 2026",
      fileType: "PDF",
      fileSizeLabel: "1.2 MB",
      description: "Initial brand discovery questionnaire.",
      embedUrl: "https://example.com/doc-1",
    },
    {
      id: "doc-2",
      title: "Homepage Wireframe",
      category: "Design",
      uploadedAt: "2026-03-22T10:00:00.000Z",
      uploadedAtLabel: "Mar 22, 2026",
      fileType: "PNG",
      fileSizeLabel: "850 KB",
      description: "Homepage wireframe for review.",
      embedUrl: "https://example.com/doc-2",
    },
    {
      id: "doc-3",
      title: "Final Proposal",
      category: "Proposal",
      uploadedAt: "2026-03-18T10:00:00.000Z",
      uploadedAtLabel: "Mar 18, 2026",
      fileType: "PDF",
      fileSizeLabel: "2.4 MB",
      description: "Final approved proposal.",
      embedUrl: "https://example.com/doc-3",
    },
    {
      id: "doc-4",
      title: "Launch Checklist",
      category: "Launch",
      uploadedAt: "2026-03-24T10:00:00.000Z",
      uploadedAtLabel: "Mar 24, 2026",
      fileType: "DOCX",
      fileSizeLabel: "600 KB",
      description: "Checklist for launch preparation.",
      embedUrl: "https://example.com/doc-4",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders panel heading and latest 3 documents only", () => {
    render(
      <MemoryRouter>
        <ClientDocumentsPanel documents={mockDocuments} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/shared files/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /recent documents/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /view the latest uploaded files related to your project/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/launch checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/homepage wireframe/i)).toBeInTheDocument();
    expect(screen.getByText(/brand questionnaire/i)).toBeInTheDocument();

    expect(screen.queryByText(/final proposal/i)).not.toBeInTheDocument();
  });

  it("navigates to document details when a row is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientDocumentsPanel documents={mockDocuments} />
      </MemoryRouter>,
    );

    await user.click(screen.getByText(/launch checklist/i));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/client/project-1/documents/doc-4",
    );
  });

  it("navigates to document details when the view button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientDocumentsPanel documents={mockDocuments} />
      </MemoryRouter>,
    );

    const viewButtons = screen.getAllByRole("button", { name: /^view$/i });
    await user.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/client/project-1/documents/doc-4",
    );
  });

  it("navigates to all documents page when view all is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ClientDocumentsPanel documents={mockDocuments} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /view all/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/client/project-1/documents");
  });
});
