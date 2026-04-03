import { useState } from "react";
import type { TabId } from "../types";

export function useTabNavigation(initial: TabId = "status") {
  const [activeTab, setActiveTab] = useState<TabId>(initial);
  return { activeTab, setActiveTab };
}
