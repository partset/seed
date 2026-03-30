import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ClientDocumentsPage from "./ClientDocumentsPage";

const mockNavigate = vi.fn();
const mockClientDocumentsTable = vi.fn();

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
    Navigate: () => <div data-testid="navigate-redirect" />,
  };
});

vi.mock("../../components/client/documents/ClientDocumentsTable", () => ({
  default: (props: {
    documents: Array<{ id: string; uploadedAt: string }>;
    onDocumentClick?: (document: { id: string }) => void;
  }) => {
    mockClientDocumentsTable(props);
    return <div data-testid="client-documents-table">Mock Documents Table</div>;
  },
}));

vi.mock("../../constants/clientPortalMockData", () => ({
  clientProjectDetailsById: {
    "project-1": {
      documents: [
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
        {
          id: "doc-2",
          title: "Homepage Wireframe",
          description: "Homepage wireframe for review.",
          category: "Design",
          fileType: "PNG",
          uploadedAtLabel: "Mar 24, 2026",
          uploadedAt: "2026-03-24T10:00:00.000Z",
          fileSizeLabel: "850 KB",
          embedUrl: "https://example.com/doc-2",
        },
        {
          id: "doc-3",
          title: "Final Proposal",
          description: "Final approved proposal.",
          category: "Proposal",
          fileType: "PDF",
          uploadedAtLabel: "Mar 18, 2026",
          uploadedAt: "2026-03-18T10:00:00.000Z",
          fileSizeLabel: "2.4 MB",
          embedUrl: "https://example.com/doc-3",
        },
      ],
    },
  },
}));

describe("ClientDocumentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page hero content and total document count", () => {
    render(
      <MemoryRouter>
        <ClientDocumentsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/client portal/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /documents/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /review all uploaded files for this project, including planning, design, billing, and status updates/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/^total documents$/i)).toBeInTheDocument();
    expect(screen.getByText(/^3$/i)).toBeInTheDocument();

    expect(screen.getByTestId("client-documents-table")).toBeInTheDocument();
  });

  it("passes sorted documents to ClientDocumentsTable", () => {
    render(
      <MemoryRouter>
        <ClientDocumentsPage />
      </MemoryRouter>,
    );

    expect(mockClientDocumentsTable).toHaveBeenCalledTimes(1);

    const passedProps = mockClientDocumentsTable.mock.calls[0][0];

    expect(passedProps.documents).toHaveLength(3);
    expect(passedProps.documents[0].id).toBe("doc-2");
    expect(passedProps.documents[1].id).toBe("doc-1");
    expect(passedProps.documents[2].id).toBe("doc-3");
  });

  it("navigates to the selected document when onDocumentClick is called", () => {
    render(
      <MemoryRouter>
        <ClientDocumentsPage />
      </MemoryRouter>,
    );

    const passedProps = mockClientDocumentsTable.mock.calls[0][0];

    passedProps.onDocumentClick({
      id: "doc-2",
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/client/project-1/documents/doc-2",
    );
  });
});
