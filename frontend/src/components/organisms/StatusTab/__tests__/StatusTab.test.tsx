import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusTab } from "../StatusTab";

describe("StatusTab", () => {
  it("renders developer name", () => {
    render(<StatusTab />);
    expect(screen.getByText("Alexandre Pedroza")).toBeInTheDocument();
  });

  it("renders level 99 badge", () => {
    render(<StatusTab />);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("renders all six skill bars", () => {
    render(<StatusTab />);
    const skills = ["Bootstrap", "React", "TypeScript", "Python", "FastAPI", "ClaudeCode"];
    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("renders avatar image with alt text", () => {
    render(<StatusTab />);
    const img = screen.getByRole("img", { name: "Alexandre Pedroza" });
    expect(img).toBeInTheDocument();
  });

  it("renders developer role description", () => {
    render(<StatusTab />);
    expect(screen.getByText(/Desenvolvedor Fullstack/i)).toBeInTheDocument();
  });
});
