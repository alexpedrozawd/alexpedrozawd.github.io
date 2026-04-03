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
| `test_list_projects_schema` | Resposta contém `projects` e `total` |
| `test_list_projects_has_three_items` | Exatamente 3 projetos |
| `test_get_project_by_valid_id` | GET /projects/1 retorna projeto correto |
| `test_get_project_by_invalid_id_returns_404` | ID inexistente retorna 404 |
| `test_project_status_is_coming_soon` | Todos os projetos têm status `coming_soon` |
| `test_health_endpoint` | GET /health retorna `{"status": "ok"}` |

#### `tests/test_contact.py`

| Teste | Descrição |
|-------|-----------|
| `test_contact_returns_200_when_email_succeeds` | Envio bem-sucedido retorna 200 |
| `test_contact_returns_500_when_email_fails` | Falha no SMTP retorna 500 |
| `test_contact_rejects_missing_name` | Nome vazio retorna 422 |
| `test_contact_rejects_invalid_email` | E-mail inválido retorna 422 |
| `test_contact_rejects_script_injection_in_name` | XSS no nome retorna 422 |
| `test_contact_rejects_overly_long_message` | Mensagem >5000 chars retorna 422 |

### Mocking

O serviço de e-mail é mockado com `unittest.mock.AsyncMock` para que os testes não dependam de um servidor SMTP real:

```python
with patch(
    "app.services.contact_service.send_contact_email",
    new_callable=AsyncMock,
) as mock_send:
    mock_send.return_value = None
    response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)
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
| renders developer name | Nome "Alexandre Pedroza" visível |
| renders level 99 badge | Badge de nível presente |
| renders all six skill bars | 6 skills renderizadas |
| renders avatar image | `<img>` com alt correto |
| renders developer role | Texto de cargo visível |

#### `InventoryTab.test.tsx`

| Teste | Descrição |
|-------|-----------|
| renders three project slots | 3 slots presentes |
| renders project titles | Títulos Alpha/Beta/Gamma visíveis |
| shows detail panel on click | Painel de detalhes aparece ao clicar |
| deselects slot on second click | `aria-pressed` volta a `false` |

#### `useContactForm.test.ts`

| Teste | Descrição |
|-------|-----------|
| initialises with empty fields | Estado inicial correto |
| updates form field | `handleChange` atualiza estado |
| strips dangerous characters | Sanitização funciona |
| sets error on empty name | Validação de campo vazio |
| calls api and sets success | Submissão bem-sucedida |
| sets error on api failure | Erro de rede capturado |

---

## Cobertura Esperada

| Módulo | Cobertura estimada |
|--------|--------------------|
| `app/routers/` | ~95% |
| `app/schemas/` | ~90% |
| `app/services/project_service.py` | ~100% |
| `app/core/security.py` | ~85% |
| Frontend hooks | ~90% |
| Frontend organisms (Status, Inventory) | ~80% |
