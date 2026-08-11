
# Implementation Inventory — TravelMate AI

> Generated: 2026-07-19

---

## 1. API Endpoints — Backend (Django)

| # | Method | Path | View | Purpose |
|---|--------|------|------|---------|
| 1 | GET/POST/PUT/etc | `/admin/` | `admin.site.urls` | Django admin panel |
| 2 | POST | `/api/auth/register/` | `Auth.views.register` | Creates `AuthUser`, returns Bearer token |
| 3 | POST | `/api/auth/login/` | `Auth.views.login` | Validates email+password, returns Bearer token |
| 4 | GET | `/api/auth/verify/` | `Auth.views.verify_token` | Returns `{valid: true, email}` or 401 |
| 5 | GET | `/api/chat/history/` | `ChatBot.views.chat_history` | Lists user's chats (paginated: `limit`, `starting_after`, `ending_before`) |
| 6 | POST | `/api/chat/create/` | `ChatBot.views.chat_create` | Creates new `Chat` for authenticated user |
| 7 | GET/DELETE | `/api/chat/<uuid:chat_id>/` | `ChatBot.views.chat_detail` | GET returns chat + messages; DELETE removes chat |

**Not wired to URLs (called only via MCP layer):**
- `Flight.views.get_lowest_rates` — Amadeus flight search
- `Restaurant.views.fetchHotels` — Amadeus hotel search

## 1b. API Endpoints — Frontend (Next.js API routes)

| # | Method | Path | Purpose |
|---|--------|------|---------|
| 1 | POST | `/api/django-logout` | Clears `django-session` cookie |
| 2 | GET | `/api/vote?chatId=` | Returns all votes for a chat (auth + ownership) |
| 3 | PATCH | `/api/vote` | Upvote/downvote a message |
| 4 | GET | `/api/document?id=` | Returns document versions by ID |
| 5 | POST | `/api/document?id=` | Creates/saves new document version |
| 6 | DELETE | `/api/document?id=&timestamp=` | Deletes document versions after timestamp |
| 7 | GET | `/api/suggestions?documentId=` | Returns suggestions for a document |
| 8 | GET | `/api/chat/[id]/stream` | SSE stream for resumable chat responses |
| 9 | POST | `/api/chat` | Creates/continues chat, streams AI (xAI Grok) |
| 10 | DELETE | `/api/chat?id=` | Deletes chat + votes + messages + streams |
| 11 | GET | `/api/history` | Proxies chat history from Django backend |
| 12 | POST | `/api/files/upload` | Uploads images (JPEG/PNG, max 5MB) to Vercel Blob |

---

## 2. Database Models

### Backend — Django (PostgreSQL)

**AuthUser** (`Auth/models.py`)
| Field | Type | Details |
|-------|------|---------|
| `id` | BigAutoField | PK |
| `email` | EmailField | `unique=True` |
| `password_hash` | CharField(128) | Stored as `salt$sha256_hex` |
| `created_at` | DateTimeField | `auto_now_add=True` |

**AuthToken** (`Auth/models.py`)
| Field | Type | Details |
|-------|------|---------|
| `id` | BigAutoField | PK |
| `user` | ForeignKey | → `AuthUser`, `CASCADE`, `related_name='tokens'` |
| `token` | CharField(64) | `unique=True`, `secrets.token_hex(32)` |
| `created_at` | DateTimeField | `auto_now_add=True` |

**Chat** (`ChatBot/models.py`)
| Field | Type | Details |
|-------|------|---------|
| `id` | UUIDField | PK, `default=uuid.uuid4` |
| `user` | ForeignKey | → `AuthUser`, `CASCADE`, `related_name='chats'` |
| `title` | TextField | |
| `created_at` | DateTimeField | `auto_now_add=True` |
| `visibility` | CharField(10) | `public` / `private` (default `private`) |
| **Meta** | ordering | `['-created_at']` |

**Message** (`ChatBot/models.py`)
| Field | Type | Details |
|-------|------|---------|
| `id` | UUIDField | PK, `default=uuid.uuid4` |
| `chat` | ForeignKey | → `Chat`, `CASCADE`, `related_name='messages'` |
| `role` | CharField(20) | `user` / `assistant` / `system` |
| `content` | JSONField | Message payload |
| `created_at` | DateTimeField | `auto_now_add=True` |
| **Meta** | ordering | `['created_at']` |

### Frontend — Drizzle/PostgreSQL (local DB)

**User**
| Field | Type |
|-------|------|
| `id` | uuid PK |
| `email` | varchar(64) |
| `password` | varchar(64) |

**Chat**
| Field | Type |
|-------|------|
| `id` | uuid PK |
| `createdAt` | timestamp |
| `title` | text |
| `userId` | FK → User |
| `visibility` | public/private |

**Message_v2**
| Field | Type |
|-------|------|
| `id` | uuid PK |
| `chatId` | FK → Chat |
| `role` | varchar |
| `parts` | json |
| `attachments` | json |
| `createdAt` | timestamp |

**Vote_v2**
| Field | Type |
|-------|------|
| `chatId` | FK → Chat (composite PK) |
| `messageId` | FK → Message_v2 (composite PK) |
| `isUpvoted` | boolean |

**Document**
| Field | Type |
|-------|------|
| `id` | uuid (composite PK) |
| `createdAt` | timestamp (composite PK) |
| `title` | text |
| `content` | text |
| `kind` | text/code/image/sheet |
| `userId` | FK → User |

**Suggestion**
| Field | Type |
|-------|------|
| `id` | uuid PK |
| `documentId` | FK → Document |
| `documentCreatedAt` | timestamp |
| `originalText` | text |
| `suggestedText` | text |
| `description` | text |
| `isResolved` | boolean |
| `userId` | FK → User |
| `createdAt` | timestamp |

**Stream**
| Field | Type |
|-------|------|
| `id` | uuid PK |
| `chatId` | FK → Chat |
| `createdAt` | timestamp |

**Legacy tables (deprecated, still in schema):** `Message`, `Vote`

---

## 3. MCP Tools / Agent Functions

**Server:** `mcp_travelmate/server.py` — SSE transport on port 8001

| Tool Name | Delegates To | Purpose |
|-----------|-------------|---------|
| `get_Flights` | `FlightAgent` → `Flight.views.get_lowest_rates` | Search flights between cities with dates/budget |
| `get_hotels` | `HotelAgent` → `Restaurant.views.fetchHotels` | Search hotels in a city with dates/budget |
| `get_weather` | `WeatherAgent` → Open-Meteo API | Get weather forecast for a city |
| `get_locations` | `LocationAgent` → Nominatim OSM | Search places/attractions worldwide |
| `get_currency` | `CurrencyAgent` → Frankfurter API | Convert amount between currencies |

**Orchestrator** (`mcp_travelmate/agents/orchestrator.py`) — `TravelMateOrchestrator` maps action names to agents, parses LLM JSON tool-call output.

**All agents** extend `BaseAgent` (`mcp_travelmate/agents/base.py`).

---

## 4. Auth / Session Code

### Backend
| File | What it does |
|------|-------------|
| `Auth/models.py` | `AuthUser` + `AuthToken` models (custom token auth, no DRF/SimpleJWT) |
| `Auth/views.py` | `register`, `login`, `verify_token` views — Bearer token auth via `Authorization` header |
| `ChatBot/views.py:_resolve_user()` | Extracts token from `Authorization` header, looks up `AuthToken` → `AuthUser` |
| `Backend/settings.py` | `CSRF_TRUSTED_ORIGINS`, `ALLOWED_HOSTS = ["*"]`, session middleware (unused by custom auth), `@csrf_exempt` on all API views |

### Frontend
| File | What it does |
|------|-------------|
| `lib/auth-session.ts` | Core session: creates/reads/clears JWT-signed `django-session` cookie via `next-auth/jwt`; `verifyWithDjango()` validates with backend |
| `lib/auth-django.ts` | Client helpers: `loginDjango`, `registerDjango`, `logoutDjango`, `getAuthToken` (localStorage) |
| `lib/get-session.ts` | Server `getAppSession()`: reads `django-session` cookie, returns `AppSession` with UUIDv5 user ID from email |
| `app/(auth)/actions.ts` | Server actions: `login`/`register`/`logout` — validates via zod, POSTs to Django, creates/clears session cookie |
| `app/api/django-logout/route.ts` | API handler that calls `clearDjangoSession()` |
| `middleware.ts` | Protects `/chat`, `/dashboard`, `/trip`; redirects unauthenticated to `/login?callbackUrl=` |

---

## 5. Frontend Pages / Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/(chat)/page.tsx` | Redirect to `/` |
| `/` | `app/(main)//page.tsx` | Landing page — hero, features grid, how-it-works, CTA |
| `/explore` | `app/(main)/explore/page.tsx` | Destination browser — search, category filter, cards |
| `/dashboard` | `app/(main)/dashboard/page.tsx` | User dashboard — stats, saved trips, recent activity |
| `/trip/[id]` | `app/(main)/trip/[id]/page.tsx` | Trip detail — flights, hotel, itinerary, map |
| `/login` | `app/(auth)/login/page.tsx` | Login form → Django backend |
| `/register` | `app/(auth)/register/page.tsx` | Registration form → Django backend |
| `/chat/new` | `app/(chat)/chat/new/page.tsx` | New chat — WebSocket-based chat |
| `/chat/[id]` | `app/(chat)/chat/[id]/page.tsx` | Existing chat — AI SDK streaming chat with artifacts |

### Layouts
| Layout | Wraps | Description |
|--------|-------|-------------|
| `app/layout.tsx` | All routes | Root: fonts, ThemeProvider, ReduxProvider, Toaster |
| `app/(main)/layout.tsx` | home/explore/dashboard/trip | Navbar |
| `app/(chat)/layout.tsx` | chat/* | AppSidebar + SidebarProvider |

### Component Library (`components/`)

**Chat (AI SDK version):** `chat`, `chat-header`, `messages`, `message`, `message-actions`, `message-editor`, `message-reasoning`, `multimodal-input`, `suggested-actions`, `greeting`, `model-selector` — full streaming chat with artifacts, document editing, voting

**Chat (WebSocket version):** `websocket-chat`, `websocket-messages`, `websocket-input` — Django WebSocket chat with Redux state, renders flight/hotel/currency/weather cards

**Sidebar/Nav:** `app-sidebar`, `sidebar-history`, `sidebar-history-item`, `sidebar-user-nav`, `sidebar-toggle`, `navbar`

**Artifacts:** `artifact`, `artifact-actions`, `artifact-close-button`, `artifact-messages`, `create-artifact`, `document`, `document-skeleton`, `document-preview`, `code-editor`, `text-editor`, `sheet-editor`, `image-editor`, `diffview`, `console`, `suggestion`

**Data cards:** `flight-card`, `hotel-card`, `currency-card`, `weather`, `map-view`, `markdown`, `code-block`, `preview-attachment`

**UI primitives:** 14 shadcn/ui components (button, card, input, textarea, label, select, separator, tooltip, dropdown-menu, sheet, sidebar, skeleton, alert-dialog, tooltip)

**Auth/Providers:** `auth-form`, `submit-button`, `theme-provider`, `redux-provider`

**Utilities:** `toast`, `icons` (~50 SVG icons), `language-toggle` (Urdu/English), `visibility-selector`, `toolbar`, `version-footer`, `page-loader`

---

## 6. Third-Party API Integrations

| Service | Package / Protocol | What it's used for |
|---------|-------------------|-------------------|
| **Amadeus** | raw HTTP (`requests`) | Flight offers search, hotel offers, hotel-by-city lookup |
| **Groq** (LLM) | raw HTTP (`requests`) | `llama-3.3-70b-versatile` — travel assistant NLU |
| **xAI Grok** | `@ai-sdk/xai` | `grok-2-vision-1212` / `grok-3-mini-beta` — frontend chat AI |
| **Open-Meteo** | raw HTTP (`aiohttp`) | Weather forecast + geocoding |
| **Nominatim (OSM)** | raw HTTP (`aiohttp`) | Location/place search |
| **Frankfurter** | raw HTTP (`aiohttp`) | Currency conversion rates |
| **jsDelivr** | raw HTTP | Fallback currency rates |
| **Vercel Blob** | `@vercel/blob` | File upload storage |
| **Vercel Postgres** | `@vercel/postgres` | PostgreSQL database (frontend) |
| **Vercel Analytics** | `@vercel/analytics` | Web analytics |
| **Vercel Functions (geo)** | `@vercel/functions` | Geo-location for rate limiting in chat |
| **Redis** | `redis` npm (optional) | Resumable stream storage |
| **Leaflet** (via CDN in `map-view`) | browser | Interactive trip map |

---

## 7. WebSocket

### Backend Consumer
| File | Route | Consumer | Details |
|------|-------|----------|---------|
| `ChatBot/routing.py` | `ws/chat/` | `ChatConsumer` | Authenticates via `?token=` query param; guest allowed; delegates to `get_chatbot_response` (Groq LLM + MCP tool orchestration); sends ping every 10s |

### ASGI Configuration
| File | Detail |
|------|--------|
| `Backend/asgi.py` | `ProtocolTypeRouter`: HTTP → Django ASGI app, WebSocket → `URLRouter(websocket_urlpatterns)` |

### Frontend Client
| File | What it does |
|------|-------------|
| `lib/redux/chatSlice.ts` | `initializeWebSocket` thunk: connects to `ws://localhost:8000/ws/chat/?token=<token>`, dispatches messages to Redux; `sendWebSocketMessage` sends user messages |
| `components/websocket-chat.tsx` | Initializes WS on mount, renders message list + input |
| `components/websocket-messages.tsx` | Renders message bubbles, flight/hotel/currency/weather cards |
| `components/websocket-input.tsx` | Text input, dispatches `sendWebSocketMessage` |

---

## 8. PB-01 to PB-14 Feature Audit

> Compared against the Product Backlog from the FYP report.

| PB-ID | User Story | Priority | Status in Code | Evidence |
|-------|-----------|----------|---------------|----------|
| PB-01 | Type queries → AI responses in real-time | High | ✅ Done | Dual chat: WebSocket (`websocket-chat` → ChatConsumer → Groq) + AI SDK (`chat.tsx` → xAI Grok) |
| PB-02 | Chat history maintained during session | High | ✅ Done | WebSocket: in-memory `chat_histories`; AI SDK: `Chat` + `Message_v2` in Drizzle |
| PB-03 | Search flights by departure/destination/dates | High | ✅ Done | `FlightAgent` → `Flight.views.get_lowest_rates` → Amadeus; MCP `get_Flights` |
| PB-04 | Flights filtered by budget | Medium | ✅ Done | `budget` param → `max_price` in Amadeus query |
| PB-05 | Search hotels with check-in/out | High | ✅ Done | `HotelAgent` → `Restaurant.views.fetchHotels` → Amadeus; MCP `get_hotels` |
| PB-06 | Hotel prices in USD | Medium | ✅ Done | `Restaurant.helpers.to_usd()` via Frankfurter API; `hotel-card.tsx` display |
| PB-07 | "Plan a trip" → flights + hotels | High | ✅ Done | `TravelMateOrchestrator` handles multi-tool JSON: `[{tool:"get_Flights"},{tool:"get_hotels"}]` |
| PB-08 | Landing page explaining system | Medium | ✅ Done | `app/(main)//page.tsx` — hero, features, how-it-works, CTA |
| PB-09 | Dashboard with trip overview | Medium | ✅ Done | `app/(main)/dashboard/page.tsx` — stats, saved trips, activity |
| PB-10 | Browse destinations, filter by category | Medium | ✅ Done | `app/(main)/explore/page.tsx` — search + category filter + cards |
| PB-11 | Trip detail view (flights, hotels, itinerary) | Medium | ✅ Done | `app/(main)/trip/[id]/page.tsx` — map, hotels, flights, itinerary |
| PB-12 | LLM returns tool actions as JSON | High | ✅ Done | System prompt → JSON array `[{tool, input}]` parsed in `get_chatbot_response` |
| PB-13 | Response < 10s (non-functional) | Medium | ✅ Done | WebSocket ~2-5s; MCP parallel exec; `InMemoryChannelLayer` |
| PB-14 | Responsive mobile & desktop | Medium | ✅ Done | Tailwind responsive; SidebarProvider mobile collapse |

## 9. Features in Code — Not in PB-01–PB-14

| # | Feature | Where | Notes |
|---|---------|-------|-------|
| 1 | **User authentication system** | `Auth/` Django app + `app/(auth)/` pages | Report says "No user auth (demo mode)" — but auth IS implemented |
| 2 | **Chat history persisted to Django DB** | `ChatBot/models.py` (Chat + Message) + `/api/chat/history/` | Persists across sessions, not just in-memory |
| 3 | **Dual chat implementations** | AI SDK (xAI Grok + artifacts) + WebSocket (Groq + MCP) | Two parallel systems |
| 4 | **Document artifacts with versioning** | CodeMirror, ProseMirror, react-data-grid, diffview, suggestions | Full collaborative editing suite |
| 5 | **Resumable chat streams** | Redis-backed SSE, `Stream` model | PB only mentions real-time responses |
| 6 | **Rate limiting (20/100 msg/day)** | Geo-location from `@vercel/functions` | Not in PB |
| 7 | **Multi-model selector** | `grok-2-vision` vs `grok-3-mini-beta` | Not in PB |
| 8 | **Urdu/English language toggle** | `language-toggle.tsx` | Not in PB |
| 9 | **Standalone MCP server** | `mcp_travelmate/` port 8001, SSE, 5 tools | Architecture extends beyond single-chatbot |
| 10 | **Weather display + card** | `weather.tsx`, Open-Meteo | Not in PB (only flights/hotels) |
| 11 | **Currency conversion card** | `currency-card.tsx`, Frankfurter API | Not in PB (only USD display) |
| 12 | **Leaflet interactive map** | `map-view.tsx` on trip page | Not in PB |
| 13 | **Custom SHA-256 token auth** | `Auth/models.py` | No DRF, no SimpleJWT, no NextAuth |
| 14 | **Image upload to Vercel Blob** | `app/api/files/upload/route.ts` | Not in PB |

## 10. Future Work (from Report) — Status in Code

| Future Item | Report § | Status | Evidence |
|------------|----------|--------|----------|
| Voice agent | §10 | ❌ Not started | No audio/voice code |
| User authentication | §10 | ✅ Implemented | `AuthUser` + Bearer token + `django-session` JWT cookie |
| Maps integration | §10 | ✅ Implemented | Leaflet via `map-view.tsx` |
| Multi-language support | §10 | ✅ Partial | Urdu/English toggle (UI labels only) |
| Amadeus test → production | §10 | ❌ Not started | Still on `test.api.amadeus.com` |
| Payment gateway | §10 | ❌ Not started | No Stripe/PayPal code |

---

> **Legend:** Codebase consists of **Django backend** (auth + chat + MCP orchestration + Amadeus/Groq/Open-Meteo) + **Next.js frontend** (AI SDK chat with artifacts + WebSocket chat + destination browse + dashboard + trip detail). Two separate chat systems exist — one using AI SDK/xAI Grok (artifacts, streaming), one using Django WebSocket/Groq LLM (agent tool cards).
