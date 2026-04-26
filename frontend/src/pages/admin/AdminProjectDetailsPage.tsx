import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import ProjectDocumentsSection from "../../components/admin/project-detail/ProjectDocumentsSection";
import ProjectHeader from "../../components/admin/project-detail/ProjectHeader";
import ProjectMetaForm from "../../components/admin/project-detail/ProjectMetaForm";
import ProjectMilestonesSection from "../../components/admin/project-detail/ProjectMilestonesSection";
import ProjectUpdatesSection from "../../components/admin/project-detail/ProjectUpdatesSection";
import type { Company } from "../../types/company";
import type { Project } from "../../types/project";
import { getProjectDetails } from "../../services/api/project/getProjectDetails/api";
import { modifyProjectDetails } from "../../services/api/project/modifyProjectDetails/api";
import { insertProjectUpdate } from "../../services/api/project/insertProjectUpdate/api";
import { insertProjectDocument } from "../../services/api/project/insertProjectDocument/api";
import type { AdminPortalProjectRecord } from "../../types/company";

type LocationState = {
  company?: Company;
  project?: Project;
};

function mergeSavedProjectDetails(
  currentProject: AdminPortalProjectRecord,
  savedProject: Project,
): AdminPortalProjectRecord {
  return {
    ...currentProject,
    id: savedProject.id,
    name: savedProject.name,
    currentPhase: savedProject.currentPhase,
    nextStep: savedProject.nextStep,
    startDate: savedProject.startDate,
    status: savedProject.status,
    targetLaunchDate: savedProject.targetLaunchDate,
    clientVisibleSummary: savedProject.clientVisibleSummary,
  };
}

export default function AdminProjectDetailsPage() {
  const { session } = useAdminAuth();
  const accessToken = session?.access_token;

  const navigate = useNavigate();
  const location = useLocation();

  const { companyId, projectId } = useParams();

  const locationState = location.state as LocationState | null;

  const company = locationState?.company ?? null;

  const [project, setProject] = useState<AdminPortalProjectRecord | null>(null);
  const [originalProject, setOriginalProject] =
    useState<AdminPortalProjectRecord | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [documentSuccessMessage, setDocumentSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProject() {
      if (!accessToken) {
        setError("No active admin session found.");
        setIsLoading(false);
        return;
      }

      if (!companyId) {
        setError("No company ID provided in URL.");
        setIsLoading(false);
        return;
      }

      if (!projectId) {
        setError("No project ID provided in URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getProjectDetails(accessToken, projectId);

        setProject(data);
        setOriginalProject(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load project.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [accessToken, companyId, projectId]);

  async function handleSaveProjectDetails() {
    if (!accessToken) {
      setSaveError("No active admin session found.");
      return;
    }

    if (!projectId || !project || !originalProject) {
      setSaveError("Project details are not ready to save.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");
      setSaveSuccessMessage("");

      const savedProject = await modifyProjectDetails(accessToken, projectId, {
        name: project.name,
        currentPhase: project.currentPhase,
        nextStep: project.nextStep,
        startDate: project.startDate,
        status: project.status,
        targetLaunchDate: project.targetLaunchDate,
        clientVisibleSummary: project.clientVisibleSummary,
      });

      const updatedProject = mergeSavedProjectDetails(project, savedProject);

      setProject(updatedProject);
      setOriginalProject(updatedProject);

      setSaveSuccessMessage("Project details saved successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save project details.";

      setSaveError(message);
      setSaveSuccessMessage("");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddUpdate(payload: {
    title: string;
    description: string;
    isVisibleToClient: boolean;
  }) {
    if (!accessToken) {
      setUpdateError("No active admin session found.");
      return;
    }

    if (!projectId || !project) {
      setUpdateError("Project details are not ready.");
      return;
    }

    const createdByAdminId = session?.user?.id;

    if (!createdByAdminId) {
      setUpdateError("No admin user ID found.");
      return;
    }

    try {
      setIsAddingUpdate(true);
      setUpdateError("");
      setUpdateSuccessMessage("");

      const insertedUpdate = await insertProjectUpdate(
        {
          projectId,
          title: payload.title,
          description: payload.description,
          isVisibleToClient: payload.isVisibleToClient,
          createdByAdminId,
        },
        accessToken,
      );

      setProject((previousProject) => {
        if (!previousProject) {
          return previousProject;
        }

        return {
          ...previousProject,
          updates: [insertedUpdate, ...previousProject.updates],
        };
      });

      setUpdateSuccessMessage("Project update added successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add project update.";

      setUpdateError(message);
      setUpdateSuccessMessage("");
    } finally {
      setIsAddingUpdate(false);
    }
  }

  async function handleAddDocument(payload: {
    title: string;
    category: string;
    description: string;
    isVisibleToClient: boolean;
    file: File;
  }) {
    if (!accessToken) {
      setDocumentError("No active admin session found.");
      return;
    }

    if (!projectId || !project) {
      setDocumentError("Project details are not ready.");
      return;
    }

    try {
      setIsUploadingDocument(true);
      setDocumentError("");
      setDocumentSuccessMessage("");
      console.log("projectId", projectId);
      const insertedDocument = await insertProjectDocument(
        {
          projectId,
          title: payload.title,
          category: payload.category,
          description: payload.description,
          isVisibleToClient: payload.isVisibleToClient,
          file: payload.file,
        },
        accessToken,
      );

      setProject((previousProject) => {
        if (!previousProject) {
          return previousProject;
        }

        return {
          ...previousProject,
          documents: [insertedDocument, ...previousProject.documents],
        };
      });

      setDocumentSuccessMessage("Document uploaded successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload document.";

      setDocumentError(message);
      setDocumentSuccessMessage("");
    } finally {
      setIsUploadingDocument(false);
    }
  }

  function handleAddMilestone(payload: {
    label: string;
    status: AdminPortalProjectRecord["milestones"][number]["status"];
  }) {
    setProject((previousProject) => {
      if (!previousProject) {
        return previousProject;
      }

      return {
        ...previousProject,
        milestones: [
          ...previousProject.milestones,
          {
            id: `milestone-${Date.now()}`,
            projectId: previousProject.id,
            label: payload.label,
            displayOrder: previousProject.milestones.length + 1,
            status: payload.status,
            completedAt:
              payload.status === "complete" ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loading Project
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Fetching the latest project details.
          </p>
        </section>
      </main>
    );
  }

  if (error || !company || !project || !projectId) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Project Not Found
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            {error || "The requested project could not be found."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="transition hover:opacity-80"
          >
            Companies
          </button>

          <span className="text-[var(--color-muted)]">/</span>

          <button
            type="button"
            onClick={() => navigate(`/admin/${company.id}`)}
            className="transition hover:opacity-80"
          >
            {company.name}
          </button>

          <span className="text-[var(--color-muted)]">/</span>

          <span>{project.name}</span>
        </div>

        <ProjectHeader company={company} project={project} />

        <div className="mt-8 grid gap-6">
          <ProjectMetaForm
            project={project}
            onProjectChange={(updatedProject) => {
              setProject(updatedProject);
              setSaveError("");
              setSaveSuccessMessage("");
            }}
            onSave={handleSaveProjectDetails}
            isSaving={isSaving}
            saveError={saveError}
            saveSuccessMessage={saveSuccessMessage}
          />

          {updateError && (
            <p className="rounded-2xl border border-[var(--color-error-border)] bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
              {updateError}
            </p>
          )}

          {updateSuccessMessage && (
            <p className="rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
              {updateSuccessMessage}
            </p>
          )}

          <ProjectUpdatesSection
            updates={project.updates}
            onAddUpdate={handleAddUpdate}
          />

          {documentError && (
            <p className="rounded-2xl border border-[var(--color-error-border)] bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
              {documentError}
            </p>
          )}

          {documentSuccessMessage && (
            <p className="rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
              {documentSuccessMessage}
            </p>
          )}

          <ProjectDocumentsSection
            documents={project.documents}
            onAddDocument={handleAddDocument}
            isUploadingDocument={isUploadingDocument}
          />

          <ProjectMilestonesSection
            milestones={project.milestones}
            onAddMilestone={handleAddMilestone}
          />
        </div>
      </section>
    </main>
  );
}
