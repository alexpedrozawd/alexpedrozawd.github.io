# ⚔ Alexandre Pedroza — Portfolio RPG

> Portfólio pessoal com temática de **Menu de Pausa de RPG** (Dark Fantasy / Witcher 3).  
> Interface de jogo medieval sobre um stack moderno: **React + FastAPI**.

---

## Visão Geral

| Camada    | Stack                              |
|-----------|------------------------------------|
| Frontend  | React 18, Vite, TypeScript, Sass, Bootstrap 5, React-Bootstrap |
| Backend   | Python 3.10+, FastAPI, Pydantic v2 |
| Testes    | Pytest + httpx (backend), Vitest + Testing Library (frontend) |
| Segurança | Rate limiting (slowapi), sanitização, security headers, CORS |

---

## Pré-requisitos

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **npm** ou **pnpm**

---

## Setup

### 1. Clone e entre na pasta

```bash
git clone <repo-url>
cd portfolio
```

### 2. Backend

```bash
cd backend

# Crie e ative um virtualenv
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais SMTP
```

#### Configuração de E-mail (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app   # Use App Password do Google
FROM_EMAIL=seu_email@gmail.com
TO_EMAIL=alexandrepedrozamb@gmail.com
```

> **Gmail**: ative 2FA → gere uma "App Password" em  
> Conta Google → Segurança → Senhas de app.

#### Executar o backend

```bash
uvicorn app.main:app --reload --port 8000
```

API disponível em: `http://localhost:8000`  
Documentação (dev): `http://localhost:8000/api/docs`

---

### 3. Frontend

```bash
cd ../frontend

npm install
npm run dev
```

App disponível em: `http://localhost:5173`

---

## Scripts Disponíveis

### Backend

| Comando | Descrição |
|---------|-----------|
| `uvicorn app.main:app --reload` | Servidor de desenvolvimento |
| `pytest` | Executa os testes com cobertura |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite com HMR |
| `npm run build` | Build de produção |
| `npm run test` | Testes Vitest |
| `npm run test:coverage` | Cobertura de testes |

---

## Estrutura de Pastas (resumo)

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, segurança
│   │   ├── routers/     # Endpoints FastAPI
│   │   ├── schemas/     # Modelos Pydantic
│   │   └── services/    # Lógica de negócio
│   └── tests/
└── frontend/
    └── src/
        ├── components/
        │   ├── atoms/
        │   ├── molecules/
        │   └── organisms/
        ├── hooks/
        ├── services/
        ├── styles/
        └── types/
```

Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes completos.

---

## Links Úteis

- [LinkedIn](https://www.linkedin.com/in/alexandre-pedroza-mb/)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SECURITY.md](./SECURITY.md)
- [TESTING.md](./TESTING.md)
