import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy")
require("hardhat-gas-reporter");
require("solidity-coverage");

dotenv.config();
let accounts: string[] = [];

if (process.env.PRIVATE_KEY) {
  accounts.push(process.env.PRIVATE_KEY);
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    //outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "MATIC"
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL,
      accounts
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts
    },
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_RPC_URL,
      accounts
    }
  }
};

export default config;