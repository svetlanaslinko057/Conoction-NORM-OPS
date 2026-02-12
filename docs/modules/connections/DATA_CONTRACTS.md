# Connections Module - Data Contracts

## Version: 3.2.0
## Last Updated: 2026-02-12
## Status: FROZEN (do not modify field names)

---

## API Contracts

### 1. Unified Accounts

**Endpoint:** `GET /api/connections/unified`

**Query Parameters:**
```typescript
{
  facet: 'REAL_TWITTER' | 'SMART' | 'INFLUENCE' | 'TRENDING' | 'EARLY' | 'VCS_FUNDS';
  limit?: number;  // default: 50
  offset?: number; // default: 0
  search?: string;
}
```

**Response:**
```typescript
{
  ok: boolean;
  facet: string;
  title: string;
  count: number;
  data: UnifiedAccount[];
}
```

**UnifiedAccount Schema:**
```typescript
interface UnifiedAccount {
  id: string;           // unique identifier
  kind: 'TWITTER';      // source type
  title: string;        // display name
  handle: string;       // @username
  avatar: string;       // profile image URL
  
  // Scores (0-1 normalized)
  smart: number;        // smart followers ratio
  influence: number;    // influence score
  early: number;        // early signal score
  authority: number;    // authority score (0-100)
  handshake: number;    // network connectivity
  
  // Metrics
  followers: number;
  following: number;
  engagement: number;   // engagement rate
  confidence: number;   // data confidence
  
  // Metadata
  categories: string[];
  tags: string[];
  verified: boolean;
  source: string;       // 'PLAYWRIGHT_PARSER' | 'MANUAL' | etc.
  lastSeen: Date | null;
  
  // Snapshot for AI
  snapshot?: AccountSnapshot;
}
```

---

### 2. AI Summary

**Endpoint:** `POST /api/connections/ai/summary`

**Request Body:**
```typescript
{
  account_id: string;
  mode: 'summary' | 'explain' | 'event';
  snapshot: AccountSnapshot;
  event?: {
    type: string;
    data: any;
  };
}
```

**AccountSnapshot Schema:**
```typescript
interface AccountSnapshot {
  twitter_score_0_1000: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  twitter_confidence_score_0_100: number;
  smart_followers_0_100: number;
  audience_quality_0_1: number;
  authority_0_1: number;
  network_0_1: number;
  consistency_0_1: number;
  hops: {
    avg_hops_to_top: number;
    direct_to_elite: number;
  };
  early_signal: {
    badge: 'none' | 'rising' | 'breakout';
    score: number;
  };
  trends: {
    state: 'growing' | 'stable' | 'cooling';
    velocity: number;
  };
  red_flags?: string[];
}
```

**Response:**
```typescript
{
  ok: boolean;
  data: AiSummaryOutput;
}

interface AiSummaryOutput {
  version: string;      // '3.5.0'
  model: string;        // 'gpt-4o-mini'
  language: string;     // 'en'
  
  headline: string;     // short summary
  summary: string;      // detailed analysis
  verdict: 'STRONG' | 'GOOD' | 'MIXED' | 'RISKY' | 'INSUFFICIENT_DATA';
  
  key_drivers: string[];    // max 7 items
  risks: string[];          // max 7 items
  recommendations: string[]; // max 7 items
  
  evidence: {
    score: number;
    grade: string;
    confidence_0_100: number;
    notable: string[];
  };
  
  telegram?: {
    title: string;
    text: string;
    tags: string[];
  };
}
```

---

### 3. Clusters

**Endpoint:** `GET /api/connections/clusters`

**Response:**
```typescript
{
  ok: boolean;
  data: InfluencerCluster[];
  count: number;
}

interface InfluencerCluster {
  id: string;
  name: string;
  description: string;
  members: string[];      // usernames
  memberCount: number;
  metrics: {
    authority: number;    // avg authority
    cohesion: number;     // internal connectivity
    momentum: number;     // growth rate
    growth7d: number;     // 7-day growth %
  };
  totalFollowers: number;
  topTags: string[];
  activity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 4. Opportunities

**Endpoint:** `GET /api/connections/opportunities`

**Response:**
```typescript
{
  ok: boolean;
  data: TokenOpportunity[];
  count: number;
}

interface TokenOpportunity {
  tokenId: string;
  symbol: string;
  name: string;
  clusterMentions: number;
  momentumScore: number;       // 0-1
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  signals: string[];           // ['CLUSTER_ATTENTION', 'VOLUME_SPIKE', etc.]
  priceChange24h: number;      // %
  volumeChange24h: number;     // %
  status: 'ACTIVE' | 'CLOSED';
  detectedAt: Date;
  updatedAt: Date;
}
```

---

### 5. Backers

**Endpoint:** `GET /api/admin/connections/backers`

**Response:**
```typescript
{
  ok: boolean;
  data: {
    backers: BackerEntity[];
    count: number;
    stats: BackerStats;
  };
}

interface BackerEntity {
  id: string;
  slug: string;           // unique, lowercase
  name: string;
  description: string;
  type: 'FUND' | 'PROJECT' | 'DAO' | 'ECOSYSTEM' | 'COMPANY';
  categories: BackerCategory[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';
  
  seedAuthority: number;  // 0-100
  confidence: number;     // 0-1
  source: 'MANUAL' | 'CURATED' | 'EXTERNAL';
  
  externalRefs?: {
    website?: string;
    coingecko?: string;
    defillama?: string;
    crunchbase?: string;
    github?: string;
  };
  
  display?: {
    logo?: string;
    primaryColor?: string;
  };
  
  frozen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 6. Alt Season State

**Endpoint:** `GET /api/connections/alt-season`

**Response:**
```typescript
{
  ok: boolean;
  data: AltSeasonState | null;
}

interface AltSeasonState {
  window: '24h';
  state: 'BTC_SEASON' | 'EARLY_ALT' | 'ALT_SEASON' | 'ROTATION';
  probability: number;    // 0-1
  confidence: number;     // 0-1
  btcDominance: number;   // %
  altIndex: number;       // 0-100
  rotation: string;       // 'BTC_TO_LARGE_CAP' | etc.
  momentum: string;       // 'ACCELERATING' | 'STABLE' | 'DECELERATING'
  signals: Record<string, number>;
  breakdown: Record<string, number>;
  updatedAt: Date;
}
```

---

## Port Interfaces (Frozen)

```typescript
// Version: 1.0 - DO NOT MODIFY

interface IExchangePort {
  getFundingRate(symbol: string): Promise<{ rate: number; timestamp: Date } | null>;
  getLongShortRatio(symbol: string): Promise<{ longRatio: number; shortRatio: number; timestamp: Date } | null>;
  getVolume(symbol: string, period: '1h' | '4h' | '24h'): Promise<{ volume: number; volumeChange: number; timestamp: Date } | null>;
  getOpenInterest(symbol: string): Promise<{ openInterest: number; oiChange: number; timestamp: Date } | null>;
}

interface IOnchainPort {
  getWhaleMovements(token: string, hours: number): Promise<{ inflows: number; outflows: number; netFlow: number; transactions: number } | null>;
  getHolderDistribution(token: string): Promise<{ top10Pct: number; top50Pct: number; uniqueHolders: number } | null>;
  getDexVolume(token: string, period: '1h' | '24h'): Promise<{ volume: number; trades: number } | null>;
}

interface ISentimentPort {
  getSentimentScore(token: string): Promise<{ score: number; confidence: number; sampleSize: number } | null>;
  getSocialVolume(token: string, hours: number): Promise<{ mentions: number; uniqueAuthors: number; engagementTotal: number } | null>;
  getTrendingStatus(token: string): Promise<{ isTrending: boolean; rank: number | null; velocity: number } | null>;
}

interface IPricePort {
  getCurrentPrice(symbol: string): Promise<{ price: number; change24h: number; timestamp: Date } | null>;
  getPriceHistory(symbol: string, hours: number): Promise<{ prices: Array<{ time: Date; price: number }>; high: number; low: number } | null>;
  getMarketCap(symbol: string): Promise<{ marketCap: number; fdv: number; rank: number } | null>;
}
```

---

## Contract Rules

1. **Field names are FROZEN** - do not rename after merge
2. **New fields allowed** - can add optional fields
3. **Removal forbidden** - cannot remove existing fields
4. **Type changes forbidden** - cannot change field types
5. **Null handling** - all ports must handle null responses
