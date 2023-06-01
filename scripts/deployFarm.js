const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BathtubFarm = await ethers.getContractFactory("BathtubFarm");

  // just for testing!
  // const BathtubTokenTest = await ethers.getContractFactory("BathtubTokenTest");
  // const BathTest = await BathtubTokenTest.deploy(deployer.address);
  // console.log("BathTest address: ", BathTest.address);

  const BathTokenAddress = '0xe5b8C3381C0A2544883CfF9dDaf1e48D9dea9E49'
  const startTime = 1685620800;  // Thu Jun 01 2023 12:00:00 GMT+0000
  const runningTime = 3600 * 24 * 365 * 10;  //10 years - 315,360,000sec
  const BathPerSecond = "1380000000000000000"; // 1.38 Bath per sec

  // Change this to real addresses
  const feeCollector = '0xa075967369Cd5FB0353ef2d03F1CA14FCd2e3C0d'; // Treasury address
  const mktgAddress = '0x4900ed49B287F2B4Db98aC4dB03BcfD2F30F1788'; // Marketing address
  const devAddress = '0xf59ac041216d19eae6a9125ddb2ef0c3300ca9e0'; // Dev address

  const Farm = await BathtubFarm.deploy(
    BathTokenAddress, startTime, runningTime, BathPerSecond, feeCollector, mktgAddress, devAddress
  );

  console.log("Farm address: ", Farm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });