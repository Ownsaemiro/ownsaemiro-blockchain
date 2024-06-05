const mintGemToken = artifacts.require('../contracts/MintGemToken.sol');

const concertName = "practice0601";
const managerName = "park";

module.exports = function(deployer) {
	deployer.deploy(mintGemToken, concertName, managerName); 
};