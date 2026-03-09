/**
 * Demo: Provider Agent
 * 
 * This example shows how an AI agent can:
 * 1. Create a reactive service
 * 2. List it on the marketplace
 * 3. Receive payments for events
 */

import fetch from "node-fetch";
import { ServiceListing } from "../shared/types";

const DEMO_CONFIG = {
  serverUrl: "http://localhost:3000",
  providerAddress: "0xProviderAgent456...",
};

interface ServiceResponse {
  service: ServiceListing;
}

interface ServicesResponse {
  services: ServiceListing[];
}

async function runProviderDemo() {
  console.log("🏪 Provider Agent Demo");
  console.log("======================\n");

  // 1. Create a new service
  console.log("📝 Creating new reactive service...");
  
  const newService = {
    name: "DeFi Liquidation Monitor",
    description: "Get notified when liquidation opportunities appear on Aave",
    eventTypes: ["LIQUIDATION_OPPORTUNITY"],
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

  const data = await createResponse.json() as ServiceResponse;
  const service = data.service;
  console.log("✅ Service created:", service.id);
  console.log("   Name:", service.name);
  console.log("   Price:", service.pricePerEvent, "USDC/event");

  // 2. List all services by this provider
  console.log("\n📋 Listing my services...");
  const servicesResponse = await fetch(
    `${DEMO_CONFIG.serverUrl}/api/services/provider/${DEMO_CONFIG.providerAddress}`
  );
  const servicesData = await servicesResponse.json() as ServicesResponse;
  const myServices = servicesData.services;
  console.log(`Found ${myServices.length} services`);
  myServices.forEach((s: ServiceListing) => {
    console.log(`  - ${s.name}: ${s.active ? "active" : "inactive"}`);
  });

  // 3. Simulate an event being triggered
  console.log("\n⚡ Triggering reactive event...");
  const eventData = {
    serviceId: service.id,
    eventType: "LIQUIDATION_OPPORTUNITY",
    payload: {
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

  const eventResult = await eventResponse.json() as { triggered: boolean; subscribersNotified: number };
  console.log("✅ Event triggered!");
  console.log("   Subscribers notified:", eventResult.subscribersNotified);

  console.log("\n✨ Demo complete!");
}

runProviderDemo().catch(console.error);
