import type { Project } from "../../../types/project";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export default function ProjectGrid({
  projects,
  onProjectClick,
}: ProjectGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
}
