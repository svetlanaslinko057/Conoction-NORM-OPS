/**
 * Connections Module - Port Interfaces
 * 
 * External dependencies accessed ONLY through these ports.
 * No direct imports from host modules allowed.
 * 
 * VERSION: 1.0
 */

// ============================================
// PORT VERSION CONTRACT
// ============================================
export const PORTS_VERSION = '1.0' as const;

export interface PortMetadata {
  version: typeof PORTS_VERSION;
  name: string;
}

// ============================================
// EXCHANGE PORT
// ============================================
export interface IExchangePort extends PortMetadata {
  name: 'exchange';
  
  /**
   * Get funding rate for a symbol
   */
  getFundingRate(symbol: string): Promise<{
    rate: number;
    timestamp: Date;
  } | null>;

  /**
   * Get long/short ratio
   */
  getLongShortRatio(symbol: string): Promise<{
    longRatio: number;
    shortRatio: number;
    timestamp: Date;
  } | null>;

  /**
   * Get volume data
   */
  getVolume(symbol: string, period: '1h' | '4h' | '24h'): Promise<{
    volume: number;
    volumeChange: number;
    timestamp: Date;
  } | null>;

  /**
   * Get open interest
   */
  getOpenInterest(symbol: string): Promise<{
    openInterest: number;
    oiChange: number;
    timestamp: Date;
  } | null>;
}

// ============================================
// ONCHAIN PORT
// ============================================
export interface IOnchainPort extends PortMetadata {
  name: 'onchain';
  
  /**
   * Get whale movements for a token
   */
  getWhaleMovements(token: string, hours: number): Promise<{
    inflows: number;
    outflows: number;
    netFlow: number;
    transactions: number;
  } | null>;

  /**
   * Get holder distribution
   */
  getHolderDistribution(token: string): Promise<{
    top10Pct: number;
    top50Pct: number;
    uniqueHolders: number;
  } | null>;

  /**
   * Get DEX volume
   */
  getDexVolume(token: string, period: '1h' | '24h'): Promise<{
    volume: number;
    trades: number;
  } | null>;
}

// ============================================
// SENTIMENT PORT
// ============================================
export interface ISentimentPort extends PortMetadata {
  name: 'sentiment';
  
  /**
   * Get sentiment score for a token
   */
  getSentimentScore(token: string): Promise<{
    score: number; // -1 to 1
    confidence: number;
    sampleSize: number;
  } | null>;

  /**
   * Get social volume
   */
  getSocialVolume(token: string, hours: number): Promise<{
    mentions: number;
    uniqueAuthors: number;
    engagementTotal: number;
  } | null>;

  /**
   * Get trending status
   */
  getTrendingStatus(token: string): Promise<{
    isTrending: boolean;
    rank: number | null;
    velocity: number;
  } | null>;
}

// ============================================
// PRICE PORT
// ============================================
export interface IPricePort extends PortMetadata {
  name: 'price';
  
  /**
   * Get current price
   */
  getCurrentPrice(symbol: string): Promise<{
    price: number;
    change24h: number;
    timestamp: Date;
  } | null>;

  /**
   * Get price history
   */
  getPriceHistory(symbol: string, hours: number): Promise<{
    prices: Array<{ time: Date; price: number }>;
    high: number;
    low: number;
  } | null>;

  /**
   * Get market cap
   */
  getMarketCap(symbol: string): Promise<{
    marketCap: number;
    fdv: number;
    rank: number;
  } | null>;
}

// ============================================
// TELEGRAM PORT (for notifications)
// ============================================
export interface ITelegramPort extends PortMetadata {
  name: 'telegram';
  
  /**
   * Send message to chat
   */
  sendMessage(chatId: string, message: string): Promise<boolean>;
  
  /**
   * Check if connection exists
   */
  isConnected(chatId: string): Promise<boolean>;
}

// ============================================
// TWITTER PARSER PORT (for raw data access)
// ============================================
export interface ITwitterParserPort extends PortMetadata {
  name: 'twitter_parser';
  
  /**
   * Get parsed tweets
   */
  getParsedTweets(actorId: string, limit: number): Promise<any[]>;
  
  /**
   * Get follow edges
   */
  getFollowEdges(actorId: string): Promise<any[]>;
  
  /**
   * Get follower edges
   */
  getFollowerEdges(actorId: string): Promise<any[]>;
}

// ============================================
// COMBINED PORTS INTERFACE
// ============================================
export interface IConnectionsPorts {
  exchange: IExchangePort;
  onchain: IOnchainPort;
  sentiment: ISentimentPort;
  price: IPricePort;
  telegram?: ITelegramPort;
  twitterParser?: ITwitterParserPort;
}

// ============================================
// NULL IMPLEMENTATIONS (for standalone mode)
// ============================================
export const nullExchangePort: IExchangePort = {
  version: PORTS_VERSION,
  name: 'exchange',
  getFundingRate: async () => null,
  getLongShortRatio: async () => null,
  getVolume: async () => null,
  getOpenInterest: async () => null,
};

export const nullOnchainPort: IOnchainPort = {
  version: PORTS_VERSION,
  name: 'onchain',
  getWhaleMovements: async () => null,
  getHolderDistribution: async () => null,
  getDexVolume: async () => null,
};

export const nullSentimentPort: ISentimentPort = {
  version: PORTS_VERSION,
  name: 'sentiment',
  getSentimentScore: async () => null,
  getSocialVolume: async () => null,
  getTrendingStatus: async () => null,
};

export const nullPricePort: IPricePort = {
  version: PORTS_VERSION,
  name: 'price',
  getCurrentPrice: async () => null,
  getPriceHistory: async () => null,
  getMarketCap: async () => null,
};

export const nullTelegramPort: ITelegramPort = {
  version: PORTS_VERSION,
  name: 'telegram',
  sendMessage: async () => {
    console.warn('[Connections] Telegram port not configured, message not sent');
    return false;
  },
  isConnected: async () => false,
};

export const nullTwitterParserPort: ITwitterParserPort = {
  version: PORTS_VERSION,
  name: 'twitter_parser',
  getParsedTweets: async () => [],
  getFollowEdges: async () => [],
  getFollowerEdges: async () => [],
};

export const nullPorts: IConnectionsPorts = {
  exchange: nullExchangePort,
  onchain: nullOnchainPort,
  sentiment: nullSentimentPort,
  price: nullPricePort,
  telegram: nullTelegramPort,
  twitterParser: nullTwitterParserPort,
};

// ============================================
// PORT VALIDATION
// ============================================
export function validatePort<T extends PortMetadata>(port: T | undefined, portName: string): T {
  if (!port) {
    console.warn(`[Connections] Port '${portName}' not provided, using null implementation`);
    return (nullPorts as any)[portName] as T;
  }
  
  if (port.version !== PORTS_VERSION) {
    console.warn(`[Connections] Port '${portName}' version mismatch: expected ${PORTS_VERSION}, got ${port.version}`);
  }
  
  return port;
}

/**
 * Validate all ports and return safe defaults
 */
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
