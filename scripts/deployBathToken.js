const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  let feeAddress = "0x8d8214493E142B64D0500Ba2c8432CE05F24Ec7a";
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
