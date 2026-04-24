import { useState } from "react";
import { ProjectSlot } from "../../molecules/ProjectSlot/ProjectSlot";
import type { Project } from "../../../types";
import styles from "./InventoryTab.module.scss";

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Ixalan News",
    description:
      "Site de notícias sobre o bloco Ixalan de Magic: The Gathering, recriado do zero com React, TypeScript, FastAPI e Supabase.",
    status: "active",
    tags: ["React", "TypeScript", "FastAPI", "Supabase"],
    icon: "🦕",
    imageUrl: "https://api.scryfall.com/cards/xln/222?format=image&version=art_crop",
    url: "https://alexpedrozawd.github.io/ixalan-project/",
  },
  {
    id: 2,
    title: "Projeto Alpha",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "⚔️",
  },
  {
    id: 3,
    title: "Projeto Beta",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "🛡️",
  },
  {
    id: 4,
    title: "Projeto Gamma",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "🔮",
  },
  {
    id: 5,
    title: "Projeto Delta",
    description: "Em breve...",
    status: "coming_soon",
    tags: [],
    icon: "🏹",
  },
];

export function InventoryTab() {
  const [selectedId, setSelectedId] = useState<number | null>(PROJECTS[0]?.id ?? null);
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className={styles.container}>
      <h3 className={styles.gridTitle}>Inventário</h3>

      <div className={styles.row}>
        <div className={styles.grid}>
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
        </div>

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
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const isActive = project.status === "active";

  return (
    <div className={styles.detailInner}>
      {project.imageUrl ? (
        <div className={styles.detailImageWrapper} aria-hidden="true">
          <img
            src={project.imageUrl}
            alt={project.title}
            className={styles.detailImage}
            loading="lazy"
          />
        </div>
      ) : (
        <div className={styles.detailIcon} aria-hidden="true">{project.icon}</div>
      )}

      <h3 className={styles.detailTitle}>{project.title}</h3>

      <span className={isActive ? styles.statusActive : styles.statusBadge}>
        {isActive ? "✦ Disponível" : "Em Breve"}
      </span>

      {project.tags.length > 0 && (
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      {isActive ? (
        <div className={styles.activeSection}>
          <p className={styles.detailDesc}>{project.description}</p>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.verProjetoBtn}
              aria-label={`Ver projeto ${project.title} no GitHub`}
            >
              Ver Projeto ⚔
            </a>
          )}
        </div>
      ) : (
        <div className={styles.loadingSection}>
          <p className={styles.loadingLabel}>Carregando...</p>
          <div className={styles.loadingTrack}>
            <div className={styles.loadingFill} />
          </div>
          <p className={styles.comingSoon}>✨ Em Breve ✨</p>
        </div>
      )}

      {!isActive && (
        <p className={styles.detailDesc}>
          Este projeto está sendo forjado nas profundezas do código.
          Retorne em breve para descobri-lo.
        </p>
      )}
    </div>
  );
}
