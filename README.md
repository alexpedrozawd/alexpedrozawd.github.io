# ⚔ Alexandre Pedroza — Portfolio RPG

> Portfólio pessoal com temática de **Menu de Pausa de RPG** (Dark Fantasy / Witcher 3).  
> Interface de jogo medieval sobre um stack moderno: **React + FastAPI**.

**Site em produção:** https://alexpedrozawd.github.io/

---

## Visão Geral

| Camada    | Stack                                                         |
|-----------|---------------------------------------------------------------|
| Frontend  | React 18, Vite, TypeScript, SCSS (CSS Modules), Bootstrap 5  |
| Backend   | Python 3.10+, FastAPI, Pydantic v2                            |
| Deploy    | GitHub Pages (frontend) via GitHub Actions                    |
| Contato   | Formspree (substitui backend em produção estática)            |
| Segurança | Rate limiting (slowapi), sanitização, security headers, CORS  |

---

## Abas do Portfólio

| Aba | Ícone | Conteúdo |
|-----|-------|----------|
| **Status** | ⚔️ | Avatar, atributos (HP/MP/XP), pergaminho do herói (CVs), habilidades, lore |
| **Inventário** | 🎒 | 4 cards de projetos (Alpha, Beta, Gamma, Delta) com painel de detalhes |
| **Quest Log** | 📜 | Histórico profissional e acadêmico dividido em quests principais e secundárias |
| **Cartas** | 🪶 | Formulário de contato com validação em tempo real |

---

## Pré-requisitos

- **Node.js** ≥ 18
- **Python** ≥ 3.10

---

## Setup Local

### 1. Clone o repositório

```bash
git clone https://github.com/alexpedrozawd/alexpedrozawd.github.io.git
cd alexpedrozawd.github.io
```

### 2. Backend (opcional — não usado em produção)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # configure credenciais SMTP
uvicorn app.main:app --reload --port 8000
```

API disponível em `http://localhost:8000`  
Documentação interativa (modo debug): `http://localhost:8000/api/docs`

#### Variáveis de ambiente do backend (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app
FROM_EMAIL=seu_email@gmail.com
TO_EMAIL=alexandrepedrozamb@gmail.com
```

> **Gmail**: ative 2FA → gere uma "App Password" em Conta Google → Segurança → Senhas de app.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:5173`

#### Variáveis de ambiente do frontend (.env.local)

```env
VITE_FORMSPREE_URL=https://formspree.io/f/seu_id   # endpoint do Formspree
```

---

## Scripts

### Backend

| Comando | Descrição |
|---------|-----------|
| `uvicorn app.main:app --reload` | Servidor de desenvolvimento |
| `pytest` | Executa testes com cobertura |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite com HMR |
| `npm run build` | Build de produção |
| `npm run test` | Testes Vitest |
| `npm run test:coverage` | Cobertura de testes |

---

## Estrutura de Pastas

```
portfolio/
├── .github/workflows/
│   └── deploy.yml               # CI/CD — build e deploy no GitHub Pages
├── backend/
│   ├── app/
│   │   ├── core/                # Config, segurança, rate limiting
│   │   ├── routers/             # Endpoints FastAPI (projects, contact)
│   │   ├── schemas/             # Modelos Pydantic + HATEOAS Link
│   │   └── services/            # Lógica de negócio
│   └── tests/
└── frontend/
    └── src/
        ├── components/
        │   ├── atoms/           # RPGProgressBar, OrnamentDivider, icons/
        │   ├── molecules/       # SkillBar, ProjectSlot, QuestEntry
        │   └── organisms/       # PauseMenu, StatusTab, InventoryTab,
        │                        # QuestLogTab, SystemTab, TabNavigation
        ├── hooks/               # useTabNavigation, useContactForm
        ├── styles/              # _variables.scss, _mixins.scss, global.scss
        └── types/               # index.ts — tipos centralizados
```

Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes completos.

---

## Links Úteis

- [Site em produção](https://alexpedrozawd.github.io/)
- [LinkedIn](https://www.linkedin.com/in/alexandre-pedroza-mb/)
- [Currículo (Google Drive)](https://drive.google.com/file/d/1erqBgJDkqoHGzEb6wDiFB6n-DEmIHOtJ/view?usp=sharing)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEPLOY.md](./DEPLOY.md)
- [SECURITY.md](./SECURITY.md)
- [TESTING.md](./TESTING.md)
