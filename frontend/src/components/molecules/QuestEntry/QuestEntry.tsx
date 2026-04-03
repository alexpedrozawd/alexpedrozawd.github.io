import type { Quest } from "../../../types";
import styles from "./QuestEntry.module.scss";

interface QuestEntryProps {
  quest: Quest;
}

export function QuestEntry({ quest }: QuestEntryProps) {
  return (
    <div className={`${styles.entry} ${quest.completed ? styles.completed : styles.active}`}>
      <div className={styles.dot} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{quest.title}</span>
          {quest.organisation && (
            <span className={styles.org}>{quest.organisation}</span>
          )}
        </div>
        <span className={styles.period}>{quest.period}</span>
        <p className={styles.description}>{quest.description}</p>
      </div>
    </div>
  );
}
