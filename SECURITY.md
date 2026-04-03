# Práticas de Segurança

## Backend

### 1. Validação e Sanitização de Entradas (Pydantic)

Toda entrada de usuário passa pelo schema Pydantic antes de qualquer lógica:

```python
# schemas/contact.py
@field_validator("name", "subject", "message")
@classmethod
def strip_dangerous_chars(cls, value: str) -> str:
    cleaned = sanitize_text(value)  # remove < > " ' ` ; \
    if not cleaned:
        raise ValueError("Field must not be empty after sanitization.")
    return cleaned
```

- Caracteres perigosos `< > " ' ` ; \` são removidos via regex
- Comprimentos máximos enforçados (nome: 120, assunto: 200, mensagem: 5000)
- `EmailStr` do Pydantic valida formato de e-mail

### 2. Rate Limiting

Endpoint de contato limitado a **5 requisições por minuto por IP**:

```python
@router.post("/")
@limiter.limit(get_settings().rate_limit_contact)  # "5/minute"
async def send_contact(request: Request, payload: ContactRequest): ...
```

Implementado via [slowapi](https://github.com/laurents/slowapi) + Redis-ready.

### 3. CORS Configurado

Apenas origens explicitamente listadas são aceitas:

```python
CORSMiddleware(
    allow_origins=settings.origins_list,  # ["http://localhost:5173"]
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)
```

### 4. Security Headers

`SecurityHeadersMiddleware` adiciona em todas as respostas:

| Header | Valor | Proteção |
|--------|-------|----------|
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS legado |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vazamento de URL |
| `Content-Security-Policy` | restrito | XSS / injeção de conteúdo |

### 5. Credenciais via Variáveis de Ambiente

Nenhuma credencial está no código-fonte. O arquivo `.env` está no `.gitignore`.  
`pydantic-settings` lê de `.env` ou variáveis de ambiente do sistema.

### 6. Documentação da API Desabilitada em Produção

```python
docs_url="/api/docs" if settings.app_debug else None,
redoc_url="/api/redoc" if settings.app_debug else None,
```

---

## Frontend

### 1. Sanitização no Cliente

`useContactForm` sanitiza cada campo antes de qualquer estado ou envio:

```typescript
function sanitizeField(value: string): string {
  return value.replace(/[<>"'`;\\]/g, "").trimStart();
}
```

Isso é **defesa em profundidade** — o backend sanitiza independentemente.

### 2. Atributos de Segurança em Links Externos

```tsx
<a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
```

`rel="noopener noreferrer"` previne `window.opener` exploitation.

### 3. Sem Dangerously SetInnerHTML

Nenhum uso de `dangerouslySetInnerHTML` em todo o frontend.

### 4. TypeScript Strict

`tsconfig.json` com `"strict": true` previne classe de bugs de tipo em tempo de compilação.

---

## Próximos Passos (Produção)

- [ ] Adicionar HTTPS / TLS (nginx, Caddy ou serviço de hospedagem)
- [ ] HSTS header
- [ ] Autenticação JWT se área administrativa for adicionada
- [ ] Substituir rate limiter por Redis para múltiplas instâncias
- [ ] Subresource Integrity (SRI) para assets externos
- [ ] Auditoria de dependências (`pip-audit`, `npm audit`)
