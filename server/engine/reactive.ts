import { PublicClient, parseAbi } from "viem";
import { ReactiveEvent } from "../../shared/types";

/**
 * Reactive Engine - Monitors blockchain events and triggers callbacks
 * 
 * This engine simulates Somnia's Reactivity SDK functionality by:
 * 1. Watching for specific event patterns on-chain
 * 2. Matching events to active subscriptions
 * 3. Triggering webhooks with payment processing
 */
export class ReactiveEngine {
  private client: PublicClient;
  private isRunningFlag: boolean = false;
  private watchInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(client: PublicClient) {
    this.client = client;
  }

  /**
   * Start the reactive engine
   */
  start() {
    if (this.isRunningFlag) return;
    
    this.isRunningFlag = true;
    console.log("🔥 Reactive Engine started");

    // Simulate event watching (in production, this would use Somnia's Reactivity SDK)
    this.watchInterval = setInterval(() => {
      this.checkForEvents();
    }, 5000);
  }

  /**
   * Stop the reactive engine
   */
  stop() {
    this.isRunningFlag = false;
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
    console.log("🔥 Reactive Engine stopped");
  }

  /**
   * Check if engine is running
   */
  isRunning(): boolean {
    return this.isRunningFlag;
  }

  /**
   * Subscribe to a specific event type
   */
  subscribeToEvent(eventType: string, callback: Function) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)?.push(callback);
    console.log(`📡 Subscribed to event type: ${eventType}`);
  }

  /**
   * Unsubscribe from an event type
   */
  unsubscribeFromEvent(eventType: string, callback: Function) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Simulate checking for blockchain events
   * In production, this would use Somnia's Reactivity SDK subscriptions
   */
  private async checkForEvents() {
    try {
      const blockNumber = await this.client.getBlockNumber();
      
      // Simulate finding events (in production, query actual events)
      // This is where Somnia's Reactivity SDK would be integrated
      
    } catch (error) {
      console.error("Error checking for events:", error);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  async emitEvent(event: ReactiveEvent) {
    const listeners = this.eventListeners.get(event.eventType);
    
    if (listeners) {
      for (const callback of listeners) {
        try {
          await callback(event);
        } catch (error) {
          console.error(`Error in event callback for ${event.eventType}:`, error);
        }
      }
    }

    // Also emit to wildcard listeners
    const wildcards = this.eventListeners.get("*");
    if (wildcards) {
      for (const callback of wildcards) {
        try {
          await callback(event);
        } catch (error) {
          console.error(`Error in wildcard event callback:`, error);
        }
      }
    }
  }

  /**
   * Get engine stats
   */
  getStats() {
    return {
      isRunning: this.isRunningFlag,
      subscribedEventTypes: Array.from(this.eventListeners.keys()),
      totalListeners: Array.from(this.eventListeners.values()).reduce(
        (sum, arr) => sum + arr.length, 0
      ),
    };
  }
}
