
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const accounts = {
  mnemonic: process.env.MNEMONIC,
};

module.exports = {
  solidity: "0.8.10",
  etherscan: {
    apiKey: {}
  },
  networks: {},
};