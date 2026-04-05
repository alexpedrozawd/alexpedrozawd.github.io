# Arquitetura do Projeto

## Filosofia de Design

O projeto segue **Arquitetura em Camadas** no backend e **Atomic Design** no frontend, promovendo separação de responsabilidades, testabilidade e manutenibilidade.

---

## Backend — FastAPI

```
backend/
├── app/
│   ├── main.py                  # Factory de aplicação (create_app)
│   ├── core/
│   │   ├── config.py            # Settings via pydantic-settings (.env)
│   │   └── security.py          # Limiter, sanitização, middleware de headers
│   ├── routers/
│   │   ├── contact.py           # POST /api/v1/contact/ → 201 Created
│   │   └── projects.py          # GET /api/v1/projects/ e /{id} com cache
│   ├── schemas/
│   │   ├── base.py              # Link (HATEOAS) — href + method
│   │   ├── contact.py           # ContactRequest / ContactResponse
│   │   └── project.py           # Project / ProjectsResponse
│   └── services/
│       ├── contact_service.py   # Envio de e-mail via aiosmtplib
│       └── project_service.py   # Dados de projetos em memória com links HATEOAS
└── tests/
    ├── conftest.py
    ├── test_contact.py
    └── test_projects.py
```

### Fluxo de uma requisição

```
HTTP Request
  → FastAPI Router
    → Pydantic Schema (validação + sanitização)
      → Service (lógica de negócio)
        → Response Schema (inclui links HATEOAS)
HTTP Response (com Cache-Control, ETag, Vary)
```

### Decisões de design

| Decisão | Motivo |
|---------|--------|
| `create_app()` factory | Facilita testes sem dependência global de `app` |
| `lru_cache` em `get_settings()` | Settings lidos uma vez; injetável em testes |
| Pydantic `field_validator` | Sanitização e validação acopladas ao schema |
| `aiosmtplib` | Async nativo, sem bloquear o event loop |
| `slowapi` | Integração direta com FastAPI para rate limiting |
| `Link` em `base.py` | HATEOAS reutilizável em todos os schemas |
| ETag via MD5 | Cache condicional sem overhead de banco de dados |

### REST Compliance

O backend foi projetado para alto nível de conformidade REST:

| Critério | Status |
|---|---|
| URLs baseadas em recursos | ✅ `/projects/`, `/projects/{id}`, `/contact/` |
| Métodos HTTP semânticos | ✅ GET (leitura), POST (criação → 201) |
| Stateless | ✅ Sem sessões, cada request independente |
| Cacheabilidade | ✅ `Cache-Control: public, max-age=300`, `ETag`, `Vary: Accept` |
| HATEOAS | ✅ `links` em todas as respostas |
| CORS explícito | ✅ GET, POST, HEAD, OPTIONS |

> **Nota:** Em produção o frontend usa Formspree (site estático no GitHub Pages), portanto o backend FastAPI não é executado. A API é totalmente funcional para deploy futuro em servidor dedicado.

### Contratos de API

#### `GET /api/v1/projects/`

```json
{
  "projects": [
    {
      "id": 1,
      "title": "Projeto Alpha",
      "status": "coming_soon",
      "tags": [],
      "icon": "⚔️",
      "links": {
        "self":       { "href": "/api/v1/projects/1", "method": "GET" },
        "collection": { "href": "/api/v1/projects/",  "method": "GET" }
      }
    }
  ],
  "total": 3,
  "links": {
    "self": { "href": "/api/v1/projects/", "method": "GET" }
  }
}
```

Headers de resposta:
```
Cache-Control: public, max-age=300, stale-while-revalidate=60
ETag: "d41d8cd98f00b204e9800998ecf8427e"
Vary: Accept
```

#### `GET /api/v1/projects/{id}`

Mesma estrutura de um projeto individual. Retorna 404 se não encontrado.

#### `POST /api/v1/contact/` → `201 Created`

**Request:**
```json
{ "name": "...", "email": "...", "subject": "...", "message": "..." }
```

**Response:**
```json
{
  "success": true,
  "message": "Carta enviada com sucesso! Responderei em breve.",
  "links": {
    "self":     { "href": "/api/v1/contact/",  "method": "POST" },
    "projects": { "href": "/api/v1/projects/", "method": "GET"  }
  }
}
```

---

## Frontend — React / Vite

```
frontend/src/
├── components/
│   ├── atoms/
│   │   ├── icons/
│   │   │   ├── BackpackIcon.tsx     # SVG medieval backpack (tab Projetos)
│   │   │   └── VikingAxeIcon.tsx    # SVG viking axe (usado internamente)
│   │   ├── OrnamentDivider/         # Divisor decorativo com ornamento central
│   │   └── RPGProgressBar/          # Barra de progresso com props `thin` e `valueLabel`
│   ├── molecules/
│   │   ├── ProjectSlot/             # Card clicável de projeto no inventário
│   │   ├── QuestEntry/              # Entrada de quest no log
│   │   └── SkillBar/                # Barra fina com valor X/99 (valueLabel prop)
│   └── organisms/
│       ├── PauseMenu/               # Container principal — header "Histórico do Personagem"
│       ├── TabNavigation/           # Navegação entre 4 abas (Sobre/Projetos/Experiências/Contato)
│       ├── StatusTab/               # Avatar, bio, pergaminhos, habilidades em 2 colunas
│       ├── InventoryTab/            # Grid 40% + painel de detalhes 60%
│       ├── QuestLogTab/             # Histórico com filtros (label + botões)
│       └── SystemTab/               # Formulário de contato (aba Contato)
├── hooks/
│   ├── useTabNavigation.ts          # Estado da aba ativa
│   └── useContactForm.ts            # Estado, validação e envio via Formspree
├── styles/
│   ├── _variables.scss              # Design tokens (cores, tipografia, espaçamento)
│   ├── _mixins.scss                 # gold-glow, dark-scrollbar, hover-lift, parchment-text
│   └── global.scss                  # Reset, estilos base, p { text-align: justify }, keyframes
└── types/
    └── index.ts                     # TabId, Skill, Project (icon: ReactNode), Quest, etc.
```

### Atomic Design

| Nível    | Responsabilidade | Exemplos |
|----------|-----------------|----------|
| Atom     | Elemento visual primitivo, sem lógica de domínio | `RPGProgressBar`, `OrnamentDivider`, `BackpackIcon` |
| Molecule | Composição de átomos com contexto de domínio | `SkillBar`, `ProjectSlot`, `QuestEntry` |
| Organism | Seção completa da interface, pode ter estado local | `StatusTab`, `InventoryTab`, `QuestLogTab` |

### Aba Sobre (StatusTab) — Estrutura de layout

```
.container
  .heroRow (desktop = lado a lado / mobile ≤520px = coluna)
    .heroLeft  (avatar + identity: nome, classe, LVL 99)
    .heroRight (bio em itálico com aspas, entre borda dourada)
  OrnamentDivider
  .pergaminhoSection ("Pergaminhos do Herói" — 2 botões 📜 CV)
  OrnamentDivider ⚙
  .section (Habilidades — 2 colunas)
    esquerda: HTML, CSS, Bootstrap, React, TypeScript (todas 99/99)
    direita:  Python, FastAPI, Pytest, Pylance, SQL (todas 99/99)
  OrnamentDivider
```

> Mobile (≤520px): `.heroLeft` (avatar+nome) em cima, `.heroRight` (bio) abaixo separada por borda superior dourada. Skills colapsam para 1 coluna.

### Aba Projetos (InventoryTab) — Estrutura de layout

```
.container (flex-column)
  .gridTitle ("INVENTÁRIO" — centralizado, font 1.1rem)
  .row (flex)
    .grid (flex: 0 0 40%)
      .slots (grid: 2 colunas padrão / 3 em ≥1200px / 2 em ≤600px)
        ProjectSlot × N — primeiro item pré-selecionado dinamicamente
    .detail (flex: 1 — painel de detalhes 60%)
      texto centralizado (.detailDesc { text-align: center })
```

> Mobile (≤600px): empilha verticalmente (grid em cima, detalhe abaixo com borda superior).

### Aba Experiências (QuestLogTab) — Estrutura de layout

```
.filters (sticky, flex, flex-wrap)
  .filterLabel ("QUEST LOG:" — negrito, 1rem)
  .filterButtons (flex, flex-wrap)
    button × 3 (Todas / Principais / Secundárias — sem ícones)
.log
  section "📖 Quests Principais"  — ordem: mais recente → mais antigo
  OrnamentDivider ✦
  section "📖 Quests Secundárias" — ordem: mais recente → mais antigo
```

> Mobile (≤520px): label e botões empilham em linhas separadas.

### Aba Contato (SystemTab) — Formulário

- Label: `Nome do Aventureiro (Nome)`
- Select com `padding-right: 2.5rem` para afastar seta do dropdown
- Mensagem de sucesso: `inline-flex` (largura ajustada ao conteúdo) — "Carta enviada com sucesso! Responderei em breve."

### Tipo `Project.icon` — ReactNode

O campo `icon` em `Project` aceita `ReactNode` (não apenas `string`), permitindo SVGs customizados:

```typescript
// types/index.ts
import type { ReactNode } from "react";
export interface Project {
  icon: ReactNode; // string emoji ou componente SVG
}
```

### Hook `useContactForm` — Validação em tempo real

```typescript
// Validação do nome: só letras (incluindo acentuadas) e espaços, mínimo 3 letras
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;

function validateName(value: string): string {
  if (!NAME_REGEX.test(value.trim())) return "Nome inválido: use apenas letras...";
  if (value.replace(/\s/g, "").length < 3) return "Nome deve ter no mínimo 3 letras.";
  return "";
}
```

- Erro exibido inline abaixo do campo enquanto o usuário digita
- Input com borda vermelha quando inválido (`inputError`)
- `validate()` também bloqueia o envio no submit

### CSS Architecture

- **CSS Modules** por componente → escopo local, sem colisão de nomes
- **SCSS** com `@use` (não `@import`) — cada módulo importa explicitamente variáveis e mixins
- `global.scss` define `p { text-align: justify }` globalmente; exceções sobrescrevem via CSS Modules
- Breakpoints principais: `520px` (mobile Sobre/Experiências), `600px` (mobile Projetos), `480px` (TabNavigation labels)

### Gerenciamento de Estado

| Estado | Localização |
|--------|-------------|
| Aba ativa | `useTabNavigation` (hook, elevado ao `App`) |
| Form de contato + erros | `useContactForm` (hook, estado local) |
| Projeto selecionado | `InventoryTab` — inicializa com `PROJECTS[0].id` (dinâmico) |
| Dados de projetos/quests/skills | Constantes em cada organism (sem API no frontend) |

---

## SEO e Compartilhamento (Open Graph)

O `index.html` contém meta tags para preview de link em redes sociais:

```html
<!-- Favicon -->
<link rel="icon" href="data:image/svg+xml,...⚔️..." />

<!-- Open Graph (WhatsApp, Facebook, LinkedIn, Discord) -->
<meta property="og:type"        content="website" />
<meta property="og:url"         content="https://alexpedrozawd.github.io/" />
<meta property="og:title"       content="Alexandre Pedroza · Desenvolvedor Fullstack" />
<meta property="og:description" content="Portfólio interativo com tema de RPG medieval..." />
<meta property="og:image"       content="https://alexpedrozawd.github.io/og-image.jpg" />

<!-- Twitter / X Card -->
<meta name="twitter:card"  content="summary" />
<meta name="twitter:image" content="https://alexpedrozawd.github.io/og-image.jpg" />
```

A imagem `frontend/public/og-image.jpg` é um screenshot do site e é servida em
`https://alexpedrozawd.github.io/og-image.jpg` pelo GitHub Pages.

---

## Deploy — GitHub Actions

```yaml
# .github/workflows/deploy.yml (resumo)
- actions/checkout@v6       # Node 24 nativo
- actions/setup-node@v6     # Node 24 nativo
- node-version: 24
- env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true  # necessário para upload-pages-artifact@v3
- run: npm ci && vite build   # (não tsc && vite build — evita false positives)
- VITE_FORMSPREE_URL injetado via GitHub Secret
- actions/deploy-pages@v5   # Node 24 nativo
```

O build de produção **não inclui o backend** — apenas os arquivos estáticos do Vite são deployados.
