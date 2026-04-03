import { useState } from "react";
import { ProjectSlot } from "../../molecules/ProjectSlot/ProjectSlot";
import { RPGProgressBar } from "../../atoms/RPGProgressBar/RPGProgressBar";
import type { Project } from "../../../types";
import styles from "./InventoryTab.module.scss";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Projeto Alpha",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "⚔️",
  },
  {
    id: 2,
    title: "Projeto Beta",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "🛡️",
  },
  {
    id: 3,
    title: "Projeto Gamma",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "🔮",
  },
];

export function InventoryTab() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className={styles.container}>
      {/* Grid */}
      <div className={styles.grid}>
        <h3 className={styles.gridTitle}>Inventário de Projetos</h3>
        <div className={styles.slots}>
          {PROJECTS.map((project) => (
            <ProjectSlot
              key={project.id}
              project={project}
              isSelected={selectedId === project.id}
              onClick={() =>
                setSelectedId((prev) => (prev === project.id ? null : project.id))
              }
            />
          ))}
        </div>
        <p className={styles.hint}>Selecione um item para ver detalhes</p>
      </div>

      {/* Detail panel */}
      <div className={`${styles.detail} ${selectedProject ? styles.visible : ""}`}>
        {selectedProject ? (
          <ProjectDetail project={selectedProject} />
        ) : (
          <div className={styles.emptyDetail}>
            <span className={styles.emptyIcon} aria-hidden="true">📦</span>
            <p>Nenhum item selecionado</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className={styles.detailInner}>
      <div className={styles.detailIcon} aria-hidden="true">{project.icon}</div>
      <h3 className={styles.detailTitle}>{project.title}</h3>
      <span className={styles.statusBadge}>Em Breve</span>

      <div className={styles.loadingSection}>
        <p className={styles.loadingLabel}>Carregando...</p>
        <div className={styles.loadingTrack}>
          <div className={styles.loadingFill} />
        </div>
        <p className={styles.comingSoon}>✨ Em Breve ✨</p>
      </div>

      <p className={styles.detailDesc}>
        Este projeto está sendo forjado nas profundezas do código.
        Retorne em breve para descobri-lo.
      </p>
    </div>
  );
}
