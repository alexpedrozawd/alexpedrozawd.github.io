# Arquitetura do Projeto

## Filosofia de Design

O projeto segue **Arquitetura em Camadas** no backend e **Atomic Design** no frontend, promovendo separação de responsabilidades, testabilidade e manutenibilidade.

---

## Backend — FastAPI

```
backend/
├── app/
│   ├── main.py              # Factory de aplicação (create_app)
│   ├── core/
│   │   ├── config.py        # Settings via pydantic-settings (.env)
│   │   └── security.py      # Limiter, sanitização, middleware de headers
│   ├── routers/
│   │   ├── contact.py       # POST /api/v1/contact/
│   │   └── projects.py      # GET  /api/v1/projects/ e /{id}
│   ├── schemas/
│   │   ├── contact.py       # ContactRequest / ContactResponse (Pydantic)
│   │   └── project.py       # Project / ProjectsResponse (Pydantic)
│   └── services/
│       ├── contact_service.py   # Envio de e-mail via aiosmtplib
│       └── project_service.py   # Dados de projetos (em memória)
└── tests/
    ├── conftest.py          # TestClient fixture
    ├── test_contact.py
    └── test_projects.py
```

### Fluxo de uma requisição

```
HTTP Request
  → FastAPI Router
    → Pydantic Schema (validação + sanitização)
      → Service (lógica de negócio)
        → Response Schema
HTTP Response
```

### Decisões de design

| Decisão | Motivo |
|---------|--------|
| `create_app()` factory | Facilita testes sem dependência global de `app` |
| `lru_cache` em `get_settings()` | Settings lidos uma vez; injetável em testes |
| Pydantic `field_validator` | Sanitização e validação acopladas ao schema |
| `aiosmtplib` | Async nativo, sem bloquear o event loop |
| `slowapi` | Integração direta com FastAPI para rate limiting |

---

## Frontend — React / Vite

```
frontend/src/
├── components/
│   ├── atoms/               # Componentes primitivos, sem lógica de domínio
│   │   ├── RPGProgressBar/
│   │   └── OrnamentDivider/
│   ├── molecules/           # Composição de átomos com contexto de domínio
│   │   ├── SkillBar/
│   │   ├── ProjectSlot/
│   │   └── QuestEntry/
│   └── organisms/           # Seções completas da UI, podem ter estado próprio
│       ├── PauseMenu/       # Container principal (overlay + window)
│       ├── TabNavigation/
│       ├── StatusTab/
│       ├── InventoryTab/
│       ├── QuestLogTab/
│       └── SystemTab/
├── hooks/
│   ├── useTabNavigation.ts  # Estado da aba ativa
│   └── useContactForm.ts    # Estado + lógica do formulário de contato
├── services/
│   └── api.ts               # Camada de acesso à API (fetch wrapper)
├── styles/
│   ├── _variables.scss      # Design tokens (cores, tipografia, espaçamento)
│   ├── _mixins.scss         # Mixins reutilizáveis
│   └── global.scss          # Reset, estilos base, keyframes compartilhados
└── types/
    └── index.ts             # Tipos TypeScript centralizados
```

### Atomic Design

| Nível    | Responsabilidade | Exemplos |
|----------|-----------------|----------|
| Atom     | Renderiza um único elemento visual primitivo | `RPGProgressBar`, `OrnamentDivider` |
| Molecule | Combina átomos para representar um conceito de domínio | `SkillBar`, `ProjectSlot` |
| Organism | Seção completa da interface; pode ter estado local | `StatusTab`, `InventoryTab` |

### CSS Architecture

- **CSS Modules** por componente → sem colisão de nomes, escopo local
- **SCSS** com `_variables.scss` e `_mixins.scss` como design system
- `additionalData` no Vite injeta as variáveis/mixins em todos os módulos
- Convenção BEM não é necessária com CSS Modules

### Gerenciamento de Estado

Estado é colocado no menor escopo possível:

| Estado | Localização |
|--------|-------------|
| Aba ativa | `useTabNavigation` (hook, estado local) |
| Form de contato | `useContactForm` (hook, estado local) |
| Projeto selecionado | `InventoryTab` (estado local do componente) |
| Dados de projetos | Constante no `InventoryTab` (sem API no MVP) |

---

## Contratos de API

### `GET /api/v1/projects/`
```json
{ "projects": [...], "total": 3 }
```

### `GET /api/v1/projects/{id}`
```json
{ "id": 1, "title": "...", "status": "coming_soon", "tags": [], "icon": "⚔️" }
```

### `POST /api/v1/contact/`
**Request:**
```json
{ "name": "...", "email": "...", "subject": "...", "message": "..." }
```
**Response:**
```json
{ "success": true, "message": "Mensagem enviada com sucesso!" }
```
