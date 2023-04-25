const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SteamRoomContract = await ethers.getContractFactory("SteamRoom");

  const TubAddress = "0x1c34eAEfAF14b3700FB6a20cB634eB63aAf6636a";
  const startTime = 1681961400;  //Monday, April 17, 2023 11:00:00 GMT+09:00
  const runningTime = 3600 * 24 * 365 * 10;  //10 years - 315,360,000sec
  const TubPerSecond = "100000000000000000";
  //0.1 Tub per sec-  31,536,000 TUB will be spent for farms
  //3,153,600 TUB will be spent per Year.
  //262,800 TUB will be spent per Month.
  // The treasury Address for getting deposit Fee
  const feeCollector = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";

  const Farm = await SteamRoomContract.deploy(
    TubAddress, startTime, runningTime, TubPerSecond, feeCollector);

  console.log("Farm address: ", Farm.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });