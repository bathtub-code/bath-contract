const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  let feeAddress = "0x7524A8bA0B725a61DFC96137aF89cee9fd63fA7E";
  console.log("Deploying contracts with the account:", deployer.address);
  const BathTokenContract = await ethers.getContractFactory("BathtubToken");
  const BathToken = await BathTokenContract.deploy(feeAddress);
  console.log("Token address:", BathToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });