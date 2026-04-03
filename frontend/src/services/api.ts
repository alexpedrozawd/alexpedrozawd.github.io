import type { ContactFormData, ContactResponse, Project } from "../types";

const BASE_URL = "/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.detail ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProjects: (): Promise<{ projects: Project[]; total: number }> =>
    request("/projects/"),

  getProject: (id: number): Promise<Project> => request(`/projects/${id}`),

  sendContact: (data: ContactFormData): Promise<ContactResponse> =>
    request("/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
