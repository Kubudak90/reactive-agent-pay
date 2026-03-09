import { Router } from "express";
import { PaymentReceipt } from "../../shared/types";

const router = Router();

// In-memory payment storage
const payments: Map<string, PaymentReceipt> = new Map();

// Process payment (x402 style)
router.post("/process", async (req, res) => {
  const { subscriptionId, eventHash, amount, token } = req.body;

  if (!subscriptionId || !eventHash || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const receipt: PaymentReceipt = {
    subscriptionId,
    eventHash,
    amount,
    token: token || "USDC",
    timestamp: Date.now(),
  };

  payments.set(paymentId, receipt);

  // In a real implementation, this would:
  // 1. Verify the payment signature
  // 2. Transfer USDC from subscriber to service provider
  // 3. Update subscription balance

  res.status(201).json({
    message: "Payment processed successfully",
    paymentId,
    receipt,
  });
});

// Get payment by ID
router.get("/:id", (req, res) => {
  const payment = payments.get(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.json(payment);
});

// Get payments for subscription
router.get("/subscription/:subscriptionId", (req, res) => {
  const subPayments = Array.from(payments.values()).filter(
    (p) => p.subscriptionId === req.params.subscriptionId
  );

  res.json({
    payments: subPayments,
    count: subPayments.length,
    totalAmount: subPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toString(),
  });
});

// Get total volume
router.get("/stats/volume", (req, res) => {
  const allPayments = Array.from(payments.values());
  const totalVolume = allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  res.json({
    totalPayments: allPayments.length,
    totalVolume: totalVolume.toString(),
    uniqueSubscriptions: new Set(allPayments.map(p => p.subscriptionId)).size,
  });
});

export { router as paymentRouter };
