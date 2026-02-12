# Connections Module Scope

## Version: 3.2.0
## Last Updated: 2026-02-12

---

## Module Purpose

Connections Module provides **social graph analysis** and **influence scoring** for crypto Twitter accounts. It analyzes network connections, audience quality, and generates AI-powered insights.

---

## Active Layers

### ✅ Twitter Parsing Layer
- Real-time Twitter profile/tweets/following parsing
- Playwright-based parser (MULTI architecture)
- Cookie-based authentication with session management
- Rate limiting and proxy rotation

### ✅ Influence Scoring Layer
- Twitter Score (0-1000)
- Authority Score (network quality + engagement + consistency)
- Smart Followers ratio
- Audience Quality metrics

### ✅ Network Analysis Layer
- Follow Graph construction
- Hops-to-Elite calculation
- Cluster extraction (connected components)
- Co-engagement analysis

### ✅ AI Summary Layer
- OpenAI gpt-4o-mini integration
- Verdict generation (STRONG/GOOD/MIXED/RISKY)
- Key Drivers, Risks, Recommendations
- Confidence gates and caching

### ✅ Unified Accounts Layer
- Faceted views (REAL_TWITTER, SMART, TRENDING, etc.)
- Multi-source aggregation
- Searchable account database

### ✅ Backers Registry
- VC/Fund/Project entities
- Seed Authority scores
- Binding system (Backer ↔ Twitter account)

---

## Frozen Layers

### ❄️ Onchain Integration
- Whale movement tracking (interface defined, not active)
- Holder distribution (interface defined, not active)
- DEX volume (interface defined, not active)
- **Status**: Port interface exists, null implementation active

### ❄️ Sentiment Layer
- Social volume tracking (interface defined, not active)
- Sentiment scoring (interface defined, not active)
- **Status**: Port interface exists, null implementation active

### ❄️ Exchange Layer
- Funding rate (interface defined, not active)
- Long/Short ratio (interface defined, not active)
- **Status**: Port interface exists, null implementation active

---

## Out of Scope

### ❌ Never Implemented
- Trade execution
- Order routing
- Position management
- Real money operations

### ❌ Separate Modules
- Twitter Score calculation (uses connections data but separate service)
- Alert System (uses connections events but separate module)
- Token Price Data (consumed via IPricePort)

---

## Module Boundaries

```
┌──────────────────────────────────────────────────────┐
│                CONNECTIONS MODULE                     │
├──────────────────────────────────────────────────────┤
│  INPUTS:                                             │
│  • Twitter Parser Data (via ITwitterParserPort)      │
│  • Price Data (via IPricePort)                       │
│  • Exchange Data (via IExchangePort) [FROZEN]        │
│  • Onchain Data (via IOnchainPort) [FROZEN]          │
│  • Sentiment Data (via ISentimentPort) [FROZEN]      │
├──────────────────────────────────────────────────────┤
│  OUTPUTS:                                            │
│  • Unified Accounts API                              │
│  • Influence Scores API                              │
│  • Network Graph API                                 │
│  • Clusters API                                      │
│  • AI Summaries API                                  │
│  • Backers API                                       │
│  • Notifications (via ITelegramPort)                 │
└──────────────────────────────────────────────────────┘
```

---

## Responsibility Matrix

| Component | Connections Module | Host System |
|-----------|-------------------|-------------|
| Twitter Parsing | ✅ Owns | - |
| Influence Scoring | ✅ Owns | - |
| Network Graph | ✅ Owns | - |
| AI Summaries | ✅ Owns | - |
| Price Data | ❌ Consumes | ✅ Provides |
| Exchange Data | ❌ Consumes | ✅ Provides |
| Alert Delivery | ❌ Consumes | ✅ Provides |
| User Auth | ❌ Consumes | ✅ Provides |
