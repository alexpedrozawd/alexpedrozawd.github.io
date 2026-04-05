import { OrnamentDivider } from "../../atoms/OrnamentDivider/OrnamentDivider";
import { useContactForm } from "../../../hooks/useContactForm";
import styles from "./SystemTab.module.scss";

const SUBJECT_OPTIONS = [
  "Proposta de Trabalho",
  "Freelance / Projeto",
  "Colaboração",
  "Dúvida Técnica",
  "Outro",
];

export function SystemTab() {
  const {
    form,
    status,
    errorMessage,
    successMessage,
    nameError,
    handleChange,
    handleSubmit,
  } = useContactForm();

  return (
    <div className={styles.container}>
      {/* — Contact Form — */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>✉ Enviar Carta</h3>

        {status === "success" ? (
          <div className={styles.successBox} role="alert">
            <span className={styles.successIcon}>✅</span>
            <span>{successMessage}</span>
          </div>
        ) : (
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulário de contato"
          >
            {status === "error" && errorMessage && (
              <p className={styles.errorMsg} role="alert">{errorMessage}</p>
            )}

            <div className={styles.field}>
              <label htmlFor="contact-name" className={styles.label}>
                Nome do Aventureiro (Nome)
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`${styles.input} ${nameError ? styles.inputError : ""}`}
                placeholder="Seu nome"
                required
                maxLength={120}
                autoComplete="name"
                aria-describedby={nameError ? "name-error" : undefined}
              />
              {nameError && (
                <p id="name-error" className={styles.fieldError} role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email" className={styles.label}>
                Pergaminho de Resposta (E-mail)
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-subject" className={styles.label}>
                Motivo do Contato
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`${styles.input} ${styles.selectInput}`}
                required
              >
                <option value="">Selecione um motivo...</option>
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message" className={styles.label}>
                Mensagem
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Escreva sua mensagem..."
                required
                maxLength={5000}
                rows={4}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                <>
                  <span aria-hidden="true">📜</span>
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
