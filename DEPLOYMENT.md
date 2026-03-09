# ReactiveAgentPay Deployment

## Live Service
**URL:** https://clearly-apnic-challenged-parental.trycloudflare.com

## Endpoints

### Health Check
```bash
curl https://clearly-apnic-challenged-parental.trycloudflare.com/health
```

### List Services
```bash
curl https://clearly-apnic-challenged-parental.trycloudflare.com/api/services
```

### Register Service (x402 - $0.001 per request)
```bash
curl -X POST https://clearly-apnic-challenged-parental.trycloudflare.com/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Reactive Service",
    "description": "Description of what this service does",
    "endpoint": "https://my-service.com/api",
    "price": "0.001",
    "reactiveConfig": {
      "eventType": "Transfer",
      "contractAddress": "0x...",
      "filter": {"from": "0x..."}
    }
  }'
```

### Subscribe to Events (x402 - $0.005 per request)
```bash
curl -X POST https://clearly-apnic-challenged-parental.trycloudflare.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "service-id-here",
    "webhookUrl": "https://my-webhook.com/events"
  }'
```

## GitHub Repository
https://github.com/Kubudak90/reactive-agent-pay

## Hackathon Submission
Submitted to: Somnia Reactivity Mini Hackathon on DoraHacks
Prize Pool: $3,000 ($300 per winner)
Deadline: ~10 days remaining
