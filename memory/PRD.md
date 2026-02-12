# FOMO Connections Module - PRD

## Версия: 3.1.0 (Deployed)
## Дата: 2026-02-12

---

## Статус: ПРОЕКТ РАЗВЕРНУТ ✓

### Архитектура сервисов:

| Сервис | Порт | Статус |
|--------|------|--------|
| Frontend React | 3000 | ✅ RUNNING |
| Python FastAPI Proxy | 8001 | ✅ RUNNING |
| Node.js Fastify Backend | 8003 | ✅ RUNNING |
| MongoDB | 27017 | ✅ RUNNING |
| Twitter Parser V2 | 5001 | ✅ RUNNING |

---

## Что реализовано:

### 1. Connections Module
- ✅ Influencers страница с карточками (10 influencers)
- ✅ Graph страница для поиска связей
- ✅ Radar страница для early signals
- ✅ Clusters, Backers, Reality страницы
- ✅ Мобильный адаптив (hamburger menu, горизонтальный скролл)

### 2. Twitter Parser V2
- ✅ Playwright-based парсер на порту 5001
- ✅ MULTI architecture (cookies + proxy через body)
- ✅ Поддержка search, tweets, profile, following, followers
- ✅ Mongo Task Queue для batch операций
- ✅ Warmth ping для проверки сессий

### 3. Backend Infrastructure
- ✅ FastAPI proxy (server.py) → Node.js backend
- ✅ Fastify с 100+ API routes
- ✅ WebSocket support
- ✅ MongoDB с seed данными

---

## Seed данные в MongoDB:

| Коллекция | Записей |
|-----------|---------|
| connections_unified_accounts | 10 |
| twitter_egress_slots | 1 |
| proxy_slots | 1 |

### Influencers:
- @vitalikbuterin (Ethereum co-founder, 5.8M followers)
- @cz_binance (Former Binance CEO, 9.2M followers)
- @a16z (a16z crypto, 1.2M followers)
- @paradigm (Research-driven VC, 380K followers)
- @cobie (Trader/Analyst, 920K followers)
- @raoulpal (Macro Investor, 1.1M followers)
- @lookonchain (On-chain analytics, 650K followers)
- @hsaka (Trader/NFT, 280K followers)
- @pentoshi (Charts/Trading, 720K followers)
- @brian_armstrong (Coinbase CEO, 1.4M followers)

---

## Тестирование:

- Backend: 100% (6/6 tests passed)
- Frontend: 95% (minor WebSocket issues)
- Mobile Responsive: ✅ Working
- Services Health: ✅ All running

---

## Ключевые файлы:

### Backend
- `/app/backend/server.py` - Python FastAPI proxy
- `/app/backend/src/app.ts` - Fastify app builder
- `/app/backend/src/modules/connections/` - Connections module
- `/app/backend/src/modules/twitter-user/` - Twitter integration

### Frontend
- `/app/frontend/src/pages/connections/` - Connections pages
- `/app/frontend/src/components/connections/` - Connections components
- `/app/frontend/src/api/connections.api.js` - API hooks

### Twitter Parser
- `/app/twitter-parser-v2/src/server.ts` - Parser server
- `/app/twitter-parser-v2/src/browser/` - Browser management
- `/app/twitter-parser-v2/src/queue/` - Task queue

---

## P0 (Next Steps):
1. Добавить Twitter cookies для реального парсинга
2. Follow Graph с реальными данными
3. Fix WebSocket connection errors (низкий приоритет)

## Исправленные задачи:
- ✅ Исправить отображение "Unknown" данных на странице /connections/unified
  - Seed данные содержат корректные title, name, handle поля
  - Все 10 аккаунтов отображаются с правильными именами

## P1 (Backlog):
1. Telegram bot интеграция
2. WebSocket real-time updates
3. Infinite scroll для списков

---

## ENV Variables:

```env
# Backend
MONGO_URL=mongodb://localhost:27017
MONGODB_URI=mongodb://localhost:27017/connections_db
DB_NAME=connections_db
PORT=8003
PARSER_URL=http://localhost:5001
TELEGRAM_BOT_TOKEN=...
COOKIE_ENC_KEY=...
WEBHOOK_API_KEY=...
MINIMAL_BOOT=1
CONNECTIONS_MODULE_ENABLED=true
```

---

Last Updated: 2026-02-12
Testing Report: /app/test_reports/iteration_1.json
