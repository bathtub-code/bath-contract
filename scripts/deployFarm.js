const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BathtubFarm = await ethers.getContractFactory("BathtubFarm");

  const BathTokenAddress = "0xA4D3f3FB7E05c3456F6D6Aa94520EfF62Cf89f4d";
  const startTime = 1684428315;  //Thu May 18 2023 16:45:15 GMT+0000
  const runningTime = 3600 * 24 * 365 * 10;  //10 years - 315,360,000sec
  const BathPerSecond = "100000000000000000";
  //0.1 Bath per sec-  31,536,000 BATH will be spent for farms
  //3,153,600 BATH will be spent per Year.
  //262,800 BATH will be spent per Month.

  // The treasury Address for getting deposit Fee
  const feeCollector = "0x7524A8bA0B725a61DFC96137aF89cee9fd63fA7E";

  const Farm = await BathtubFarm.deploy(
    BathTokenAddress, startTime, runningTime, BathPerSecond, feeCollector);

  console.log("Farm address: ", Farm.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });