import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectViewer.module.scss";

const ANIM_DURATION = 1200;

interface ProjectViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function ProjectViewer({ url, title, onClose }: ProjectViewerProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(onClose, ANIM_DURATION);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsClosing(true);
        setTimeout(onClose, ANIM_DURATION);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizando ${title}`}
    >
      <div
        className={`${styles.viewer} ${isClosing ? styles.viewerClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <span className={styles.viewerTitle}>{title}</span>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar visualização">
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
          <span className={styles.newTabLabel}>ABRIR</span>
          <span>↗</span>
        </a>
      </div>
    </div>,
    document.body
  );
}
