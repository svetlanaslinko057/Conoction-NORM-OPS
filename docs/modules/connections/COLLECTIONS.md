# Connections Module - MongoDB Collections

## Version: 3.2.0
## Last Updated: 2026-02-12

---

## Namespace Rule

**ALL collections MUST have prefix:** `connections_`

❌ **Forbidden:**
- `actors`
- `unified_accounts`
- `clusters`

✅ **Required:**
- `connections_actors`
- `connections_unified_accounts`
- `connections_clusters`

---

## Collection Catalog

### Core Data

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_unified_accounts` | Main account storage | `id`, `kind`, `handle`, `smart`, `influence`, `authority` |
| `connections_actors` | Legacy actor storage | `actorId`, `twitterHandle` |
| `connections_follow_graph` | Follow relationships | `follower_username`, `following_username` |

### Events & Predictions

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_events` | System events | `timestamp`, `type`, `actorId` |
| `connections_ips_predictions` | IPS predictions | `actorId`, `timestamp` |
| `connections_ips_outcomes` | IPS outcomes | `predictionId`, `timestamp` |

### Clusters

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_clusters` | Cluster definitions | `id`, `type` |
| `connections_cluster_members` | Cluster membership | `clusterId`, `username` |
| `connections_cluster_momentum` | Cluster momentum | `clusterId`, `timestamp` |
| `connections_cluster_credibility` | Cluster credibility | `clusterId` |
| `connections_cluster_alignments` | Cluster alignments | `clusterId`, `tokenId` |
| `connections_cluster_token_attention` | Token attention | `symbol`, `clusterId` |
| `connections_influencer_clusters` | Extracted clusters | `id`, `metrics.authority` |

### Audience Quality

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_audience_quality` | Quality metrics | `actorId` |
| `connections_audience_reports` | Quality reports | `actorId`, `timestamp` |
| `connections_farm_overlap_edges` | Farm detection | `sourceId`, `targetId` |
| `connections_bot_farms` | Bot farm registry | `farmId` |

### Taxonomy

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_taxonomy_groups` | Taxonomy groups (narratives) | `id`, `category` |
| `connections_taxonomy_presets` | Saved presets | `id`, `userId` |
| `connections_taxonomy_memberships` | Group memberships | `groupId`, `actorId` |

### Reality Layer

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_verdicts` | Reality verdicts | `accountId` |
| `connections_credibility_scores` | Credibility scores | `actorId` |
| `connections_trust_multipliers` | Trust multipliers | `actorId` |

### Alt Season

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_alt_patterns` | Alt patterns | `patternId` |
| `connections_alt_scores` | Alt scores | `tokenId`, `timestamp` |
| `connections_pattern_matches` | Pattern matches | `patternId`, `timestamp` |
| `connections_alt_season_state` | Current state | `window` |

### Watchlists

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_watchlists` | User watchlists | `userId`, `id` |
| `connections_watchlist_items` | Watchlist items | `watchlistId`, `actorId` |

### Notifications

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_notification_settings` | User settings | `userId` |
| `connections_notification_deliveries` | Delivery log | `userId`, `timestamp` |

### Projects & Backers

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_projects` | Project registry | `projectId` |
| `connections_project_backers` | Project backers | `projectId` |
| `connections_project_accounts` | Project accounts | `projectId`, `accountId` |
| `connections_backers` | Backer entities | `slug`, `seedAuthority` |
| `connections_backer_bindings` | Backer bindings | `backerId`, `targetId` |
| `connections_backer_audit` | Audit log | `backerId`, `timestamp` |

### Token & Market

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_token_momentum` | Token momentum | `symbol`, `timestamp` |
| `connections_token_opportunities` | Opportunities | `tokenId`, `status` |
| `connections_opportunity_outcomes` | Outcomes | `opportunityId` |
| `connections_market_state_attribution` | Market state | `id` |
| `connections_token_prices` | Price cache | `symbol`, `timestamp` |

### Graph

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_backer_coinvest_edges` | Co-investment | `sourceId`, `targetId` |
| `connections_twitter_follows` | Twitter follows | `followerId`, `followingId` |
| `connections_parser_follow_edges` | Parser edges | `sourceUsername`, `targetUsername` |
| `connections_parser_follower_edges` | Parser follower edges | `targetUsername`, `sourceUsername` |

### Lifecycle

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_asset_lifecycle` | Asset lifecycle | `tokenId`, `lifecycle` |

### Config

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_module_config` | Module config | `key` |

### AI

| Collection | Purpose | Indexes |
|------------|---------|--------|
| `connections_ai_summaries` | AI cache | `hash`, `accountId`, `expiresAt` |

---

## Index Management

All indexes are created automatically via `ensureIndexes()` methods in respective stores.

```typescript
// Example from unified.service.ts
await db.collection('connections_unified_accounts').createIndexes([
  { key: { kind: 1 } },
  { key: { smart: -1 } },
  { key: { influence: -1 } },
  { key: { authority: -1 } },
  { key: { followers: -1 } },
  { key: { handle: 1 }, unique: true, sparse: true },
]);
```

---

## Isolation Test

**Before merge, verify:**

```bash
# Drop all connections_ collections
mongosh connections_db --eval '
  db.getCollectionNames()
    .filter(c => c.startsWith("connections_"))
    .forEach(c => db[c].drop())
'

# Host application must continue working
curl http://localhost:8001/health
# Should return: {"ok": true}
```

---

## Total: 40+ Collections

All namespaced with `connections_` prefix for safe isolation.
