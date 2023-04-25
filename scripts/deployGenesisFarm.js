const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const GenesisContract = await ethers.getContractFactory("GenesisFarm");

  const BathAddress = "0x8Bfea674bE99b86B15e1ED46C030650B34a0AA5d";
  const startTime = 1681961400;  //Thurs, April 20, 2023 12:30:00 GMT+09:00
  const runningTime = 3600 * 7 * 24;  //7 days - 604,800sec
  const BathPerSecond = "100000000000000000";
  //0.1 bath per sec-  60,480 BATH will be spent for pool

  // The treasury Address for getting deposit Fee
  const feeCollector = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";

  const Farm = await GenesisContract.deploy(
    BathAddress, startTime, runningTime, BathPerSecond, feeCollector);

  console.log("Farm address: ", Farm.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });