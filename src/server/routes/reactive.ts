import { Router } from "express";
import { ReactiveEvent, Subscription } from "../../shared/types.js";

const router = Router();

// In-memory storage for demo
const subscriptions: Map<string, Subscription> = new Map();
const events: Map<string, ReactiveEvent[]> = new Map();

// Create subscription
router.post("/subscribe", (req, res) => {
  const { serviceId, subscriber, callbackUrl } = req.body;

  if (!serviceId || !subscriber || !callbackUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const subscription: Subscription = {
    id,
    serviceId,
    subscriber,
    callbackUrl,
    active: true,
    subscribedAt: Date.now(),
    totalEventsReceived: 0,
    totalPaid: "0",
  };

  subscriptions.set(id, subscription);
  events.set(id, []);

  res.status(201).json({
    message: "Subscription created successfully",
    subscription,
  });
});

// Cancel subscription
router.post("/unsubscribe/:id", (req, res) => {
  const subscription = subscriptions.get(req.params.id);
  if (!subscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  subscription.active = false;
  subscriptions.set(req.params.id, subscription);

  res.json({
    message: "Subscription cancelled successfully",
    subscription,
  });
});

// Get subscription
router.get("/subscription/:id", (req, res) => {
  const subscription = subscriptions.get(req.params.id);
  if (!subscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  res.json(subscription);
});

// Get user subscriptions
router.get("/subscriptions/:address", (req, res) => {
  const userSubs = Array.from(subscriptions.values()).filter(
    (s) => s.subscriber.toLowerCase() === req.params.address.toLowerCase()
  );

  res.json({
    subscriptions: userSubs,
  });
});

// Trigger event (called by reactive engine)
router.post("/trigger", async (req, res) => {
  const { serviceId, eventType, payload } = req.body;

  // Find active subscriptions for this service
  const serviceSubs = Array.from(subscriptions.values()).filter(
    (s) => s.serviceId === serviceId && s.active
  );

  const event: ReactiveEvent = {
    subscriptionId: "",
    serviceId,
    eventType,
    payload,
    timestamp: Date.now(),
  };

  // Emit to all subscribers
  let notifiedCount = 0;
  for (const sub of serviceSubs) {
    try {
      // In production, this would call the webhook
      // await fetch(sub.callbackUrl, { method: "POST", body: JSON.stringify(event) });
      
      // Track event
      const subEvents = events.get(sub.id) || [];
      subEvents.push({ ...event, subscriptionId: sub.id });
      events.set(sub.id, subEvents);
      
      // Update subscription stats
      sub.totalEventsReceived++;
      subscriptions.set(sub.id, sub);
      
      notifiedCount++;
    } catch (error) {
      console.error(`Failed to emit to ${sub.callbackUrl}:`, error);
    }
  }

  res.json({
    triggered: true,
    subscribersNotified: notifiedCount,
  });
});

export { router as reactiveRouter };
