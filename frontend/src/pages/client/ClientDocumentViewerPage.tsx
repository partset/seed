import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useClientAuth } from "../../hooks/useClientAuth";
import ClientDocumentViewer from "../../components/client/documents/ClientDocumentViewer";
import { getProjectDocumentSignedUrl } from "../../services/api/project/getProjectDocumentSignedUrl/api";
import type { ProjectDocument } from "../../types/projectDocument";

interface ClientDocumentViewerPageState {
  document?: ProjectDocument;
  documents?: ProjectDocument[];
}

export default function ClientDocumentViewerPage() {
  const { projectId, documentId } = useParams<{
    projectId: string;
    documentId: string;
  }>();

  const { session } = useClientAuth();
  const location = useLocation();

  const [signedUrl, setSignedUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);

  const state = location.state as ClientDocumentViewerPageState | null;

  const documentFromState = state?.document;
  const documentsFromState = state?.documents ?? [];

  const document =
    documentFromState ??
    documentsFromState.find((item) => item.id === documentId) ??
    null;

  const accessToken = session?.access_token;

  useEffect(() => {
    async function loadSignedUrl() {
      if (!accessToken || !projectId || !documentId) {
        setIsLoadingUrl(false);
        return;
      }

      try {
        setIsLoadingUrl(true);
        setError("");

        const response = await getProjectDocumentSignedUrl(
          accessToken,
          projectId,
          documentId,
        );

        setSignedUrl(response.url);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load document URL.";
        setError(message);
      } finally {
        setIsLoadingUrl(false);
      }
    }

    loadSignedUrl();
  }, [accessToken, projectId, documentId]);

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  if (!documentId) {
    return <Navigate to={`/client/${projectId}/documents`} replace />;
  }

  if (!document) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Document Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            This document was not passed to the viewer. Please return to the
            documents page and open it again.
          </p>
        </section>
      </main>
    );
  }

  if (isLoadingUrl) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Loading document preview...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-red-400/20 bg-red-400/10 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-red-200">
            Failed to load document preview
          </p>
          <p className="mt-3 text-sm leading-7 text-red-100">{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl">
        <ClientDocumentViewer document={document} viewerUrl={signedUrl} />
      </section>
    </main>
  );
}
