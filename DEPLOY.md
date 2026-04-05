# Guia de Deploy — GitHub Pages

O site está disponível em: **https://alexpedrozawd.github.io/**

Qualquer push na branch `main` aciona automaticamente o workflow de build e deploy.

---

## Como funciona o CI/CD

```
push → main
  → .github/workflows/deploy.yml
    → Node 24 + npm ci
    → vite build (injeta VITE_FORMSPREE_URL do GitHub Secret)
    → actions/deploy-pages
  → https://alexpedrozawd.github.io/
```

---

## Setup inicial (feito uma vez)

### Passo 1 — Autenticar o GitHub CLI

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth login
# → GitHub.com → HTTPS → Login with a web browser
```

### Passo 2 — Criar repositório e fazer push

```bash
gh repo create alexpedrozawd.github.io \
  --public \
  --description "Portfólio — Dark Fantasy RPG Pause Menu" \
  --source . \
  --remote origin \
  --push
```

### Passo 3 — Ativar GitHub Pages

1. Acesse: https://github.com/alexpedrozawd/alexpedrozawd.github.io/settings/pages
2. Em **Source**, selecione: **GitHub Actions**
3. Salve.

### Passo 4 — Configurar o Formspree

O formulário de contato em produção usa [Formspree](https://formspree.io) (plano Free: 50 envios/mês).

1. Crie uma conta em https://formspree.io
2. Crie um novo form com o e-mail `alexandrepedrozamb@gmail.com`
3. Copie o endpoint (ex: `https://formspree.io/f/xpwzgkab`)
4. No repositório GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - Nome: `VITE_FORMSPREE_URL`
   - Valor: seu endpoint do Formspree

---

## Atualizações

```bash
cd /home/a-p/portfolio
git add .
git commit -m "feat: descrição da alteração"
git push
```

Acompanhe o progresso em: https://github.com/alexpedrozawd/alexpedrozawd.github.io/actions

---

## Variáveis de ambiente em produção

| Secret (GitHub) | Uso |
|-----------------|-----|
| `VITE_FORMSPREE_URL` | Endpoint do Formspree para o formulário de contato |

---

## Notas técnicas

- O build usa `vite build` diretamente (sem `tsc &&`) para evitar falsos positivos do TypeScript com JSX em arrays de constantes
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` necessário para `upload-pages-artifact@v3` (ainda sem versão Node 24)
- Actions atualizadas para Node 24 nativo: `checkout@v6`, `setup-node@v6`, `deploy-pages@v5`
- O backend FastAPI **não é deployado** — é mantido no repositório para uso futuro em servidor dedicado
- A branch de deploy é `gh-pages`, gerenciada automaticamente pelo workflow
