# Guia de Testes

## Backend — Pytest

### Executar todos os testes

```bash
cd backend
source .venv/bin/activate
pytest
```

### Executar com relatório de cobertura HTML

```bash
pytest --cov=app --cov-report=html:htmlcov
# Abra: backend/htmlcov/index.html
```

### Executar testes específicos

```bash
pytest tests/test_contact.py -v
pytest tests/test_projects.py -v
```

### Suíte de Testes

#### `tests/test_projects.py`

| Teste | Descrição |
|-------|-----------|
| `test_list_projects_returns_200` | GET /projects/ retorna HTTP 200 |
| `test_list_projects_schema` | Resposta contém `projects`, `total` e `links` |
| `test_list_projects_has_three_items` | Exatamente 3 projetos |
| `test_get_project_by_valid_id` | GET /projects/1 retorna projeto correto com `links` |
| `test_get_project_by_invalid_id_returns_404` | ID inexistente retorna 404 |
| `test_project_status_is_coming_soon` | Todos os projetos têm status `coming_soon` |
| `test_health_endpoint` | GET /health retorna `{"status": "ok"}` |
| `test_list_projects_cache_headers` | Resposta contém `Cache-Control` e `ETag` |

#### `tests/test_contact.py`

| Teste | Descrição |
|-------|-----------|
| `test_contact_returns_201_when_email_succeeds` | Envio bem-sucedido retorna **201 Created** |
| `test_contact_returns_500_when_email_fails` | Falha no SMTP retorna 500 |
| `test_contact_response_has_links` | Resposta inclui `links` HATEOAS |
| `test_contact_rejects_missing_name` | Nome vazio retorna 422 |
| `test_contact_rejects_invalid_email` | E-mail inválido retorna 422 |
| `test_contact_rejects_script_injection_in_name` | XSS no nome retorna 422 |
| `test_contact_rejects_overly_long_message` | Mensagem >5000 chars retorna 422 |

> **Atenção:** O endpoint de contato agora retorna `201 Created` (não `200 OK`). Testes legados que checavam `== 200` precisam ser atualizados para `== 201`.

### Mocking

O serviço de e-mail é mockado com `unittest.mock.AsyncMock`:

```python
with patch(
    "app.services.contact_service.send_contact_email",
    new_callable=AsyncMock,
) as mock_send:
    mock_send.return_value = None
    response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)
    assert response.status_code == 201
```

---

## Frontend — Vitest

### Executar todos os testes

```bash
cd frontend
npm run test
```

### Executar com cobertura

```bash
npm run test:coverage
# Relatório em: frontend/coverage/index.html
```

### Executar em modo watch

```bash
npm run test:watch
```

### Suíte de Testes

#### `StatusTab.test.tsx`

| Teste | Descrição |
|-------|-----------|
| renders developer name | "Alexandre Pedroza" visível |
| renders level 99 badge | Badge LVL 99 presente |
| renders all six skill bars | 6 skills renderizadas (Bootstrap, React, TypeScript, Python, FastAPI, ClaudeCode) |
| renders avatar image | `<img>` com alt "Alexandre Pedroza" |
| renders developer role | "Desenvolvedor Fullstack" visível |
| renders cv buttons | Botões "Curriculum LinkedIn" e "Curriculum Vitae" presentes |
| renders pergaminho section | Seção "Pergaminho do Herói" visível |

#### `InventoryTab.test.tsx`

| Teste | Descrição |
|-------|-----------|
| renders four project slots | 4 slots (Alpha, Beta, Gamma, Delta) |
| renders project titles | Títulos visíveis |
| shows detail panel on click | Painel de detalhes aparece ao clicar |
| deselects slot on second click | `aria-pressed` volta a `false` |
| renders hint text | "Selecione um item para ver detalhes" visível |

#### `useContactForm.test.ts`

| Teste | Descrição |
|-------|-----------|
| initialises with empty fields | Estado inicial correto |
| updates form field | `handleChange` atualiza estado |
| strips dangerous characters | Sanitização funciona |
| sets error on empty name | Validação de campo vazio |
| sets nameError on invalid characters | Números/símbolos no nome geram `nameError` |
| sets nameError on short name | Nome com < 3 letras gera `nameError` |
| clears nameError on valid name | Nome válido limpa o erro |
| calls formspree and sets success | Submissão bem-sucedida via Formspree |
| sets error on api failure | Erro de rede capturado |

---

## Cobertura Esperada

| Módulo | Cobertura estimada |
|--------|--------------------|
| `app/routers/` | ~95% |
| `app/schemas/` | ~90% |
| `app/services/project_service.py` | ~100% |
| `app/core/security.py` | ~85% |
| Frontend hooks (`useContactForm`) | ~90% |
| Frontend organisms (Status, Inventory) | ~80% |
