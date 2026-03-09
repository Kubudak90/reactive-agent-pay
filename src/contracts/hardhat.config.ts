// Hardhat configuration for contract deployment
// Install hardhat separately: npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

import * as dotenv from "dotenv";

dotenv.config();

// Simple config object - convert to full Hardhat config when hardhat is installed
const config = {
  solidity: "0.8.19",
  networks: {
    somnia: {
      url: process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network",
      chainId: 50312,
    },
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
    },
  },
};

export default config;
