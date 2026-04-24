import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ClientDocumentsTable from "./ClientDocumentsTable";
import type { ClientProjectDocument } from "../../../types/clientPortal";

describe("ClientDocumentsTable", () => {
  const mockOnDocumentClick = vi.fn();

  const mockDocuments: ClientProjectDocument[] = [
    {
      id: "doc-1",
      title: "Brand Questionnaire",
      description: "Initial discovery questionnaire for the project.",
      category: "Discovery",
      fileType: "PDF",
      uploadedAtLabel: "Mar 20, 2026",
      uploadedAt: "2026-03-20T10:00:00.000Z",
      fileSizeLabel: "1.2 MB",
      embedUrl: "https://example.com/doc-1",
    },
    {
      id: "doc-2",
      title: "Homepage Wireframe",
      description: "Homepage wireframe for client review.",
      category: "Design",
      fileType: "PNG",
      uploadedAtLabel: "Mar 22, 2026",
      uploadedAt: "2026-03-22T10:00:00.000Z",
      fileSizeLabel: "850 KB",
      embedUrl: "https://example.com/doc-2",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers and document data", () => {
    render(
      <ClientDocumentsTable
        documents={mockDocuments}
        onDocumentClick={mockOnDocumentClick}
      />,
    );

    expect(screen.getByText(/^document$/i)).toBeInTheDocument();
    expect(screen.getByText(/^category$/i)).toBeInTheDocument();
    expect(screen.getByText(/^file type$/i)).toBeInTheDocument();
    expect(screen.getByText(/^uploaded$/i)).toBeInTheDocument();
    expect(screen.getByText(/^size$/i)).toBeInTheDocument();
    expect(screen.getByText(/^action$/i)).toBeInTheDocument();

    expect(screen.getByText(/brand questionnaire/i)).toBeInTheDocument();
    expect(
      screen.getByText(/initial discovery questionnaire for the project/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/^discovery$/i)).toBeInTheDocument();
    expect(screen.getByText(/^pdf$/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 20, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/1.2 mb/i)).toBeInTheDocument();

    expect(screen.getByText(/^homepage wireframe$/i)).toBeInTheDocument();
    expect(screen.getByText(/design/i)).toBeInTheDocument();
    expect(screen.getByText(/^png$/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 22, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/850 kb/i)).toBeInTheDocument();
  });

  it("calls onDocumentClick when a row is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ClientDocumentsTable
        documents={mockDocuments}
        onDocumentClick={mockOnDocumentClick}
      />,
    );

    await user.click(screen.getByText(/brand questionnaire/i));

    expect(mockOnDocumentClick).toHaveBeenCalledTimes(1);
    expect(mockOnDocumentClick).toHaveBeenCalledWith(mockDocuments[0]);
  });

  it("calls onDocumentClick when the view button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ClientDocumentsTable
        documents={mockDocuments}
        onDocumentClick={mockOnDocumentClick}
      />,
    );

    const viewButtons = screen.getAllByRole("button", { name: /^view$/i });
    await user.click(viewButtons[0]);

    expect(mockOnDocumentClick).toHaveBeenCalledTimes(1);
    expect(mockOnDocumentClick).toHaveBeenCalledWith(mockDocuments[0]);
  });

  it("does not crash when onDocumentClick is not provided", async () => {
    const user = userEvent.setup();

    render(<ClientDocumentsTable documents={mockDocuments} />);

    await user.click(screen.getByText(/brand questionnaire/i));
    await user.click(screen.getAllByRole("button", { name: /^view$/i })[0]);

    expect(screen.getByText(/brand questionnaire/i)).toBeInTheDocument();
  });
});
