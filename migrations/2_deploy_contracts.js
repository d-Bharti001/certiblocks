var CertiContract = artifacts.require("./CertiContract.sol");

module.exports = function(deployer) {
  deployer.deploy(CertiContract);
};
