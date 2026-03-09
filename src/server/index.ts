import express from "express";
import cors from "cors";
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { somnia } from "./chains/somnia.js";
import { reactiveRouter } from "./routes/reactive.js";
import { paymentRouter } from "./routes/payment.js";
import { serviceRouter } from "./routes/services.js";
import { ReactiveEngine } from "./engine/reactive.js";
import { X402PaymentHandler } from "./payments/x402.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize clients
const publicClient = createPublicClient({
  chain: somnia,
  transport: http(process.env.SOMNIA_RPC_URL),
});

// Initialize reactive engine
const reactiveEngine = new ReactiveEngine(publicClient);

// Initialize x402 payment handler
const x402Handler = new X402PaymentHandler();

// Routes
app.use("/api/reactive", reactiveRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/services", serviceRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    reactiveEngine: reactiveEngine.isRunning(),
    x402Enabled: x402Handler.isEnabled(),
  });
});

// Get blockchain info
app.get("/api/chain-info", async (req, res) => {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    const chainId = await publicClient.getChainId();
    
    res.json({
      chainId,
      blockNumber: blockNumber.toString(),
      rpcUrl: process.env.SOMNIA_RPC_URL,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chain info" });
  }
});

// Start reactive engine
reactiveEngine.start();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Reactive Agent Marketplace Server running on port ${PORT}`);
  console.log(`🔗 Connected to Somnia network`);
  console.log(`💰 x402 micropayments enabled`);
});

export { reactiveEngine, x402Handler };
