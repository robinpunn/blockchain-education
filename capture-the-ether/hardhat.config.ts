import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.4.21",
      },
    ],
  },
  mocha: {
    timeout: 1000000,
  },
};

export default config;
