import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-toolbox";
import "@klaytn/hardhat-utils";
import "@primitivefi/hardhat-dodoc";
import "dotenv/config";

const defaultKey = "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
  networks: {
    baobab: {
      url: process.env.BAOBAB_URL || "https://archive-en.baobab.klaytn.net",
      bundler: "http://13.125.147.214:4337",
      chainId: 1001,
      accounts: [process.env.PRIVATE_KEY || defaultKey],
      live: true,
      saveDeployments: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY || defaultKey],
      live: false,
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: { apiKey: "DUMMY" },
  dodoc: {
    exclude: ["hardhat/", "lib/"],
    runOnCompile: false,
    freshOutput: false,
  },
  paths: {
    deployments: "deployments",
  },
};

export default config;
