import { defineChain } from "viem";

export const somnia = defineChain({
  id: 50312,
  name: "Somnia",
  network: "somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network"],
    },
    public: {
      http: ["https://dream-rpc.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://explorer.somnia.network",
    },
  },
});
