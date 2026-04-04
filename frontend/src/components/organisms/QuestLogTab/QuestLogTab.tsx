import { useState } from "react";
import { QuestEntry } from "../../molecules/QuestEntry/QuestEntry";
import { OrnamentDivider } from "../../atoms/OrnamentDivider/OrnamentDivider";
import type { Quest } from "../../../types";
import styles from "./QuestLogTab.module.scss";

const MAIN_QUESTS: Quest[] = [
  {
    id: "mq-1",
    type: "main",
    title: "Manutenção de Computadores",
    organisation: "Autônomo",
    period: "2010 – 2014",
    description:
      "Início da jornada: montagem, formatação e reparo de hardware e software. Primeiro contato com o universo da tecnologia ainda na adolescência.",
    completed: true,
  },
  {
    id: "mq-2",
    type: "main",
    title: "Redes & SysAdmin",
    organisation: "HostDime Brasil",
    period: "2015 – 2016",
    description:
      "Administração de servidores Linux/Windows, Active Directory, DHCP, DNS, VPN e infraestrutura de redes corporativas.",
    completed: true,
  },
  {
    id: "mq-3",
    type: "main",
    title: "Suporte Técnico",
    organisation: "Webtec Sistemas",
    period: "2019",
    description:
      "Atendimento ao usuário final, resolução de problemas de suporte de nível 1 e 2.",
    completed: true,
  },
  {
    id: "mq-5",
    type: "main",
    title: "Suporte Técnico",
    organisation: "Logon Informática",
    period: "2020 – 2024",
    description:
      "Atendimento ao usuário final, resolução de incidentes e suporte de nível 1 e 2. Consolidação das bases de troubleshooting.",
    completed: true,
  },
  {
    id: "mq-4",
    type: "main",
    title: "Desenvolvedor Fullstack",
    organisation: "Atual",
    period: "2023 – Presente",
    description:
      "Desenvolvimento de aplicações web com React, TypeScript, Python e FastAPI. Foco em interfaces modernas e APIs escaláveis.",
    completed: false,
  },
];

const SIDE_QUESTS: Quest[] = [
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
  {
    id: "sq-2",
    type: "side",
    title: "Estágio em Manutenção e Redes",
    organisation: "SENAI-PB",
    period: "2015 – 2016",
    description:
      "Estágio supervisionado com foco em manutenção de computadores, infraestrutura de redes e suporte técnico.",
    completed: true,
  },
  {
    id: "sq-3",
    type: "side",
    title: "Certificação Fullstack & IA",
    organisation: "ProgramaAI",
    period: "2026",
    description:
      "Certificação em desenvolvimento fullstack moderno e ferramentas de Inteligência Artificial aplicadas ao desenvolvimento de software.",
    completed: true,
  },
];

type Filter = "all" | "main" | "side";

export function QuestLogTab() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {(["all", "main", "side"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "📋 Todas" : f === "main" ? "⚔ Principais" : "📖 Secundárias"}
          </button>
        ))}
      </div>

      <div className={styles.log}>
        {(filter === "all" || filter === "main") && (
          <section>
            <h3 className={styles.sectionTitle}>
              <span>⚔</span> Quests Principais
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
