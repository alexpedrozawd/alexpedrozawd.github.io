import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useContactForm } from "../useContactForm";
import * as apiModule from "../../services/api";

describe("useContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initialises with empty fields and idle status", () => {
    const { result } = renderHook(() => useContactForm());
    expect(result.current.form.name).toBe("");
    expect(result.current.status).toBe("idle");
  });

  it("updates form field on handleChange", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Aragorn" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.form.name).toBe("Aragorn");
  });

  it("strips dangerous characters during handleChange", () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "<script>alert(1)</script>" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.form.name).not.toContain("<");
    expect(result.current.form.name).not.toContain(">");
  });

  it("sets error status when submitting with empty name", async () => {
    const { result } = renderHook(() => useContactForm());
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toContain("Nome");
  });

  it("calls api.sendContact and sets success status on valid submission", async () => {
    vi.spyOn(apiModule.api, "sendContact").mockResolvedValue({
      success: true,
      message: "Enviado com sucesso!",
    });

    const { result } = renderHook(() => useContactForm());

    act(() => {
      ["name", "email", "subject", "message"].forEach((field) => {
        const values: Record<string, string> = {
          name: "Legolas",
          email: "legolas@rivendell.com",
          subject: "Proposta de Trabalho",
          message: "Greetings from Middle Earth",
        };
        result.current.handleChange({
          target: { name: field, value: values[field] },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(apiModule.api.sendContact).toHaveBeenCalledOnce();
    expect(result.current.status).toBe("success");
    expect(result.current.successMessage).toBe("Enviado com sucesso!");
  });

  it("sets error status when api.sendContact throws", async () => {
    vi.spyOn(apiModule.api, "sendContact").mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useContactForm());

    act(() => {
      const values: Record<string, string> = {
        name: "Frodo",
        email: "frodo@shire.com",
        subject: "Outro",
        message: "The one ring must be destroyed.",
      };
      Object.entries(values).forEach(([k, v]) => {
        result.current.handleChange({
          target: { name: k, value: v },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toBe("Network error");
  });
});
