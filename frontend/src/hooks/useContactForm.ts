import { useState } from "react";
import type { ContactFormData } from "../types";

type FormStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// Replace with your Formspree form ID after signing up at https://formspree.io
// e.g. "https://formspree.io/f/xpwzgkab"
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL ?? "";

function sanitizeField(value: string): string {
  return value.replace(/[<>"'`;\\]/g, "").trimStart();
}

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;

function validateName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!NAME_REGEX.test(trimmed))
    return "Nome inválido: use apenas letras, sem números ou símbolos.";
  if (trimmed.replace(/\s/g, "").length < 3)
    return "Nome deve ter no mínimo 3 letras.";
  return "";
}

export function useContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const sanitized = sanitizeField(value);
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    if (name === "name") setNameError(validateName(sanitized));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Nome é obrigatório.";
    const nameErr = validateName(form.name);
    if (nameErr) return nameErr;
    if (!form.email.trim()) return "E-mail é obrigatório.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Endereço de e-mail inválido.";
    if (!form.subject.trim()) return "Motivo do contato é obrigatório.";
    if (!form.message.trim()) return "Mensagem é obrigatória.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    if (!FORMSPREE_URL) {
      setErrorMessage(
        "Formulário não configurado. Por favor, entre em contato diretamente pelo LinkedIn."
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _replyto: form.email,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      setSuccessMessage("Mensagem enviada com sucesso! Responderei em breve.");
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao enviar mensagem."
      );
      setStatus("error");
    }
  };

  return {
    form,
    status,
    errorMessage,
    successMessage,
    nameError,
    handleChange,
    handleSubmit,
  };
}
