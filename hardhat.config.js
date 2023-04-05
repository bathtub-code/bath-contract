
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


const accounts = {
  mnemonic: process.env.MNEMONIC,
};

module.exports = {
  solidity: "0.8.10",
  etherscan: {
    apiKey: {
      
      goerli:'F8FWDHPJ3AY1KNUTSZHFSTNXNWKWU67EEB',
      ftmTestnet: 'WDHFZFMJKTS82UXC9R1G52UY278AMFWQ9V',
      bscTestnet: '9GUFJUEMXS4CF943XEQTSMXGRRJNT4BF5I',
      arbiscanApiKey: 'K8ZHY5JT47ETMM3KBRQSJ266EYXM7QXAE6'
    }
  },
  networks: {
    arbitrum: {
      url: "https://arbitrum-one.public.blastapi.io",
      accounts,
      chainId: 42161,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    goerli: {
      //url: "https://goerli.infura.io/v3/",
      url: "https://rpc.ankr.com/eth_goerli",
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    bsctestnet: {
      url: "https://bsc-testnet.public.blastapi.io",
      accounts,
      chainId: 97,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts,
      chainId: 250,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    fantomtest: {
      url: "https://rpc.testnet.fantom.network",
      accounts,
      chainId: 4002,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
};