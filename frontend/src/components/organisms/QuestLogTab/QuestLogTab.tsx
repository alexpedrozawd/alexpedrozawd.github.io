import { useState } from "react";
import { QuestEntry } from "../../molecules/QuestEntry/QuestEntry";
import { OrnamentDivider } from "../../atoms/OrnamentDivider/OrnamentDivider";
import type { Quest } from "../../../types";
import styles from "./QuestLogTab.module.scss";

const MAIN_QUESTS: Quest[] = [
  {
    id: "mq-4",
    type: "main",
    title: "Desenvolvedor Fullstack",
    organisation: "Nanda Mac & Freelancer",
    period: "2025 – Presente",
    description:
      "Desenvolvimento de aplicações web com React, TypeScript, Python e FastAPI. Foco em interfaces modernas e APIs escaláveis. Conhecimento em ferramentas de IA como Claude Code e Antigravity",
    completed: false,
  },
  {
    id: "mq-3",
    type: "main",
    title: "Suporte Técnico",
    organisation: "Webtec Sistemas & Logon Informática",
    period: "2019 – 2024",
    description:
      "Atendimento ao usuário final via ligações, chat e tickets, resolução de problemas de suporte de nível 1, 2 e 3. Implantações e treinamentos de sistemas, assim como elaboração de documentação de projetos e artigos de ajuda ao usuário.",
    completed: true,
  },
  {
    id: "mq-2",
    type: "main",
    title: "Suporte & SysAdmin",
    organisation: "HostDime Brasil",
    period: "2015 – 2016",
    description:
      "Administração de servidores Linux/Windows com cPanel/WHM & Plesk. Atendimento ao cliente via tickets e chats, acessando servidores de hospedagens de sites via SSH para instalação, configurações, backups, migrações e resolução de problemas",
    completed: true,
  },
  {
    id: "mq-1",
    type: "main",
    title: "Manutenção de Computadores",
    organisation: "Autônomo",
    period: "2010 – 2019",
    description:
      "Início da jornada: montagem, formatação e reparo de hardware e software. Primeiro contato com o universo da tecnologia ainda na adolescência.",
    completed: true,
  },
];

const SIDE_QUESTS: Quest[] = [
  {
    id: "sq-3",
    type: "side",
    title: "Certificação Fullstack & IA",
    organisation: "ProgramaAI",
    period: "2026",
    description:
      "Certificação em desenvolvimento fullstack moderno e ferramentas de Inteligência Artificial aplicadas ao desenvolvimento de software (certificados ProgramaAI).",
    completed: true,
  },
  {
    id: "sq-2",
    type: "side",
    title: "Estágio em Manutenção e Redes",
    organisation: "SENAI-PB",
    period: "2014 – 2015",
    description:
      "Estágio supervisionado com foco em manutenção de computadores, infraestrutura de redes e suporte técnico.",
    completed: true,
  },
  {
    id: "sq-1",
    type: "side",
    title: "Bacharelado em Sistemas de Informação",
    organisation: "UNIESP",
    period: "2012 – 2016",
    description:
      "Formação em análise de sistemas, banco de dados, engenharia de software e gestão de TI.",
    completed: true,
  },
];

type Filter = "all" | "main" | "side";

export function QuestLogTab() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.filterButtons}>
          {(["all", "main", "side"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Todas" : f === "main" ? "Principais" : "Secundárias"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.log}>
        {(filter === "all" || filter === "main") && (
          <section>
            <h3 className={styles.sectionTitle}>
              <span>📖</span> Quests Principais
            </h3>
            {MAIN_QUESTS.map((q) => (
              <QuestEntry key={q.id} quest={q} />
            ))}
          </section>
        )}

        {filter === "all" && <OrnamentDivider symbol="✦" />}

        {(filter === "all" || filter === "side") && (
          <section>
            <h3 className={styles.sectionTitle}>
              <span>📖</span> Quests Secundárias
            </h3>
            {SIDE_QUESTS.map((q) => (
              <QuestEntry key={q.id} quest={q} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
