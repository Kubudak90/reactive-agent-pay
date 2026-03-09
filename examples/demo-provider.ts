/**
 * Demo: Provider Agent
 * 
 * This example shows how an AI agent can:
 * 1. Create a reactive service
 * 2. List it on the marketplace
 * 3. Receive payments for events
 */

import fetch from "node-fetch";

const DEMO_CONFIG = {
  serverUrl: "http://localhost:3000",
  providerAddress: "0xProviderAgent456...",
};

async function runProviderDemo() {
  console.log("🏪 Provider Agent Demo");
  console.log("======================\n");

  // 1. Create a new service
  console.log("📝 Creating new reactive service...");
  
  const newService = {
    name: "DeFi Liquidation Monitor",
    description: "Get notified when liquidation opportunities appear on Aave",
    eventType: "LIQUIDATION_OPPORTUNITY",
    pricePerEvent: "0.01",
    provider: DEMO_CONFIG.providerAddress,
    metadata: {
      protocol: "Aave",
      chain: "base",
      minHealthFactor: "1.1",
    },
  };

  const createResponse = await fetch(`${DEMO_CONFIG.serverUrl}/api/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newService),
  });

  const service = await createResponse.json();
  console.log("✅ Service created:", service.id);
  console.log("   Name:", service.name);
  console.log("   Price:", service.pricePerEvent, "USDC/event");

  // 2. List all services by this provider
  console.log("\n📋 Listing my services...");
  const servicesResponse = await fetch(
    `${DEMO_CONFIG.serverUrl}/api/services/provider/${DEMO_CONFIG.providerAddress}`
  );
  const myServices = await servicesResponse.json();
  console.log(`Found ${myServices.services.length} services`);

  // 3. Simulate an event being triggered
  console.log("\n⚡ Triggering reactive event...");
  const eventData = {
    serviceId: service.id,
    eventType: "LIQUIDATION_OPPORTUNITY",
    data: {
      user: "0xUser789...",
      collateralAsset: "ETH",
      debtAsset: "USDC",
      debtToCover: "5000",
      healthFactor: "1.05",
    },
  };

  const eventResponse = await fetch(`${DEMO_CONFIG.serverUrl}/api/reactive/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  const eventResult = await eventResponse.json();
  console.log("✅ Event triggered:", eventResult.eventHash);
  console.log("   Subscribers notified:", eventResult.notifiedCount);
  console.log("   Total payments:", eventResult.totalPayments, "USDC");

  // 4. Get service stats
  console.log("\n📊 Getting service stats...");
  const statsResponse = await fetch(`${DEMO_CONFIG.serverUrl}/api/services/${service.id}/stats`);
  const stats = await statsResponse.json();
  console.log("   Total subscribers:", stats.totalSubscribers);
  console.log("   Total events:", stats.totalEvents);
  console.log("   Total revenue:", stats.totalRevenue, "USDC");

  console.log("\n✨ Demo complete!");
}

// Run if executed directly
if (require.main === module) {
  runProviderDemo().catch(console.error);
}

export { runProviderDemo };
