import { useEffect } from "react";
import styles from "./ProjectViewer.module.scss";

interface ProjectViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function ProjectViewer({ url, title, onClose }: ProjectViewerProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={`Visualizando ${title}`}>
      <div className={styles.viewer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topBar}>
          <span className={styles.viewerTitle}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar visualização">
            ✕
          </button>
        </div>
        <iframe
          src={url}
          title={title}
          className={styles.frame}
          loading="lazy"
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.newTabBtn}
          aria-label={`Abrir ${title} em nova aba`}
          title="Abrir em nova aba"
        >
          ↗
        </a>
      </div>
    </div>
  );
}
