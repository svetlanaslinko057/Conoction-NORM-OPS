# Connections Module - Architecture Diagram

## Version: 3.2.0
## Last Updated: 2026-02-12

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL INPUTS                              │
├─────────────────────────────────────────────────────────────────────┤
│  Twitter Data       Price Data       Exchange Data    Onchain Data  │
│  (Parsed)           (IPricePort)     (IExchangePort)  (IOnchainPort)│
└────────┬───────────────┬────────────────┬────────────────┬──────────┘
         │               │                │                │
         ▼               ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PORT ADAPTERS LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  ITwitterParserPort    IPricePort    IExchangePort    IOnchainPort  │
│  (Active)              (Active)      (Frozen)         (Frozen)      │
└────────┬───────────────┬────────────────────────────────────────────┘
         │               │
         ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CORE PROCESSING LAYER                            │
├──────────────────┬──────────────────┬───────────────────────────────┤
│                  │                  │                               │
│  NETWORK         │  SCORING         │  AI LAYER                     │
│  ANALYSIS        │  ENGINE          │                               │
│                  │                  │                               │
│  ┌────────────┐  │  ┌────────────┐  │  ┌─────────────────────────┐  │
│  │Follow Graph│  │  │Twitter     │  │  │OpenAI gpt-4o-mini       │  │
│  │Builder     │  │  │Score       │  │  │                         │  │
│  └─────┬──────┘  │  │Calculator  │  │  │Verdict Generation       │  │
│        │         │  └─────┬──────┘  │  │Key Drivers              │  │
│        ▼         │        │         │  │Recommendations          │  │
│  ┌────────────┐  │        ▼         │  └─────────────────────────┘  │
│  │Hops-to-    │  │  ┌────────────┐  │                               │
│  │Elite Calc  │  │  │Authority   │  │                               │
│  └─────┬──────┘  │  │Score       │  │                               │
│        │         │  │(Network +  │  │                               │
│        ▼         │  │Engagement +│  │                               │
│  ┌────────────┐  │  │Consistency)│  │                               │
│  │Cluster     │  │  └─────┬──────┘  │                               │
│  │Extraction  │  │        │         │                               │
│  └─────┬──────┘  │        ▼         │                               │
│        │         │  ┌────────────┐  │                               │
│        ▼         │  │Smart       │  │                               │
│  ┌────────────┐  │  │Followers   │  │                               │
│  │Co-engage-  │  │  │Ratio       │  │                               │
│  │ment Graph  │  │  └────────────┘  │                               │
│  └────────────┘  │                  │                               │
└──────────────────┴──────────────────┴───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        STORAGE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  connections_unified_accounts    connections_clusters               │
│  connections_follow_graph        connections_verdicts               │
│  connections_backers             connections_ai_summaries           │
│  connections_events              connections_taxonomy_groups        │
│  ... (40+ collections)                                              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│  /api/connections/unified      /api/connections/clusters            │
│  /api/connections/ai/summary   /api/connections/graph               │
│  /api/connections/backers      /api/connections/opportunities       │
│  /api/admin/connections/*                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Influencers Page         Full Analytics Page                       │
│  ├─ Account Cards         ├─ Trend Dynamics Chart                   │
│  ├─ Filters/Search        ├─ Early Signal Display                   │
│  └─ Pagination            ├─ AI Analysis Panel                      │
│                           ├─ Network Paths                          │
│  Clusters Page            └─ Risk Assessment                        │
│  ├─ Cluster Cards                                                   │
│  └─ Member Lists          Graph Page                                │
│                           ├─ Force-directed Graph                   │
│  Alt Season Monitor       └─ Node Details                           │
│  ├─ Opportunities                                                   │
│  └─ Zone Activity         Backers Page                              │
│                           ├─ Backer Cards                           │
│  Lifecycle Page           └─ Bindings                               │
│  └─ Asset Stages                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Twitter Parsing → AI Summary

```
Twitter Parser V2 (Port 5001)
        │
        │ POST /profile, /tweets, /following
        ▼
┌──────────────────┐
│ Raw Twitter Data │
│ - username       │
│ - followers      │
│ - tweets         │
│ - following list │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Unified Account  │
│ Builder          │
│ - normalize      │
│ - enrich         │
│ - score          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Network Analysis │
│ - build graph    │
│ - calc hops      │
│ - find clusters  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scoring Engine   │
│ - twitter_score  │
│ - authority      │
│ - smart_followers│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ AI Summary       │
│ (OpenAI)         │
│ - verdict        │
│ - key_drivers    │
│ - recommendations│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Frontend Display │
│ - Full Analytics │
│ - AI Panel       │
└──────────────────┘
```

---

## Module Registration Flow

```
Host Application
        │
        │ registerConnectionsModule(app, { db, ports, config })
        ▼
┌──────────────────────────────────────────────────────────────┐
│ MODULE INITIALIZATION                                         │
├──────────────────────────────────────────────────────────────┤
│ 1. Validate config (enabled?)                                │
│ 2. Store DB reference                                        │
│ 3. Validate ports (version check)                            │
│ 4. Register routes:                                          │
│    - /api/connections/* (unified, clusters, ai, etc.)        │
│    - /api/admin/connections/* (backers, network, etc.)       │
│ 5. Start background jobs (if configured)                     │
│ 6. Mark initialized = true                                   │
└──────────────────────────────────────────────────────────────┘
        │
        │ unregisterConnectionsModule(app)
        ▼
┌──────────────────────────────────────────────────────────────┐
│ MODULE CLEANUP                                               │
├──────────────────────────────────────────────────────────────┤
│ 1. Stop background jobs                                      │
│ 2. Clear state                                               │
│ 3. Mark initialized = false                                  │
│ 4. Routes remain registered (Fastify limitation)             │
└──────────────────────────────────────────────────────────────┘
```
