import { render, screen } from "@testing-library/react";
import ProjectDocumentsSection from "./ProjectDocumentsSection";
import type { ProjectDocument } from "../../../types/projectDocument";

const documents: ProjectDocument[] = [
  {
    id: "doc-1",
    projectId: "project-1",
    title: "Wireframes",
    description: "Initial UX wireframes",
    category: "Design",
    fileName: "wireframes.pdf",
    fileUrl: "https://example.com/wireframes.pdf",
    fileType: "pdf",
    fileSizeBytes: 2048,
    isVisibleToClient: true,
    uploadedByAdminName: "Alex",
    createdAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "doc-2",
    projectId: "project-1",
    title: "Notes",
    description: "",
    category: "",
    fileName: "notes.txt",
    fileUrl: "https://example.com/notes.txt",
    fileType: "txt",
    fileSizeBytes: 500,
    isVisibleToClient: false,
    uploadedByAdminName: "Taylor",
    createdAt: "2026-03-21T00:00:00.000Z",
  },
];

describe("ProjectDocumentsSection", () => {
  it("renders empty state when there are no documents", () => {
    render(<ProjectDocumentsSection documents={[]} />);

    expect(screen.getByText(/no documents yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add document/i }),
    ).toBeInTheDocument();
  });

  it("renders document metadata and visibility labels", () => {
    render(<ProjectDocumentsSection documents={documents} />);

    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText(/client visible/i)).toBeInTheDocument();
    expect(screen.getByText(/internal only/i)).toBeInTheDocument();
    expect(screen.getByText("wireframes.pdf")).toBeInTheDocument();
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("Taylor")).toBeInTheDocument();
  });

  it("renders fallback values", () => {
    render(<ProjectDocumentsSection documents={[documents[1]]} />);

    expect(screen.getByText(/uncategorized/i)).toBeInTheDocument();
    expect(screen.getByText(/no description added\./i)).toBeInTheDocument();
  });

  it("formats file sizes", () => {
    render(<ProjectDocumentsSection documents={documents} />);

    expect(screen.getByText(/2\.0 kb/i)).toBeInTheDocument();
    expect(screen.getByText(/500 b/i)).toBeInTheDocument();
  });
});
