# Connections Module - Freeze Document V3

## Version: 3.2.0
## Freeze Date: 2026-02-12
## Status: FROZEN FOR MERGE

---

## Frozen Components

### 1. AI Summary Logic ✅ LOCKED

**File:** `/modules/connections/ai/service.ts`

**Locked:**
- Verdict calculation (STRONG/GOOD/MIXED/RISKY/INSUFFICIENT_DATA)
- Confidence gate (min 50%)
- Cache TTL (7 days default)
- Max output items (7 for key_drivers, risks, recommendations)

**OpenAI Config:**
```typescript
{
  model: 'gpt-4o-mini',
  temperature: 0.3,
  max_output_tokens: 1000,
  response_format: { type: 'json_object' }
}
```

---

### 2. Unified Account Schema ✅ LOCKED

**File:** `/modules/connections/unified/unified.service.ts`

**Locked Fields:**
- `id`, `kind`, `title`, `handle`, `avatar`
- `smart`, `influence`, `early`, `authority`, `handshake`
- `followers`, `following`, `engagement`, `confidence`
- `categories`, `tags`, `verified`, `source`, `lastSeen`
- `snapshot` (nested AccountSnapshot)

---

### 3. Facet Definitions ✅ LOCKED

**File:** `/modules/connections/unified/unified.facets.ts`

**Locked Facets:**
| Facet | Filter | Sort |
|-------|--------|------|
| REAL_TWITTER | source: PLAYWRIGHT_PARSER | lastSeen DESC |
| SMART | smart >= 0.7 | smart DESC |
| INFLUENCE | influence >= 0.6 | influence DESC |
| TRENDING | - | twitterScore DESC |
| EARLY | early >= 0.5 | early DESC |
| VCS_FUNDS | categories includes VC | authority DESC |

---

### 4. Port Interfaces ✅ LOCKED

**File:** `/modules/connections/ports/index.ts`

**Version:** 1.0

**Locked Interfaces:**
- `IExchangePort`
- `IOnchainPort`
- `ISentimentPort`
- `IPricePort`
- `ITelegramPort`
- `ITwitterParserPort`

---

### 5. Collection Names ✅ LOCKED

**File:** `/modules/connections/config/connections.config.ts`

**Locked Prefix:** `connections_`

**Total Collections:** 40+

---

### 6. API Routes ✅ LOCKED

**Locked Routes:**
```
GET  /api/connections/unified
GET  /api/connections/clusters
GET  /api/connections/opportunities
GET  /api/connections/alt-season
POST /api/connections/ai/summary
POST /api/connections/ai/summary/batch
GET  /api/connections/ai/status
GET  /api/admin/connections/backers
```

---

## Not Frozen (Can Change)

### Frontend Components
- UI layout and styling
- Component structure
- State management

### Internal Services
- Internal helper functions
- Logging and metrics
- Performance optimizations

### New Features
- New API endpoints (must not conflict)
- New collections (must have prefix)
- New ports (must be optional)

---

## Commit Reference

```bash
# Get current commit hash
git rev-parse HEAD
```

**Freeze Commit:** `[TO BE FILLED ON MERGE]`

---

## Breaking Change Rules

### ❌ FORBIDDEN After Freeze

1. Rename existing API fields
2. Change field types
3. Remove existing fields
4. Change port interface signatures
5. Rename collections
6. Change facet filter logic

### ✅ ALLOWED After Freeze

1. Add new optional fields
2. Add new API endpoints
3. Add new collections (with prefix)
4. Add new ports (optional)
5. Improve performance
6. Fix bugs (without changing contracts)

---

## Pre-Merge Checklist

- [ ] All ports implemented or null-implemented
- [ ] All collections have `connections_` prefix
- [ ] No direct imports from host modules
- [ ] All API contracts documented
- [ ] Smoke tests pass
- [ ] Disable test passes (module removal doesn't crash host)
- [ ] DB isolation test passes (dropping collections doesn't crash host)

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | 2026-02-12 | |
| Reviewer | | | |
| Architect | | | |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 3.0.0 | 2026-02-12 | Initial freeze |
| 3.1.0 | 2026-02-12 | Added AI integration |
| 3.2.0 | 2026-02-12 | Added real Twitter data |
