import type { TabId } from "../../../types";
import styles from "./TabNavigation.module.scss";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "status",   label: "Status",    icon: "⚔️" },
  { id: "inventory", label: "Inventário", icon: "🎒" },
  { id: "questlog",  label: "Quest Log",  icon: "📜" },
  { id: "system",    label: "Sistema",    icon: "⚙️" },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className={styles.nav} role="tablist" aria-label="Menu de Pausa">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
          <span className={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
