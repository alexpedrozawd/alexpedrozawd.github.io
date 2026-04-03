import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InventoryTab } from "../InventoryTab";

describe("InventoryTab", () => {
  it("renders three project slots", () => {
    render(<InventoryTab />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("renders project titles", () => {
    render(<InventoryTab />);
    expect(screen.getByTitle("Projeto Alpha")).toBeInTheDocument();
    expect(screen.getByTitle("Projeto Beta")).toBeInTheDocument();
    expect(screen.getByTitle("Projeto Gamma")).toBeInTheDocument();
  });

  it("shows detail panel when a slot is clicked", () => {
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
});
