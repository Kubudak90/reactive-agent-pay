// Shared types for Reactive Agent Marketplace

export interface ServiceListing {
  id: string;
  provider: string;
  name: string;
  description: string;
  pricePerEvent: string; // in wei or smallest unit
  eventTypes: string[];
  metadata?: Record<string, any>;
  active: boolean;
  createdAt: number;
}

export interface Subscription {
  id: string;
  serviceId: string;
  subscriber: string;
  callbackUrl: string;
  active: boolean;
  subscribedAt: number;
  totalEventsReceived: number;
  totalPaid: string;
}

export interface ReactiveEvent {
  subscriptionId: string;
  serviceId: string;
  eventType: string;
  payload: any;
  timestamp: number;
  blockNumber?: number;
  transactionHash?: string;
}

export interface PaymentReceipt {
  subscriptionId: string;
  eventHash: string;
  amount: string;
  token: string;
  timestamp: number;
}

export interface AgentIdentity {
  address: string;
  name?: string;
  capabilities: string[];
  reputation: number;
}
