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
  "message": "Mensagem enviada com sucesso! Responderei em breve.",
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
│   │   │   ├── BackpackIcon.tsx     # SVG medieval backpack (tab Inventário)
│   │   │   └── VikingAxeIcon.tsx    # SVG viking axe (usado internamente)
│   │   ├── OrnamentDivider/         # Divisor decorativo com ornamento central
│   │   └── RPGProgressBar/          # Barra de progresso com props `thin` e `valueLabel`
│   ├── molecules/
│   │   ├── ProjectSlot/             # Card clicável de projeto no inventário
│   │   ├── QuestEntry/              # Entrada de quest no log
│   │   └── SkillBar/                # Barra fina com valor X/99 (valueLabel prop)
│   └── organisms/
│       ├── PauseMenu/               # Container principal (overlay + window 96vh)
│       ├── TabNavigation/           # Navegação entre 4 abas
│       ├── StatusTab/               # Avatar, atributos, pergaminho, habilidades, lore
│       ├── InventoryTab/            # Grid de projetos + painel de detalhes
│       ├── QuestLogTab/             # Histórico com filtros (Todas/Principais/Secundárias)
│       └── SystemTab/               # Formulário de contato ("Cartas")
├── hooks/
│   ├── useTabNavigation.ts          # Estado da aba ativa
│   └── useContactForm.ts            # Estado, validação e envio via Formspree
├── styles/
│   ├── _variables.scss              # Design tokens (cores, tipografia, espaçamento)
│   ├── _mixins.scss                 # gold-glow, dark-scrollbar, hover-lift, parchment-text
│   └── global.scss                  # Reset, estilos base, keyframes (fadeInUp, pulse-glow)
└── types/
    └── index.ts                     # TabId, Skill, Project (icon: ReactNode), Quest, etc.
```

### Atomic Design

| Nível    | Responsabilidade | Exemplos |
|----------|-----------------|----------|
| Atom     | Elemento visual primitivo, sem lógica de domínio | `RPGProgressBar`, `OrnamentDivider`, `BackpackIcon` |
| Molecule | Composição de átomos com contexto de domínio | `SkillBar`, `ProjectSlot`, `QuestEntry` |
| Organism | Seção completa da interface, pode ter estado local | `StatusTab`, `InventoryTab`, `QuestLogTab` |

### Aba Status — Estrutura de layout

```
.container
  .heroRow (flex: desktop = lado a lado / mobile ≤520px = coluna)
    .heroLeft
      .hero (avatar + identity)
        avatarWrapper (img + glow animado)
        identity (name, class, levelBadge)
    .heroRight
      .section (Atributos — HP/MP/XP com RPGProgressBar thin)
  OrnamentDivider
  .pergaminhoSection (Pergaminho do Herói — 2 botões de CV)
  OrnamentDivider ⚙
  .section (Habilidades — 5 SkillBars com valor X/99)
  OrnamentDivider
  .lore (frase sobre mim)
```

### Aba Inventário — Estrutura de layout

```
.container (flex-column, min-height: 100%)
  .row (flex)
    .grid (280px / 180px em mobile)
      gridTitle
      .slots (grid: 3 colunas desktop / 2 colunas ≤1024px)
        ProjectSlot × 4 (Alpha, Beta, Gamma, Delta)
    .detail (painel de detalhes, flex: 1)
  .hint (margin-top: auto — fica ao fundo)
```

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
- `additionalData` no Vite injeta `@use` globalmente apenas para `global.scss`
- Breakpoints principais: `520px` (mobile Status), `1024px` (grid Inventário), `480px` (TabNavigation labels)

### Gerenciamento de Estado

| Estado | Localização |
|--------|-------------|
| Aba ativa | `useTabNavigation` (hook, elevado ao `App`) |
| Form de contato + erros | `useContactForm` (hook, estado local) |
| Projeto selecionado | `InventoryTab` (estado local do componente) |
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
- node-version: 24
- env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
- run: npm ci && vite build   # (não tsc && vite build — evita false positives)
- VITE_FORMSPREE_URL injetado via GitHub Secret
- Deploy: actions/deploy-pages
```

O build de produção **não inclui o backend** — apenas os arquivos estáticos do Vite são deployados.
