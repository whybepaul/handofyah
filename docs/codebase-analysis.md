# Codebase Analysis: Factory Template Patterns for Hand of Yah

**Prepared:** 2026-03-27
**Scope:** Factory template + SecureClear project as the canonical standalone project pattern

---

## Entry Points

- `projects/secureclear/` — the only fully-built standalone project in the factory; all patterns derived from it
- `.claude/` — factory agent/command/template infrastructure
- `projects/handofya/` — target project location (docs and specs already created)

---

## 1. Existing Project Patterns (SecureClear Directory Layout)

SecureClear (`projects/secureclear/`) is the reference:

```
projects/secureclear/
├── api/                        # FastAPI backend (deploys to Render)
│   ├── app/
│   │   ├── main.py             # FastAPI app entrypoint
│   │   ├── models.py           # Pydantic validation models
│   │   ├── database.py         # Supabase client (public API)
│   │   ├── rate_limit.py       # IP-based rate limiting
│   │   ├── scan_routes.py      # Route handlers
│   │   ├── email_service.py    # Transactional email
│   │   ├── validation.py       # Shared validators
│   │   └── portal/             # Sub-module for broker portal
│   ├── security_scanner/       # Core engine (domain-specific)
│   ├── tests/                  # pytest test suite
│   │   └── conftest.py         # Shared fixtures (autouse patching)
│   ├── requirements.txt
│   └── Dockerfile
├── web/                        # Next.js 14 frontend (deploys to Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout (metadata, header, footer)
│   │   │   ├── page.tsx        # Home page ('use client')
│   │   │   ├── globals.css     # Tailwind directives + global component classes
│   │   │   ├── (auth)/         # Auth route group
│   │   │   ├── (portal)/       # Portal route group (authenticated)
│   │   │   └── scan/[id]/      # Dynamic scan results page
│   │   ├── components/         # React components
│   │   └── lib/
│   │       ├── api.ts          # API client (fetch wrappers)
│   │       ├── supabase.ts     # Supabase singleton
│   │       └── types.ts        # TypeScript interfaces
│   ├── tests/                  # Playwright E2E tests
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── playwright.config.ts
└── docs/                       # Project documentation
    ├── prd.md
    ├── architecture.md
    ├── design/
    │   ├── design-tokens.md
    │   └── philosophy.md
    ├── features/
    │   ├── manifest.json
    │   └── {feature-slug}/
    ├── specs/
    │   └── {date-slug}/
    └── sessions/
```

---

## 2. Frontend Patterns (Next.js / React)

- **Framework:** Next.js 14 with App Router
- **Pages:** Default to Server Components; interactive pages add `'use client'`
- **Route groups:** `(auth)/` and `(portal)/` scope layouts without affecting URLs
- **Dynamic routes:** `src/app/scan/[id]/page.tsx` pattern
- **Styling:** Tailwind CSS 3 with custom theme extensions in `tailwind.config.js`
- **Global component classes:** `.btn-primary`, `.card`, `.input-field` defined in `globals.css` under `@layer components`
- **Fonts:** Google Fonts loaded via `@import` in `globals.css`
- **Components:** Hand-built using Tailwind (no shadcn/ui or Radix)
- **Icons:** Inline SVG functional components (no icon library)
- **No shared factory-level components** — each project builds its own

---

## 3. Sanity CMS Patterns

**No Sanity code exists anywhere in the factory.** No schemas, config, or studio setup. Must be built from scratch.

---

## 4. Stripe Integration Patterns

From SecureClear (`api/app/portal/billing.py`):
- Python `stripe` library (`stripe>=8.0.0`)
- Hosted checkout: backend creates Checkout Session, returns `checkout_url`, frontend redirects
- Webhook verification: `stripe.Webhook.construct_event()` with `STRIPE_WEBHOOK_SECRET`
- All Stripe calls from API layer, never from frontend

**For handofya:** Need Stripe Elements (embedded checkout) + Stripe Billing for subscriptions — SecureClear only uses Checkout Sessions.

---

## 5. Supabase Patterns

- **Singleton client** (`supabase.ts`): `createClient()` cached in module variable, exported as `getSupabaseClient()`
- **Magic link auth**: `signInWithOtp()` → `onAuthStateChange` → `/auth/callback` → sessionStorage → redirect
- **sessionStorage caching**: Portal layout reads profile from sessionStorage to avoid flash-of-loading-state
- **API uses direct httpx**: Python API calls Supabase REST API directly, not the Python SDK

---

## 6. Testing Conventions

- **Python API:** pytest + pytest-asyncio, `api/tests/` directory, autouse fixture mocking all DB calls
- **Frontend:** Playwright E2E only (no Jest/Vitest), `web/tests/` directory, API mocking via `page.route()`

---

## 7. Deployment / Infrastructure

- **Frontend:** Vercel (`.vercel/project.json` for linkage)
- **Backend:** Render via Docker (`python:3.11-slim`, uvicorn)
- **Database:** Supabase (schema managed via dashboard, not migration files)
- **Env vars:** `.env.local` for frontend (not committed), Render dashboard for API

---

## 8. Reusable Patterns

| Pattern | Source | Reuse for Handofya |
|---|---|---|
| Supabase singleton | `web/src/lib/supabase.ts` | Copy verbatim |
| Auth callback | `web/src/app/(auth)/auth/callback/` | Adapt for customer login |
| Route groups | `(auth)/`, `(portal)/` | Use `(account)/`, `(checkout)/` |
| Tailwind brand tokens | `tailwind.config.js` | Register handofya colors/fonts |
| Global component classes | `globals.css` | Define `.btn-primary`, `.product-card`, etc. |
| API client module | `web/src/lib/api.ts` | Centralized fetch with typed returns |
| Stripe webhooks | `api/app/portal/billing.py` | Adapt for subscriptions + orders |
| Autouse test fixture | `api/tests/conftest.py` | Mock all external calls in tests |

---

## 9. What Does Not Exist (Build from Scratch)

| Need | Status | Notes |
|---|---|---|
| Sanity CMS | Not in factory | No schemas, config, or studio |
| Stripe Elements / React Stripe.js | Not in factory | SecureClear uses server-side only |
| Product catalog types | Not in factory | No e-commerce data models |
| CMS content fetching (GROQ) | Not in factory | No Sanity client patterns |
| Subscription billing lifecycle | Partial | SecureClear has checkout sessions, not full subscription management |
| Customer accounts (orders, wishlists) | Not in factory | Only broker auth exists |
| Listmonk email | Not in factory | New integration |
| Image optimization for e-commerce | Not in factory | Need `next/image` + Sanity image pipeline |

---

## 10. Recommendations

1. Follow SecureClear directory layout: `web/`, `api/`, `studio/`, `docs/`
2. Copy Supabase singleton pattern verbatim
3. Copy auth callback pattern for customer accounts
4. Use `tailwind.config.js` for brand tokens — no CSS variables
5. Define global component classes in `globals.css` under `@layer components`
6. Model Stripe backend after `billing.py` for webhooks; add `@stripe/stripe-js` and `@stripe/react-stripe-js` for frontend
7. Initialize Sanity studio in `projects/handofya/studio/`
8. Add `.gitignore` as first act (SecureClear accidentally committed `node_modules/`)
