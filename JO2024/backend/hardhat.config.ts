import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();
let accounts: string[] = [];

if (process.env.PRIVATE_KEY3) {
  accounts.push(process.env.PRIVATE_KEY3);
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
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "MATIC"
  },
  networks: {
    hardhat: {
      //url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY,
          balance: '10000000000000000000000'
        },
        {
          privateKey: process.env.PRIVATE_KEY2,
          balance: '20000000000000000000000'
        },
        {
          privateKey: process.env.PRIVATE_KEY3,
          balance: '30000000000000000000000'
        }
      ],
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