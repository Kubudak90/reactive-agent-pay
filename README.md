# ReactiveAgentPay

A reactive AI agent service marketplace combining Somnia Reactivity SDK with x402 micropayments.

## Overview

ReactiveAgentPay enables AI agents to:
- **Publish** reactive services that trigger on blockchain events
- **Subscribe** to services and receive real-time notifications
- **Pay** per event using x402 micropayments (USDC on Base)

## Features

- ⚡ **Reactive Events**: Real-time blockchain event subscriptions via Somnia Reactivity
- 💰 **Micropayments**: Pay-per-use with x402 protocol (USDC on Base)
- 🤖 **Agent-Native**: Built for autonomous AI agents
- 🔍 **Service Discovery**: Browse and filter available reactive services
- 📊 **Analytics**: Track service usage and revenue

## Quick Start

### Installation

```bash
npm install
```

### Start the Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Run Demos

**Consumer Agent Demo:**
```bash
npm run demo:consumer
```

**Provider Agent Demo:**
```bash
npm run demo:provider
```

## API Endpoints

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| POST | `/api/services` | Create a new service |
| GET | `/api/services/:id` | Get service details |
| GET | `/api/services/provider/:address` | Get provider's services |
| GET | `/api/services/:id/stats` | Get service statistics |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscriptions` | Subscribe to a service |
| DELETE | `/api/subscriptions/:id` | Unsubscribe |
| GET | `/api/subscriptions/:id/events` | Get subscription events |
| POST | `/api/subscriptions/:id/pay` | Process payment |

### Reactive Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reactive/trigger` | Trigger a reactive event |
| GET | `/api/reactive/subscriptions/:eventType` | Get subscriptions for event type |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Provider Agent │────▶│ Reactive Service │────▶│  x402 Payment   │
│  (Creates       │     │  (Somnia +       │     │  (USDC/Base)    │
│   Services)     │     │   x402)          │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Consumer Agents  │
                        │ (Subscribe & Pay)│
                        └──────────────────┘
```

## Use Cases

1. **DeFi Monitoring**: Get notified of liquidation opportunities, price movements
2. **NFT Tracking**: Monitor mints, sales, and transfers
3. **DAO Governance**: Track proposals and voting periods
4. **Smart Contract Events**: Subscribe to any on-chain event

## Tech Stack

- **Somnia Reactivity SDK**: Real-time event subscriptions
- **x402 Protocol**: Micropayments over HTTP
- **Base Blockchain**: USDC payments
- **TypeScript**: Type-safe development

## Hackathon Submission

**Event**: Somnia Reactivity Mini Hackathon  
**Track**: Reactivity  
**Prize**: $300 USDC per winner

## License

MIT
