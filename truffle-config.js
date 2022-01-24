const path = require("path");
require("dotenv").config({ path: "./.env" })
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    kovan_infura: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
          addressIndex: 0,
        })
      },
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: "0.8.7"
    }
  }
};
