import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InventoryTab } from "../InventoryTab";

describe("InventoryTab", () => {
  it("renders at least five project slots", () => {
    render(<InventoryTab />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });

  it("renders Ixalan News as the first slot", () => {
    render(<InventoryTab />);
    expect(screen.getByTitle("Ixalan News")).toBeInTheDocument();
  });

  it("renders all project titles", () => {
    render(<InventoryTab />);
    expect(screen.getByTitle("Ixalan News")).toBeInTheDocument();
    expect(screen.getByTitle("Projeto Alpha")).toBeInTheDocument();
    expect(screen.getByTitle("Projeto Beta")).toBeInTheDocument();
    expect(screen.getByTitle("Projeto Gamma")).toBeInTheDocument();
  });

  it("Ixalan News slot is selected by default", () => {
    render(<InventoryTab />);
    const slot = screen.getByTitle("Ixalan News");
    expect(slot.getAttribute("aria-pressed")).toBe("true");
  });

  it("shows Ixalan News detail with active status by default", () => {
    render(<InventoryTab />);
    expect(screen.getByText("Ixalan News")).toBeInTheDocument();
    expect(screen.getByText(/disponível/i)).toBeInTheDocument();
  });

  it("shows Ver Projeto link for active project", () => {
    render(<InventoryTab />);
    const link = screen.getByRole("link", { name: /ver projeto ixalan news/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://alexpedrozawd.github.io/ixalan-project/");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows detail panel when Projeto Alpha is clicked", () => {
    render(<InventoryTab />);
    const slot = screen.getByTitle("Projeto Alpha");
    fireEvent.click(slot);
    expect(screen.getByText("Projeto Alpha")).toBeInTheDocument();
    expect(screen.getByText(/Em Breve/i)).toBeInTheDocument();
  });

  it("deselects slot on second click", () => {
    render(<InventoryTab />);
    const slot = screen.getByTitle("Projeto Beta");
    fireEvent.click(slot);
    expect(slot.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(slot);
    expect(slot.getAttribute("aria-pressed")).toBe("false");
  });

  it("Ixalan News slot shows Ativo badge", () => {
    render(<InventoryTab />);
    expect(screen.getByTitle("Ixalan News").textContent).toMatch(/ativo/i);
  });

  it("coming soon slots show Em Breve badge", () => {
    render(<InventoryTab />);
    const alphaSlot = screen.getByTitle("Projeto Alpha");
    expect(alphaSlot.textContent).toMatch(/em breve/i);
  });
});
