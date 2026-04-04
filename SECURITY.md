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

Limites de comprimento enforçados:

| Campo | Limite |
|-------|--------|
| `name` | 120 caracteres |
| `subject` | 200 caracteres |
| `message` | 5.000 caracteres |

`EmailStr` do Pydantic valida formato de e-mail automaticamente.

### 2. Rate Limiting

Endpoint de contato limitado a **5 requisições por minuto por IP**:

```python
@router.post("/")
@limiter.limit(get_settings().rate_limit_contact)  # "5/minute"
async def send_contact(request: Request, payload: ContactRequest): ...
```

Implementado via [slowapi](https://github.com/laurents/slowapi).

### 3. CORS Configurado

Apenas origens explicitamente listadas são aceitas:

```python
CORSMiddleware(
    allow_origins=settings.origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
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

### 2. Validação de Nome em Tempo Real

O campo "Nome do Aventureiro" valida enquanto o usuário digita:

```typescript
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;

function validateName(value: string): string {
  if (!NAME_REGEX.test(value.trim()))
    return "Nome inválido: use apenas letras, sem números ou símbolos.";
  if (value.replace(/\s/g, "").length < 3)
    return "Nome deve ter no mínimo 3 letras.";
  return "";
}
```

- Permite letras (incluindo acentuadas: ã, é, ç, etc.) e espaços
- Bloqueia números, símbolos e caracteres especiais
- Mínimo de 3 letras
- Erro exibido inline com borda vermelha no input

### 3. Atributos de Segurança em Links Externos

```tsx
<a href={url} target="_blank" rel="noopener noreferrer">
```

`rel="noopener noreferrer"` previne `window.opener` exploitation em todos os links externos (LinkedIn, Google Drive, Formspree).

### 4. Sem `dangerouslySetInnerHTML`

Nenhum uso de `dangerouslySetInnerHTML` em todo o frontend.

### 5. TypeScript Strict

`tsconfig.json` com `"strict": true` previne classe de bugs de tipo em tempo de compilação.

---

## Próximos Passos (Produção com servidor)

- [ ] HTTPS / TLS (nginx, Caddy ou serviço de hospedagem)
- [ ] HSTS header (`Strict-Transport-Security`)
- [ ] Autenticação JWT se área administrativa for adicionada
- [ ] Substituir rate limiter por Redis para múltiplas instâncias
- [ ] Subresource Integrity (SRI) para assets externos
- [ ] Auditoria periódica de dependências (`pip-audit`, `npm audit`)
