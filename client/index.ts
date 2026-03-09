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
    const data = await response.json();
    return data.services;
  }

  /**
   * Get services by event type
   */
  async getServicesByEventType(eventType: string): Promise<ServiceListing[]> {
    const response = await fetch(`${this.config.serverUrl}/api/services/event-type/${eventType}`);
    const data = await response.json();
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

    const data = await response.json();
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
      `${this.config.serverUrl}/api/reactive/user/${this.config.walletAddress}`
    );
    const data = await response.json();
    return data.subscriptions;
  }

  /**
   * Get events for a subscription
   */
  async getEvents(subscriptionId: string): Promise<ReactiveEvent[]> {
    const response = await fetch(
      `${this.config.serverUrl}/api/reactive/events/${subscriptionId}`
    );
    const data = await response.json();
    return data.events;
  }

  /**
   * Process payment for an event (x402 style)
   */
  async processPayment(
    subscriptionId: string,
    eventHash: string,
    amount: string
  ): Promise<PaymentReceipt> {
    const response = await fetch(`${this.config.serverUrl}/api/payment/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId,
        eventHash,
        amount,
        token: "USDC",
      }),
    });

    const data = await response.json();
    return data.receipt;
  }

  /**
   * Check server health
   */
  async healthCheck(): Promise<{ status: string; reactiveEngine: boolean; x402Enabled: boolean }> {
    const response = await fetch(`${this.config.serverUrl}/health`);
    return response.json();
  }
}

// Export for use in other modules
export { ServiceListing, Subscription, ReactiveEvent, PaymentReceipt };
