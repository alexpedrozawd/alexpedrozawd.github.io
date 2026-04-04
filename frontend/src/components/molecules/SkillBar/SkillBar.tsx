import { RPGProgressBar } from "../../atoms/RPGProgressBar/RPGProgressBar";
import type { Skill } from "../../../types";
import styles from "./SkillBar.module.scss";

interface SkillBarProps {
  skill: Skill;
}

const SKILL_COLORS: Record<string, string> = {
  bootstrap:  "linear-gradient(90deg, #4a1a8a, #7952b3)",
  react:      "linear-gradient(90deg, #0e7a9e, #61dafb)",
  typescript: "linear-gradient(90deg, #1a4080, #3178c6)",
  python:     "linear-gradient(90deg, #1a3a60, #3572a5)",
  fastapi:    "linear-gradient(90deg, #005544, #009688)",
  claudecode: "linear-gradient(90deg, #92400e, #d97706)",
};

export function SkillBar({ skill }: SkillBarProps) {
  const colorKey = skill.name.toLowerCase().replace(/\s+/g, "");
  const color = skill.color ?? SKILL_COLORS[colorKey];

  const displayValue = Math.round(skill.value * 99 / 100);

  return (
    <div className={styles.container}>
      <RPGProgressBar
        value={skill.value}
        color={color}
        label={skill.name}
        valueLabel={`${displayValue}/99`}
        thin
      />
    </div>
  );
}
