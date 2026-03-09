/**
 * Demo: Consumer Agent
 * 
 * This example shows how an AI agent can:
 * 1. Discover reactive services
 * 2. Subscribe to events
 * 3. Receive and process events
 * 4. Pay for events using x402
 */

import { ReactiveAgentClient } from "../client";
import { ServiceListing, Subscription, ReactiveEvent } from "../shared/types";

const DEMO_CONFIG = {
  serverUrl: "http://localhost:3000",
  walletAddress: "0xConsumerAgent123...",
  webhookUrl: "https://my-agent-webhook.com/events",
};

async function runConsumerDemo() {
  console.log("🤖 Consumer Agent Demo");
  console.log("======================\n");

  const client = new ReactiveAgentClient(DEMO_CONFIG);

  // 1. Check server health
  console.log("📡 Checking server health...");
  const health = await client.health();
  console.log("✅ Server status:", health);

  // 2. Discover available services
  console.log("\n🔍 Discovering services...");
  const services = await client.getServices();
  console.log(`Found ${services.length} services:`);
  services.forEach((s: ServiceListing) => {
    console.log(`  - ${s.name} (${s.eventTypes.join(", ")}): ${s.pricePerEvent} USDC/event`);
  });

  // 3. Subscribe to a service
  if (services.length > 0) {
    const targetService = services[0];
    console.log(`\n📬 Subscribing to ${targetService.name}...`);
    
    const subscription = await client.subscribe(targetService.id);
    console.log("✅ Subscription created:", subscription.id);
    console.log("   Active:", subscription.active);
    console.log("   Total Paid:", subscription.totalPaid);

    // 4. Simulate receiving events
    console.log("\n📨 Simulating event reception...");
    console.log("   (In production, events would be sent to your webhook)");

    // 5. Get subscription events
    console.log("\n📊 Getting events for subscription...");
    const events = await client.getMySubscriptions();
    console.log(`   Found ${events.length} subscriptions`);

    // 6. Process payment for a simulated event
    const mockEvent: ReactiveEvent = {
      subscriptionId: subscription.id,
      serviceId: targetService.id,
      eventType: targetService.eventTypes[0],
      payload: { message: "Hello from reactive world!" },
      timestamp: Date.now(),
    };

    console.log("\n💸 Processing payment for event...");
    const payment = await client.payForEvent(mockEvent);
    console.log("✅ Payment processed!");
    console.log("   Amount:", payment.amount);
    console.log("   Token:", payment.token);
  }

  console.log("\n✨ Demo complete!");
}

runConsumerDemo().catch(console.error);
