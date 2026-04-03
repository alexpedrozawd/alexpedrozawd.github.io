# Guia de Deploy — GitHub Pages

## Passo 1 — Autenticar o GitHub CLI (fazer uma vez)

```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth login
# → GitHub.com → HTTPS → Login with a web browser
```

---

## Passo 2 — Criar repositório e fazer push

```bash
export PATH="$HOME/.local/bin:$PATH"
cd /home/a-p/portfolio

# Cria o repo público no GitHub (já como user page)
gh repo create alexpedrozawd.github.io \
  --public \
  --description "Portfólio — Dark Fantasy RPG Pause Menu" \
  --source . \
  --remote origin \
  --push
```

---

## Passo 3 — Ativar GitHub Pages no repositório

1. Acesse: https://github.com/alexpedrozawd/alexpedrozawd.github.io/settings/pages
2. Em **Source**, selecione: **GitHub Actions**
3. Salve.

O workflow `.github/workflows/deploy.yml` fará o build e deploy automaticamente.

---

## Passo 4 — Configurar o Formspree (formulário de contato)

1. Cadastre-se em https://formspree.io (plano Free: 50 envios/mês)
2. Crie um novo form com o e-mail `alexandrepedrozamb@gmail.com`
3. Copie o endpoint (ex: `https://formspree.io/f/xpwzgkab`)
4. No repositório GitHub: **Settings → Secrets and variables → Actions → New secret**
   - Nome: `VITE_FORMSPREE_URL`
   - Valor: seu endpoint do Formspree
5. Re-execute o workflow (ou faça qualquer push na `main`)

---

## Passo 5 — Acompanhar o deploy

- Acesse: https://github.com/alexpedrozawd/alexpedrozawd.github.io/actions
- Aguarde o workflow **Deploy to GitHub Pages** ficar verde ✅
- Site disponível em: **https://alexpedrozawd.github.io/**

---

## Atualizações futuras

Qualquer push na branch `main` aciona automaticamente o build e o deploy.

```bash
cd /home/a-p/portfolio
git add .
git commit -m "feat: minha atualização"
git push
```
