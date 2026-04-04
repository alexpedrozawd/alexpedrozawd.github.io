import { OrnamentDivider } from "../../atoms/OrnamentDivider/OrnamentDivider";
import { RPGProgressBar } from "../../atoms/RPGProgressBar/RPGProgressBar";
import { SkillBar } from "../../molecules/SkillBar/SkillBar";
import type { Skill } from "../../../types";
import styles from "./StatusTab.module.scss";

const LINKEDIN_URL = "https://www.linkedin.com/in/alexandre-pedroza-mb/";
const CV_URL = "#"; // substituir pela URL do PDF quando disponível

const AVATAR_URL =
  "https://media.licdn.com/dms/image/v2/D4E03AQHT58_HCwY50w/profile-displayphoto-scale_400_400/B4EZzn.QPxHYAg-/0/1773418386666?e=1776902400&v=beta&t=jhHxaosj8e616AhfBqzFo0XWBPhSvQbnNBg_AabahFs";

const SKILLS: Skill[] = [
  { name: "Bootstrap",  value: 90 },
  { name: "React",      value: 82 },
  { name: "TypeScript", value: 75 },
  { name: "Python",     value: 80 },
  { name: "FastAPI",    value: 78 },
  { name: "ClaudeCode", value: 88 },
];

const ATTRIBUTES = [
  { label: "HP", value: 99, max: 99, color: "#c0392b" },
  { label: "MP", value: 87, max: 99, color: "#3178c6" },
  { label: "XP", value: 99, max: 99, color: "#c9aa71" },
];

export function StatusTab() {
  return (
    <div className={styles.container}>
      {/* — Hero Row: avatar/identity (left) + attributes (right) — */}
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
          {/* — Attributes — */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Atributos</h3>
            <div className={styles.attributes}>
              {ATTRIBUTES.map((attr) => (
                <div key={attr.label} className={styles.attr}>
                  <span className={styles.attrLabel}>{attr.label}</span>
                  <RPGProgressBar
                    value={(attr.value / attr.max) * 100}
                    color={attr.color}
                    thin
                  />
                  <span className={styles.attrValue}>
                    {attr.value}/{attr.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrnamentDivider />

      {/* — Pergaminho do Herói — */}
      <div className={styles.pergaminhoSection}>
        <h3 className={styles.sectionTitle}>📄 Pergaminho do Herói</h3>
        <div className={styles.cvButtons}>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cvButton}
          >
            <span aria-hidden="true">⚔</span>
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

      <OrnamentDivider symbol="⚙" />

      {/* — Skills — */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Habilidades</h3>
        <div className={styles.skills}>
          {SKILLS.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      <OrnamentDivider />

      {/* — Lore — */}
      <div className={styles.lore}>
        <p>
          Aventureiro digital de João Pessoa – PB. Transicionei de Suporte &amp; Infra para o
          desenvolvimento fullstack, forjando interfaces medievais e APIs rápidas como
          raios arcanos. Sempre buscando novos feitiços na stack moderna.
        </p>
      </div>
    </div>
  );
}
