# Connections Module - Ports Interface

## Version: 1.0 (FROZEN)
## Last Updated: 2026-02-12

---

## Port Architecture

Connections Module communicates with host system **ONLY through Ports**.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HOST APPLICATION                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ExchangeService    PriceService    OnchainService    etc.          │
└────────┬───────────────┬────────────────┬───────────────────────────┘
         │               │                │
         │  Port Adapters (created by host)
         │               │                │
         ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PORT INTERFACES                                   │
├─────────────────────────────────────────────────────────────────────┤
│  IExchangePort     IPricePort     IOnchainPort    ISentimentPort    │
└────────┬───────────────┬────────────────┬───────────────────────────┘
         │               │                │
         │  Used by Connections Module
         │               │                │
         ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 CONNECTIONS MODULE                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Import Rules

### ✅ ALLOWED

```typescript
// Import port interfaces
import { IExchangePort, IPricePort } from './ports/index.js';

// Import from within module
import { UnifiedService } from './unified/unified.service.js';
import { COLLECTIONS } from './config/connections.config.js';

// Import shared utilities
import { getMongoDb } from '../../db/mongoose.js';
import type { Db } from 'mongodb';
import type { FastifyInstance } from 'fastify';
```

### ❌ FORBIDDEN

```typescript
// Direct imports from host modules
import { ExchangeService } from '../../exchange';
import { MainBrain } from '../../brain';
import { MacroAnalyzer } from '../../macro';

// Direct access to host config
import { hostConfig } from '../../config/host.config';

// Direct access to host state
import { globalState } from '../../state/global.state';
```

---

## Port Definitions

### IExchangePort (FROZEN)

```typescript
export interface IExchangePort extends PortMetadata {
  name: 'exchange';
  
  getFundingRate(symbol: string): Promise<{
    rate: number;
    timestamp: Date;
  } | null>;

  getLongShortRatio(symbol: string): Promise<{
    longRatio: number;
    shortRatio: number;
    timestamp: Date;
  } | null>;

  getVolume(symbol: string, period: '1h' | '4h' | '24h'): Promise<{
    volume: number;
    volumeChange: number;
    timestamp: Date;
  } | null>;

  getOpenInterest(symbol: string): Promise<{
    openInterest: number;
    oiChange: number;
    timestamp: Date;
  } | null>;
}
```

### IOnchainPort (FROZEN)

```typescript
export interface IOnchainPort extends PortMetadata {
  name: 'onchain';
  
  getWhaleMovements(token: string, hours: number): Promise<{
    inflows: number;
    outflows: number;
    netFlow: number;
    transactions: number;
  } | null>;

  getHolderDistribution(token: string): Promise<{
    top10Pct: number;
    top50Pct: number;
    uniqueHolders: number;
  } | null>;

  getDexVolume(token: string, period: '1h' | '24h'): Promise<{
    volume: number;
    trades: number;
  } | null>;
}
```

### ISentimentPort (FROZEN)

```typescript
export interface ISentimentPort extends PortMetadata {
  name: 'sentiment';
  
  getSentimentScore(token: string): Promise<{
    score: number; // -1 to 1
    confidence: number;
    sampleSize: number;
  } | null>;

  getSocialVolume(token: string, hours: number): Promise<{
    mentions: number;
    uniqueAuthors: number;
    engagementTotal: number;
  } | null>;

  getTrendingStatus(token: string): Promise<{
    isTrending: boolean;
    rank: number | null;
    velocity: number;
  } | null>;
}
```

### IPricePort (FROZEN)

```typescript
export interface IPricePort extends PortMetadata {
  name: 'price';
  
  getCurrentPrice(symbol: string): Promise<{
    price: number;
    change24h: number;
    timestamp: Date;
  } | null>;

  getPriceHistory(symbol: string, hours: number): Promise<{
    prices: Array<{ time: Date; price: number }>;
    high: number;
    low: number;
  } | null>;

  getMarketCap(symbol: string): Promise<{
    marketCap: number;
    fdv: number;
    rank: number;
  } | null>;
}
```

### ITelegramPort (Optional)

```typescript
export interface ITelegramPort extends PortMetadata {
  name: 'telegram';
  
  sendMessage(chatId: string, message: string): Promise<boolean>;
  isConnected(chatId: string): Promise<boolean>;
}
```

### ITwitterParserPort (Optional)

```typescript
export interface ITwitterParserPort extends PortMetadata {
  name: 'twitter_parser';
  
  getParsedTweets(actorId: string, limit: number): Promise<any[]>;
  getFollowEdges(actorId: string): Promise<any[]>;
  getFollowerEdges(actorId: string): Promise<any[]>;
}
```

---

## Null Implementations

When port not provided, null implementation is used:

```typescript
export const nullExchangePort: IExchangePort = {
  version: PORTS_VERSION,
  name: 'exchange',
  getFundingRate: async () => null,
  getLongShortRatio: async () => null,
  getVolume: async () => null,
  getOpenInterest: async () => null,
};
```

---

## Port Adapter Creation (Host Side)

```typescript
// Host creates adapters that wrap real services
const ports = {
  exchange: createExchangePort(hostExchangeService),
  price: createPricePort(hostPriceService),
  onchain: createOnchainPort(hostOnchainService),
  sentiment: createSentimentPort(hostSentimentService),
  telegram: createTelegramPort(hostTelegramService),
};

// Register module with ports
await registerConnectionsModule(app, { db, ports });
```

---

## Validation

Ports are validated on module registration:

```typescript
export function validatePorts(ports: Partial<IConnectionsPorts> = {}): IConnectionsPorts {
  return {
    exchange: validatePort(ports.exchange, 'exchange'),
    onchain: validatePort(ports.onchain, 'onchain'),
    sentiment: validatePort(ports.sentiment, 'sentiment'),
    price: validatePort(ports.price, 'price'),
    telegram: validatePort(ports.telegram, 'telegram'),
    twitterParser: validatePort(ports.twitterParser, 'twitterParser'),
  };
}
```

---

## Known Violations (TO FIX BEFORE MERGE)

The following imports violate port isolation:

```typescript
// ❌ Direct imports found:
import { checkDataAvailability } from '../../../twitter-live/twitterLive.reader.js';
import { AlertCandidate } from '../../../alerts/alert-policy.engine.js';
import { sendTelegramMessage } from '../../../core/notifications/telegram.service.js';
import { TAXONOMY_GROUPS } from '../../taxonomy/taxonomy.constants.js';
```

**Resolution:** Create port interfaces or move shared types to common package.
