import type { Project } from "../../../types";
import styles from "./ProjectSlot.module.scss";

interface ProjectSlotProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectSlot({ project, isSelected, onClick }: ProjectSlotProps) {
  const isActive = project.status === "active";

  return (
    <button
      className={`${styles.slot} ${isSelected ? styles.selected : ""} ${isActive ? styles.activeSlot : ""}`}
      onClick={onClick}
      aria-pressed={isSelected}
      title={project.title}
    >
      {project.imageUrl ? (
        <span className={styles.imageWrapper} aria-hidden="true">
          <img
            src={project.imageUrl}
            alt={project.title}
            className={styles.imageIcon}
            loading="lazy"
          />
        </span>
      ) : (
        <span className={styles.icon} aria-hidden="true">{project.icon}</span>
      )}

      <span className={styles.title}>{project.title}</span>

      {isActive ? (
        <span className={styles.activeBadge}>Ativo</span>
      ) : (
        <span className={styles.badge}>Em Breve</span>
      )}
    </button>
  );
}
