const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SaunaContract = await ethers.getContractFactory("Sauna");

  const wBNBAddress = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
  const startTime = 1681961400;  //Friday, April 9, 2023 14:00:00 GMT+09:00
  const runningTime = 3600 * 24 * 365 * 10;  //10 years - 315,360,000sec
  const wBNBPerSecond = "1000000000000";
  //0.000001 wBNB per sec per sec-  315.36 wBNB will be spent for farms
  //31.536 wBNB will be spent per Year.
  //2.628 wBNB will be spent per Month.
  // The treasury Address for getting deposit Fee
  const feeCollector = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";
  /*
      const Farm = await SaunaContract.deploy(
          wBNBAddress,startTime,runningTime,wBNBPerSecond,feeCollector);
    
      console.log("Farm address: ", Farm.address);
  */

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });