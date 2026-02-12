# FOMO Connections Module - PRD

## Версия: 3.0.0 (Mobile Responsive Fixed)
## Дата: 2026-02-12

---

## Статус: МОБИЛЬНЫЙ АДАПТИВ ПОЛНОСТЬЮ ЗАВЕРШЕН ✓ (v3)

### Архитектура сервисов:

| Сервис | Порт | Статус |
|--------|------|--------|
| Frontend React | 3000 | RUNNING |
| Python FastAPI Proxy | 8001 | RUNNING |
| Node.js Fastify Backend | 8003 | RUNNING |
| MongoDB | 27017 | RUNNING |
| Twitter Parser V2 | 5001 | RUNNING |

---

## Мобильный адаптив v3 (2026-02-12):

### Базовый viewport: iPhone 12 Pro (390x844px)

### Sidebar
- ✅ Скрыт по умолчанию на мобильных (< 1024px)
- ✅ Hamburger menu button в левом верхнем углу
- ✅ Slide-in drawer с overlay
- ✅ Закрытие по клику на overlay или X
- ✅ Автоматическое закрытие при навигации

### TopBar
- ✅ Мобильная иконка поиска вместо полноширинного поля
- ✅ Компактная кнопка Connect (только иконка на мобильных)
- ✅ Иконки watchlist, notifications справа

### Протестированные страницы (100% success):
- ✅ `/connections/influencers` - карточки, фильтры, навигация
- ✅ `/connections/clusters` - заголовок, кнопки, карточки кластеров
- ✅ `/connections/lifecycle` - табы, статистика, информационные блоки
- ✅ `/connections/graph` - заголовок, поиск, граф
- ✅ `/connections/alt-season` - статистика, карточки
- ✅ `/connections/radar` - фильтры, график, список аккаунтов (stacked layout)
- ✅ `/connections/narratives` - статистика, табы
- ✅ `/connections/reality` - 2-column stats grid
- ✅ `/connections/backers` - фильтры, поиск

### CSS стили (connections-mobile.css v3)
- ✅ Горизонтальный скролл для навигационных табов
- ✅ Горизонтальный скролл для фильтров групп
- ✅ overflow-x: hidden на body - нет горизонтального скролла страницы
- ✅ Скрытие scrollbar через CSS
- ✅ 2x2 сетка для статистики
- ✅ Stacked layout для двухколоночных страниц (grid-cols-1 lg:grid-cols-2)
- ✅ Touch-friendly кнопки (min 44px)
- ✅ Safe area support (iPhone notch)
- ✅ Dark mode адаптация

---

## Seed данные в MongoDB:

| Коллекция | Записей |
|-----------|---------|
| connections_author_profiles | 10 |
| connections_unified_accounts | 10 |
| connections_follow_graph | 30 edges |
| connections_asset_lifecycle | 8 assets |
| connections_cluster_lifecycle | 6 clusters |
| influencer_clusters | 3 |
| cluster_token_momentum | 5 tokens |
| connections_early_rotations | 2 |

### Influencers:
- @vitalikbuterin (S-tier, 5.8M)
- @cz_binance (S-tier, 9.2M)
- @a16z (S-tier, 1.2M)
- @paradigm (S-tier, 380K)
- @cobie (A-tier, 920K)
- @raoulpal (A-tier, 1.1M)
- @lookonchain (A-tier, 650K)
- @hsaka (B-tier, 280K)
- @pentoshi (A-tier, 720K)
- @brian_armstrong (S-tier, 1.4M)

---

## Тестирование (iteration_4):

- Mobile Responsive: 100% ✓
- Pages Tested: 9/9 ✓
- Hamburger Menu: ✓
- Horizontal Scroll Tabs: ✓
- No Page Overflow: ✓
- Overall Frontend: 100% ✓

---

## Исправленные баги:

### v3 (2026-02-12)
1. ConnectionsInfluencersPage - навигационные табы с горизонтальным скроллом
2. ConnectionsInfluencersPage - адаптивные фильтры групп
3. ClusterAttentionPage - адаптивный заголовок и кнопки
4. LifecyclePage - адаптивные табы с горизонтальным скроллом
5. ConnectionsEarlySignalPage (Radar) - grid-cols-1 lg:grid-cols-2 вместо grid-cols-2
6. TopBar - мобильная иконка поиска вместо полноширинного поля
7. connections-mobile.css - полностью переписан для iPhone 12 Pro

### v2 (предыдущий)
1. LifecyclePage - "Icon is not defined"
2. ConnectionsEarlySignalPage - "HelpCircle/Info is not defined"
3. AltSeasonPage - icon format fix
4. Sidebar visibility на мобильных

---

## P1 (Next Steps):
1. ✅ DONE - Мобильная адаптивность
2. ✅ DONE - Исправить "Unknown" данные на странице /connections/unified
3. Загрузить Twitter cookies для парсинга
4. Follow Graph с реальными данными

## P2 (Backlog):
1. WebSocket real-time updates
2. Telegram bot интеграция
3. Infinite scroll для списков
4. Полный аудит иконок FomoIcons на всех страницах

---

## Ключевые файлы:

- `/app/frontend/src/styles/connections-mobile.css` - мобильные стили v3
- `/app/frontend/src/layout/AppLayout.jsx` - основной layout
- `/app/frontend/src/layout/TopBar.jsx` - верхняя панель с мобильным поиском
- `/app/frontend/src/components/Sidebar.jsx` - боковое меню с hamburger
- `/app/frontend/src/pages/connections/*` - страницы модуля Connections

---

Last Updated: 2026-02-12
Testing Report: /app/test_reports/iteration_4.json
