const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const JacuzziContract = await ethers.getContractFactory("Jacuzzi");

  const BathTokenAddress = "0x8Bfea674bE99b86B15e1ED46C030650B34a0AA5d";
  const startTime = 1681961400;  //Monday, April 17, 2023 13:00:00 GMT+09:00
  const runningTime = 3600 * 24 * 365 * 10;  //10 years - 315,360,000sec
  const BathPerSecond = "100000000000000000";
  //0.1 Bath per sec-  31,536,000 BATH will be spent for farms
  //3,153,600 BATH will be spent per Year.
  //262,800 BATH will be spent per Month.

  // The treasury Address for getting deposit Fee
  const feeCollector = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";

  const Farm = await JacuzziContract.deploy(
    BathTokenAddress, startTime, runningTime, BathPerSecond, feeCollector);

  console.log("Farm address: ", Farm.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });