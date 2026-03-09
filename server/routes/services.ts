import { Router } from "express";
import { ServiceListing } from "../../shared/types";

const router = Router();

// In-memory service registry for demo
const services: Map<string, ServiceListing> = new Map();

// Get all services
router.get("/", (req, res) => {
  const allServices = Array.from(services.values());
  res.json({
    services: allServices,
    count: allServices.length,
  });
});

// Get service by ID
router.get("/:id", (req, res) => {
  const service = services.get(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json(service);
});

// Register new service
router.post("/register", (req, res) => {
  const { name, description, pricePerEvent, eventTypes, provider, metadata } = req.body;

  if (!name || !description || !pricePerEvent || !eventTypes || !provider) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const service: ServiceListing = {
    id,
    provider,
    name,
    description,
    pricePerEvent,
    eventTypes,
    metadata: metadata || {},
    active: true,
    createdAt: Date.now(),
  };

  services.set(id, service);

  res.status(201).json({
    message: "Service registered successfully",
    service,
  });
});

// Update service
router.put("/:id", (req, res) => {
  const service = services.get(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const { active, pricePerEvent, metadata } = req.body;
  
  if (active !== undefined) service.active = active;
  if (pricePerEvent) service.pricePerEvent = pricePerEvent;
  if (metadata) service.metadata = { ...service.metadata, ...metadata };

  services.set(req.params.id, service);

  res.json({
    message: "Service updated successfully",
    service,
  });
});

// Get services by provider
router.get("/provider/:address", (req, res) => {
  const providerServices = Array.from(services.values()).filter(
    (s) => s.provider.toLowerCase() === req.params.address.toLowerCase()
  );
  
  res.json({
    services: providerServices,
    count: providerServices.length,
  });
});

// Get services by event type
router.get("/event-type/:type", (req, res) => {
  const matchingServices = Array.from(services.values()).filter(
    (s) => s.eventTypes.includes(req.params.type) && s.active
  );
  
  res.json({
    services: matchingServices,
    count: matchingServices.length,
  });
});

export { router as serviceRouter };
