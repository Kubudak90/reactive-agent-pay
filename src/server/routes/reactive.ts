import { Router } from "express";
import { ReactiveEvent, Subscription } from "../../shared/types";

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
router.get("/user/:address", (req, res) => {
  const userSubs = Array.from(subscriptions.values()).filter(
    (s) => s.subscriber.toLowerCase() === req.params.address.toLowerCase()
  );

  res.json({
    subscriptions: userSubs,
    count: userSubs.length,
  });
});

// Emit event (called by reactive engine)
router.post("/emit", async (req, res) => {
  const { serviceId, eventType, payload } = req.body;

  // Find all active subscriptions for this service
  const serviceSubs = Array.from(subscriptions.values()).filter(
    (s) => s.serviceId === serviceId && s.active
  );

  const eventPromises = serviceSubs.map(async (sub) => {
    const event: ReactiveEvent = {
      subscriptionId: sub.id,
      serviceId,
      eventType,
      payload,
      timestamp: Date.now(),
    };

    // Store event
    const subEvents = events.get(sub.id) || [];
    subEvents.push(event);
    events.set(sub.id, subEvents);

    // Update subscription stats
    sub.totalEventsReceived++;
    subscriptions.set(sub.id, sub);

    // Send webhook to callback URL
    try {
      await fetch(sub.callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error(`Failed to send webhook to ${sub.callbackUrl}:`, error);
    }

    return event;
  });

  const emittedEvents = await Promise.all(eventPromises);

  res.json({
    message: `Emitted ${emittedEvents.length} events`,
    events: emittedEvents,
  });
});

// Get events for subscription
router.get("/events/:subscriptionId", (req, res) => {
  const subEvents = events.get(req.params.subscriptionId) || [];
  res.json({
    events: subEvents,
    count: subEvents.length,
  });
});

export { router as reactiveRouter, subscriptions, events };
