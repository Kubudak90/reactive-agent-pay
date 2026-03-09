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
  const health = await client.healthCheck();
  console.log("✅ Server status:", health);

  // 2. Discover available services
  console.log("\n🔍 Discovering services...");
  const services = await client.getServices();
  console.log(`Found ${services.length} services:`);
  services.forEach(s => {
    console.log(`  - ${s.name} (${s.eventType}): ${s.pricePerEvent} USDC/event`);
  });

  // 3. Subscribe to a service
  if (services.length > 0) {
    const targetService = services[0];
    console.log(`\n📬 Subscribing to ${targetService.name}...`);
    
    const subscription = await client.subscribe(targetService.id);
    console.log("✅ Subscription created:", subscription.id);
    console.log("   Status:", subscription.status);
    console.log("   Price:", subscription.pricePerEvent, "USDC/event");

    // 4. Simulate receiving events
    console.log("\n📨 Simulating event reception...");
    console.log("   (In production, events would be sent to your webhook)");

    // 5. Get subscription events
    console.log("\n📊 Getting events for subscription...");
    const events = await client.getEvents(subscription.id);
    console.log(`   Received ${events.length} events`);

    // 6. Process payment for an event
    if (events.length > 0) {
      const event = events[0];
      console.log("\n💸 Processing payment for event...");
      const receipt = await client.processPayment(
        subscription.id,
        event.eventHash,
        subscription.pricePerEvent
      );
      console.log("✅ Payment processed:", receipt.paymentId);
    }

    // 7. Unsubscribe
    console.log("\n🚫 Unsubscribing...");
    await client.unsubscribe(subscription.id);
    console.log("✅ Unsubscribed successfully");
  }

  console.log("\n✨ Demo complete!");
}

// Run if executed directly
if (require.main === module) {
  runConsumerDemo().catch(console.error);
}

export { runConsumerDemo };
