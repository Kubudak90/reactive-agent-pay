/**
 * Reactive Agent Marketplace - Client SDK
 * 
 * This SDK allows AI agents to:
 * 1. Discover and subscribe to reactive services
 * 2. Receive real-time events via webhooks
 * 3. Pay for events using x402 micropayments
 */

import { ServiceListing, Subscription, ReactiveEvent, PaymentReceipt } from "../shared/types";

export interface ClientConfig {
  serverUrl: string;
  walletAddress: string;
  webhookUrl?: string;
}

interface ServicesResponse {
  services: ServiceListing[];
}

interface SubscriptionResponse {
  subscription: Subscription;
}

interface SubscriptionsResponse {
  subscriptions: Subscription[];
}

interface PaymentResponse {
  payment: PaymentReceipt;
}

interface HealthResponse {
  status: string;
  reactiveEngine: boolean;
  x402Enabled: boolean;
}

export class ReactiveAgentClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Get all available services
   */
  async getServices(): Promise<ServiceListing[]> {
    const response = await fetch(`${this.config.serverUrl}/api/services`);
    const data = await response.json() as ServicesResponse;
    return data.services;
  }

  /**
   * Get services by event type
   */
  async getServicesByEventType(eventType: string): Promise<ServiceListing[]> {
    const response = await fetch(`${this.config.serverUrl}/api/services/event-type/${eventType}`);
    const data = await response.json() as ServicesResponse;
    return data.services;
  }

  /**
   * Subscribe to a service
   */
  async subscribe(serviceId: string, callbackUrl?: string): Promise<Subscription> {
    const response = await fetch(`${this.config.serverUrl}/api/reactive/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        subscriber: this.config.walletAddress,
        callbackUrl: callbackUrl || this.config.webhookUrl,
      }),
    });

    const data = await response.json() as SubscriptionResponse;
    return data.subscription;
  }

  /**
   * Cancel a subscription
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    await fetch(`${this.config.serverUrl}/api/reactive/unsubscribe/${subscriptionId}`, {
      method: "POST",
    });
  }

  /**
   * Get user's subscriptions
   */
  async getMySubscriptions(): Promise<Subscription[]> {
    const response = await fetch(
      `${this.config.serverUrl}/api/reactive/subscriptions/${this.config.walletAddress}`
    );
    const data = await response.json() as SubscriptionsResponse;
    return data.subscriptions;
  }

  /**
   * Pay for a reactive event using x402
   */
  async payForEvent(event: ReactiveEvent): Promise<PaymentReceipt> {
    const response = await fetch(`${this.config.serverUrl}/api/payments/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId: event.subscriptionId,
        eventHash: this.hashEvent(event),
      }),
    });

    const data = await response.json() as PaymentResponse;
    return data.payment;
  }

  /**
   * Check server health
   */
  async health(): Promise<HealthResponse> {
    const response = await fetch(`${this.config.serverUrl}/health`);
    const data = await response.json() as HealthResponse;
    return data;
  }

  private hashEvent(event: ReactiveEvent): string {
    // Simple hash for demo purposes
    return `${event.subscriptionId}-${event.timestamp}`;
  }
}

export default ReactiveAgentClient;
