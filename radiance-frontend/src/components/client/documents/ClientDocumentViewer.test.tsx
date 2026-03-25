import { render, screen } from "@testing-library/react";
import ClientDocumentViewer from "./ClientDocumentViewer";
import type { ClientProjectDocument } from "../../../types/clientPortal";

describe("ClientDocumentViewer", () => {
  const mockDocument: ClientProjectDocument = {
    id: "doc-1",
    title: "Brand Questionnaire",
    description: "Initial discovery questionnaire for the project.",
    category: "Discovery",
    fileType: "PDF",
    uploadedAtLabel: "Mar 20, 2026",
    uploadedAt: "2026-03-20T10:00:00.000Z",
    fileSizeLabel: "1.2 MB",
    embedUrl: "https://example.com/doc-1",
  };

  it("renders document details and embedded viewer", () => {
    render(<ClientDocumentViewer document={mockDocument} />);

    expect(screen.getByText(/document details/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /brand questionnaire/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/initial discovery questionnaire for the project/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/^category$/i)).toBeInTheDocument();
    expect(screen.getByText(/^discovery$/i)).toBeInTheDocument();

    expect(screen.getByText(/^uploaded$/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 20, 2026/i)).toBeInTheDocument();

    expect(screen.getByText(/^file info$/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf · 1.2 mb/i)).toBeInTheDocument();

    expect(screen.getByText(/embedded viewer/i)).toBeInTheDocument();

    const iframe = screen.getByTitle(/brand questionnaire/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com/doc-1");
  });
});
