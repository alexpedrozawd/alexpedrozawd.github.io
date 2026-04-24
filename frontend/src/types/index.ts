import type { ReactNode } from "react";

export type TabId = "status" | "inventory" | "questlog" | "system";

export interface Skill {
  name: string;
  value: number; // 0–100
  color?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: "coming_soon" | "active" | "archived";
  tags: string[];
  icon: ReactNode;
  imageUrl?: string;
  url?: string;
}

export interface Quest {
  id: string;
  type: "main" | "side";
  title: string;
  organisation?: string;
  period: string;
  description: string;
  completed: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
