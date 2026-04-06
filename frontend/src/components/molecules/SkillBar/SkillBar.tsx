import { RPGProgressBar } from "../../atoms/RPGProgressBar/RPGProgressBar";
import type { Skill } from "../../../types";
import styles from "./SkillBar.module.scss";

interface SkillBarProps {
  skill: Skill;
}

const SKILL_COLORS: Record<string, string> = {
  bootstrap:  "linear-gradient(90deg, #4a1a8a, #7952b3)",
  javascript: "linear-gradient(90deg, #7a6200, #f7df1e)",
  rest:       "linear-gradient(90deg, #3a5a1a, #6abf40)",
  java:       "linear-gradient(90deg, #7a2a00, #e76f00)",
  spring:     "linear-gradient(90deg, #1a5c2a, #6db33f)",
  react:      "linear-gradient(90deg, #0e7a9e, #61dafb)",
  typescript: "linear-gradient(90deg, #1a4080, #3178c6)",
  python:     "linear-gradient(90deg, #1a3a60, #3572a5)",
  fastapi:    "linear-gradient(90deg, #005544, #009688)",
  pytest:     "linear-gradient(90deg, #0e5e3a, #00a651)",
  pylance:    "linear-gradient(90deg, #1a2a6e, #4b8bbe)",
  sql:        "linear-gradient(90deg, #5c3a1a, #f29111)",
};

const MONO_ICONS = new Set(["rest"]);

const SKILL_ICONS: Record<string, string> = {
  bootstrap:  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
  react:      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  python:     "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  fastapi:    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  java:       "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  spring:     "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
  sql:        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  rest:       "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/gear-fill.svg",
};

export function SkillBar({ skill }: SkillBarProps) {
  const colorKey = skill.name.toLowerCase().replace(/\s+/g, "");
  const color = skill.color ?? SKILL_COLORS[colorKey];
  const icon  = SKILL_ICONS[colorKey];

  return (
    <div className={styles.container}>
      <div className={styles.barWrapper}>
        <RPGProgressBar
          value={skill.value}
          color={color}
          label={skill.name}
          thin
        />
      </div>
      {icon
        ? <img src={icon} alt={skill.name} className={MONO_ICONS.has(colorKey) ? styles.iconMono : styles.icon} loading="lazy" />
        : <span className={styles.iconPlaceholder} />
      }
    </div>
  );
}
