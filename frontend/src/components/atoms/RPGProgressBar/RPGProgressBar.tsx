import styles from "./RPGProgressBar.module.scss";

interface RPGProgressBarProps {
  value: number; // 0–100
  color?: string;
  label?: string;
  showPercent?: boolean;
  animated?: boolean;
  thin?: boolean;
}

export function RPGProgressBar({
  value,
  color,
  label,
  showPercent = false,
  animated = false,
  thin = false,
}: RPGProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`${styles.wrapper} ${thin ? styles.thin : ""}`} role="progressbar"
      aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}>
      {label && (
        <span className={styles.label}>{label}</span>
      )}
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${animated ? styles.animated : ""}`}
          style={{
            width: `${clampedValue}%`,
            ...(color ? { background: color } : {}),
          }}
        />
        <div className={styles.sheen} />
      </div>
      {showPercent && (
        <span className={styles.percent}>{clampedValue}%</span>
      )}
    </div>
  );
}
