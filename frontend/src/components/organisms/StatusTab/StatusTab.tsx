import { OrnamentDivider } from "../../atoms/OrnamentDivider/OrnamentDivider";
import { SkillBar } from "../../molecules/SkillBar/SkillBar";
import type { Skill } from "../../../types";
import styles from "./StatusTab.module.scss";

const LINKEDIN_URL = "https://www.linkedin.com/in/alexandre-pedroza-mb/";
const CV_URL = "https://drive.google.com/file/d/1erqBgJDkqoHGzEb6wDiFB6n-DEmIHOtJ/view?usp=sharing";

const AVATAR_URL =
  "https://media.licdn.com/dms/image/v2/D4E03AQHT58_HCwY50w/profile-displayphoto-scale_400_400/B4EZzn.QPxHYAg-/0/1773418386666?e=1776902400&v=beta&t=jhHxaosj8e616AhfBqzFo0XWBPhSvQbnNBg_AabahFs";

const LEFT_SKILLS: Skill[] = [
  { name: "Bootstrap",  value: 100 },
  { name: "React",      value: 100 },
  { name: "TypeScript", value: 100 },
  { name: "JavaScript", value: 100 },
  { name: "REST",       value: 100 },
];

const RIGHT_SKILLS: Skill[] = [
  { name: "Python",  value: 100 },
  { name: "FastAPI", value: 100 },
  { name: "Java",    value: 100 },
  { name: "Spring",  value: 100 },
  { name: "SQL",     value: 100 },
];

export function StatusTab() {
  return (
    <div className={styles.container}>
      {/* — Hero Row: avatar (left) + lore text (right) — */}
      <div className={styles.heroRow}>
        <div className={styles.heroLeft}>
          <div className={styles.hero}>
            <div className={styles.avatarWrapper}>
              <img
                src={AVATAR_URL}
                alt="Alexandre Pedroza"
                className={styles.avatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x100/0d0d1a/c9aa71?text=AP";
                }}
              />
              <div className={styles.avatarGlow} aria-hidden="true" />
            </div>
            <div className={styles.identity}>
              <h2 className={styles.name}>Alexandre Pedroza</h2>
              <p className={styles.class}>Desenvolvedor Fullstack</p>
              <div className={styles.levelBadge}>
                <span className={styles.levelLabel}>LVL</span>
                <span className={styles.levelValue}>99</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <p className={styles.heroLore}>
            "Aventureiro digital nascido em João Pessoa – PB, e residindo atualmente em Garanhuns - PE.
            Me aventurei nas terras de Manutenção de Computadores, Redes, SysAdmin e Suporte, até
            chegar no desenvolvimento fullstack. Forjo interfaces e APIs rápidas como raios arcanos,
            sempre buscando novos feitiços da stack moderna."
          </p>
        </div>
      </div>

      <OrnamentDivider />

      {/* — Pergaminhos do Herói — */}
      <div className={styles.pergaminhoSection}>
        <h3 className={styles.sectionTitle}>Pergaminhos do Herói</h3>
        <div className={styles.cvButtons}>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cvButton}
          >
            <span aria-hidden="true">📜</span>
            Curriculum LinkedIn
          </a>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cvButton}
          >
            <span aria-hidden="true">📜</span>
            Curriculum Vitae
          </a>
        </div>
      </div>

      <OrnamentDivider symbol="✦" />

      {/* — Skills — */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Habilidades</h3>
        <div className={styles.skillsGrid}>
          <div className={styles.skillsCol}>
            {LEFT_SKILLS.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
          <div className={styles.skillsCol}>
            {RIGHT_SKILLS.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </div>

      <OrnamentDivider />
    </div>
  );
}
