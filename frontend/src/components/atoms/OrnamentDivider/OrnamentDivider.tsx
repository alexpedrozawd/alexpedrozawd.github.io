import styles from "./OrnamentDivider.module.scss";

interface OrnamentDividerProps {
  symbol?: string;
}

export function OrnamentDivider({ symbol = "✦" }: OrnamentDividerProps) {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.symbol}>{symbol}</span>
      <span className={styles.line} />
    </div>
  );
}
