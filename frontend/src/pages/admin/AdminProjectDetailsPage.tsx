import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectDocumentsSection from "../../components/admin/project-detail/ProjectDocumentsSection";
import ProjectHeader from "../../components/admin/project-detail/ProjectHeader";
import ProjectMetaForm from "../../components/admin/project-detail/ProjectMetaForm";
import ProjectMilestonesSection from "../../components/admin/project-detail/ProjectMilestonesSection";
import ProjectUpdatesSection from "../../components/admin/project-detail/ProjectUpdatesSection";
import {
  adminPortalMockCompanies,
  adminPortalMockProjectDetails,
} from "../../constants/adminPortalMockData";
import type { AdminPortalProjectRecord } from "../../types/company";

export default function AdminProjectDetailsPage() {
  const navigate = useNavigate();
  const { companyId, projectId } = useParams();

  const company = useMemo(() => {
    return (
      adminPortalMockCompanies.find((item) => item.id === companyId) ?? null
    );
  }, [companyId]);

  const initialProject = useMemo(() => {
    if (!projectId) {
      return null;
    }

    return adminPortalMockProjectDetails[projectId] ?? null;
  }, [projectId]);

  const [project, setProject] = useState<AdminPortalProjectRecord | null>(
    initialProject,
  );

  if (!company || !project || !projectId) {
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
            The requested project could not be found in the mock data.
          </p>
        </section>
      </main>
    );
  }

  function handleAddUpdate(payload: {
    title: string;
    description: string;
    isVisibleToClient: boolean;
  }) {
    setProject((previousProject) => {
      if (!previousProject) {
        return previousProject;
      }

      return {
        ...previousProject,
        updates: [
          {
            id: `update-${Date.now()}`,
            projectId: previousProject.id,
            title: payload.title,
            description: payload.description,
            isVisibleToClient: payload.isVisibleToClient,
            createdAt: new Date().toISOString(),
            createdByAdminName: "Current Admin",
          },
          ...previousProject.updates,
        ],
      };
    });
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
            onProjectChange={(updatedProject) => setProject(updatedProject)}
          />

          <ProjectUpdatesSection
            updates={project.updates}
            onAddUpdate={handleAddUpdate}
          />

          <ProjectDocumentsSection documents={project.documents} />

          <ProjectMilestonesSection
            milestones={project.milestones}
            onAddMilestone={handleAddMilestone}
          />
        </div>
      </section>
    </main>
  );
}
