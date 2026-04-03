import { TabNavigation } from "../TabNavigation/TabNavigation";
import { StatusTab } from "../StatusTab/StatusTab";
import { InventoryTab } from "../InventoryTab/InventoryTab";
import { QuestLogTab } from "../QuestLogTab/QuestLogTab";
import { SystemTab } from "../SystemTab/SystemTab";
import { useTabNavigation } from "../../../hooks/useTabNavigation";
import type { TabId } from "../../../types";
import styles from "./PauseMenu.module.scss";

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  status:    <StatusTab />,
  inventory: <InventoryTab />,
  questlog:  <QuestLogTab />,
  system:    <SystemTab />,
};

export function PauseMenu() {
  const { activeTab, setActiveTab } = useTabNavigation("status");

  return (
    <div className={styles.overlay} role="main">
      {/* Decorative background blobs */}
      <div className={styles.bgBlob1} aria-hidden="true" />
      <div className={styles.bgBlob2} aria-hidden="true" />

      <div className={styles.window} role="dialog" aria-label="Menu de Pausa — Portfólio">
        {/* ─── Header ─── */}
        <header className={styles.header}>
          <div className={styles.headerOrn} aria-hidden="true">✦</div>
          <h1 className={styles.title}>Menu de Pausa</h1>
          <div className={styles.headerOrn} aria-hidden="true">✦</div>
        </header>

        {/* ─── Tab bar ─── */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ─── Content ─── */}
        <div
          className={styles.content}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-label={activeTab}
          key={activeTab}
        >
          {TAB_CONTENT[activeTab]}
        </div>

        {/* ─── Footer ─── */}
        <footer className={styles.footer}>
          <span>Alexandre Pedroza · Desenvolvedor Fullstack</span>
          <span>João Pessoa — PB</span>
        </footer>
      </div>
    </div>
  );
}
