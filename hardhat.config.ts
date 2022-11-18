import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from 'dotenv';
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    alfajores: {
     url: "https://alfajores-forno.celo-testnet.org",
     accounts: {
       mnemonic: process.env.MNEMONIC,
       path: "m/44'/60'/0'/0", // MetaMask wallet
     },
     chainId: 44787
   }
  }
};

export default config;
