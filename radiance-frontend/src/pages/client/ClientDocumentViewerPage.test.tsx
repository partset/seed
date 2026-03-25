import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ClientDocumentViewerPage from "./ClientDocumentViewerPage";

const mockUseParams = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

vi.mock("../../components/client/documents/ClientDocumentViewer", () => ({
  default: ({ document }: { document: { title: string } }) => (
    <div data-testid="client-document-viewer">{document.title}</div>
  ),
}));

vi.mock("../../constants/clientPortalMockData", () => ({
  clientProjectDocuments: [
    {
      id: "doc-1",
      title: "Brand Questionnaire",
      description: "Initial discovery questionnaire.",
      category: "Discovery",
      fileType: "PDF",
      uploadedAtLabel: "Mar 20, 2026",
      uploadedAt: "2026-03-20T10:00:00.000Z",
      fileSizeLabel: "1.2 MB",
      embedUrl: "https://example.com/doc-1",
    },
  ],
}));

describe("ClientDocumentViewerPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the document viewer when the document exists", () => {
    mockUseParams.mockReturnValue({ documentId: "doc-1" });

    render(
      <MemoryRouter>
        <ClientDocumentViewerPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /back to documents/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("client-document-viewer")).toHaveTextContent(
      "Brand Questionnaire",
    );
  });

  it("renders not found state when the document does not exist", () => {
    mockUseParams.mockReturnValue({ documentId: "missing-doc" });

    render(
      <MemoryRouter>
        <ClientDocumentViewerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/^documents$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /document not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the document you tried to open could not be found/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /back to documents/i }),
    ).toBeInTheDocument();
  });
});
