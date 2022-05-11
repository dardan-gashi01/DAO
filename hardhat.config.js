require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
//setting our network so that we can deploy to the blockchain
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: `${process.env.ALCHEMY_API_URL}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },
};
