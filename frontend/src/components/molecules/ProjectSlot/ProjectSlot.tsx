import type { Project } from "../../../types";
import styles from "./ProjectSlot.module.scss";

interface ProjectSlotProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectSlot({ project, isSelected, onClick }: ProjectSlotProps) {
  return (
    <button
      className={`${styles.slot} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      aria-pressed={isSelected}
      title={project.title}
    >
      <span className={styles.icon} aria-hidden="true">{project.icon}</span>
      <span className={styles.title}>{project.title}</span>
      <span className={styles.badge}>Em Breve</span>
    </button>
  );
}
