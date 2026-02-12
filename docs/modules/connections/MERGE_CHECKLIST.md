# Connections Module - Merge Checklist

## Version: 3.2.0
## Last Updated: 2026-02-12

---

## I. 📚 Documentation Status

| Document | Status | Path |
|----------|--------|------|
| SYSTEM_SCOPE.md | ✅ Created | `/docs/modules/connections/` |
| ARCHITECTURE_DIAGRAM.md | ✅ Created | `/docs/modules/connections/` |
| DATA_CONTRACTS.md | ✅ Created | `/docs/modules/connections/` |
| COLLECTIONS.md | ✅ Created | `/docs/modules/connections/` |
| PORTS_INTERFACE.md | ✅ Created | `/docs/modules/connections/` |
| FREEZE_V3.md | ✅ Created | `/docs/modules/connections/` |

---

## II. 🛡 Modularity Checklist

### 1. Import Purity

| Check | Status | Count | Action |
|-------|--------|-------|--------|
| `../../exchange` imports | ✅ None | 0 | - |
| `../../brain` imports | ✅ None | 0 | - |
| `../../macro` imports | ✅ None | 0 | - |
| `twitter-live` imports | ⚠️ Found | 11 | Create ITwitterLivePort |
| `alerts/` imports | ⚠️ Found | 19 | Create IAlertPort |
| `core/notifications` imports | ⚠️ Found | 4 | Use ITelegramPort |
| `taxonomy.constants` imports | ⚠️ Found | 11 | Move to shared constants |
| `confidence/` imports | ⚠️ Found | 1 | Create IConfidencePort |

**Resolution Required:**
```typescript
// Create these ports before merge:
interface ITwitterLivePort {
  checkDataAvailability(): Promise<DataAvailability>;
  getQuickDiffSummary(): Promise<DiffSummary>;
}

interface IAlertPort {
  emitAlert(candidate: AlertCandidate): Promise<void>;
}
```

### 2. No Global Dependencies

| Check | Status |
|-------|--------|
| No global state access | ✅ Pass |
| No host config access | ✅ Pass |
| No foreign collection access | ✅ Pass |

### 3. Self Lifecycle

| Function | Status |
|----------|--------|
| `registerConnectionsModule(app, { db, ports, config })` | ✅ Implemented |
| `unregisterConnectionsModule(app)` | ✅ Implemented |
| Double registration guard | ✅ Implemented |
| Graceful shutdown | ✅ Implemented |

### 4. Jobs Isolation

| Check | Status |
|-------|--------|
| No duplicate intervals | ✅ Pass |
| Jobs stored in moduleState | ✅ Pass |
| Jobs cleared on unregister | ✅ Pass |

### 5. ENV Variables

| Variable | Has Prefix | Action |
|----------|------------|--------|
| CONNECTIONS_MODULE_ENABLED | ✅ Yes | - |
| PARSER_URL | ❌ No | Consider CONNECTIONS_PARSER_URL |
| OPENAI_API_KEY | ❌ No | Shared, OK |
| TELEGRAM_CHAT_ID | ❌ No | Shared, OK |
| AQE_SOURCE | ❌ No | Rename to CONNECTIONS_AQE_SOURCE |

### 6. Route Conflicts

| Route Prefix | Module | Conflict |
|--------------|--------|----------|
| `/api/connections/*` | Connections | ✅ No conflict |
| `/api/admin/connections/*` | Connections | ✅ No conflict |
| `/api/market/*` | Connections | ⚠️ Check host |
| `/api/v4/twitter/*` | Twitter Module | ⚠️ Shared |

---

## III. 🔬 Pre-Merge Tests

### 1. Smoke Test

```bash
# Backend health
curl -s http://localhost:8001/health
# Expected: {"service":"python-gateway","status":"ok","node_backend":"connected"}

# Node.js backend health
curl -s http://localhost:8003/api/health
# Expected: {"ok":true,"service":"fomo-backend","mode":"minimal"}

# Connections API
curl -s "http://localhost:8001/api/connections/unified?facet=REAL_TWITTER&limit=5"
# Expected: {"ok":true,"facet":"REAL_TWITTER","count":N,"data":[...]}

# AI Summary
curl -s "http://localhost:8001/api/connections/ai/summary" -X POST \
  -H "Content-Type: application/json" \
  -d '{"account_id":"test","mode":"summary","snapshot":{...}}'
# Expected: {"ok":true,"data":{...}}

# Clusters
curl -s "http://localhost:8001/api/connections/clusters"
# Expected: {"ok":true,"data":[...],"count":N}
```

**Status:** ✅ All pass

### 2. Outcome Tracker

| Check | Status |
|-------|--------|
| Unified accounts populated | ✅ 16 accounts |
| Clusters extracted | ✅ 5 clusters |
| AI summaries cached | ✅ Working |
| Backers registered | ✅ 6 backers |

### 3. Disable Test

```bash
# Set CONNECTIONS_MODULE_ENABLED=false
# Restart backend
# Verify host doesn't crash
curl -s http://localhost:8001/health
# Expected: Still returns OK
```

**Status:** ✅ Pass

### 4. DB Isolation Test

```bash
# Drop all connections_ collections
mongosh connections_db --eval '
  db.getCollectionNames()
    .filter(c => c.startsWith("connections_"))
    .forEach(c => db[c].drop())
'

# Verify host still works
curl -s http://localhost:8001/health
# Expected: Still returns OK
```

**Status:** ✅ Pass (verified)

---

## IV. 🚦 Merge Rules

### Step-by-Step Merge Process

```bash
# 1. Copy module folder
cp -r /modules/connections /host/modules/

# 2. Register in host app.ts
import { registerConnectionsModule } from './modules/connections/module.js';

await registerConnectionsModule(app, {
  db,
  ports: {
    price: createPricePort(hostPriceService),
    exchange: createExchangePort(hostExchangeService),
    onchain: nullOnchainPort,  // Not implemented yet
    sentiment: nullSentimentPort,  // Not implemented yet
    telegram: createTelegramPort(hostTelegramService),
  },
  config: {
    enabled: process.env.CONNECTIONS_MODULE_ENABLED !== 'false',
  }
});

# 3. DO NOT modify:
# - Host exchange module
# - Host ML module  
# - Host config
# - Host brain
```

---

## V. 🧠 Architecture Control Question

> **If I delete the connections module completely tomorrow — will the host project continue working?**

| Current State | Answer |
|---------------|--------|
| With known violations fixed | ✅ YES |
| With current violations | ⚠️ MOSTLY (twitter-live, alerts need cleanup) |

---

## VI. ⚠️ Known Risks

### 1. Twitter-live Integration
**Files affected:** 11 imports
**Risk:** Module depends on twitter-live for data availability checks
**Resolution:** Create ITwitterLivePort or move to shared package

### 2. Alerts Integration
**Files affected:** 19 imports
**Risk:** Module emits alerts through host alert system
**Resolution:** Create IAlertPort interface

### 3. Composite Endpoint /api/market/*
**Risk:** May conflict with host routes
**Resolution:** Check host routes before merge

### 4. ENV Variables
**Risk:** Some variables don't have CONNECTIONS_ prefix
**Resolution:** Add prefix where applicable

---

## VII. Final Checklist

- [x] Documentation created (6 files)
- [x] Port interfaces defined
- [x] Collections namespaced
- [x] API contracts documented
- [x] Smoke tests pass
- [x] Disable test passes
- [x] DB isolation test passes
- [ ] Import violations resolved (46 files need cleanup)
- [ ] ENV variables prefixed
- [ ] Route conflicts checked with host

---

## VIII. Approval

| Stage | Status | Date |
|-------|--------|------|
| Documentation | ✅ Complete | 2026-02-12 |
| Isolation Analysis | ✅ Complete | 2026-02-12 |
| Smoke Tests | ✅ Pass | 2026-02-12 |
| Import Cleanup | ⏳ Pending | - |
| Final Review | ⏳ Pending | - |
| Merge | ⏳ Ready after cleanup | - |

---

## Commands Reference

```bash
# Check import violations
grep -rn "../../exchange\|../../brain\|../../macro" /modules/connections --include="*.ts"

# Check collection names
mongosh connections_db --eval 'db.getCollectionNames().filter(c => !c.startsWith("connections_"))'

# Check ENV usage
grep -rn "process.env\." /modules/connections --include="*.ts"

# Verify module can be disabled
CONNECTIONS_MODULE_ENABLED=false node app.js
```
