const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();


  console.log("Deploying contracts with the account:", deployer.address);
  const TestContract = await ethers.getContractFactory("Test");
  const tc = await TestContract.deploy();
  console.log("Contract address:", tc.address);


  const BathTokenContract = await ethers.getContractFactory("BathtubToken");
  const bt = await BathTokenContract.attach('0x185944363e0E2a6246084FE4f1f17b719849cbA6');

  await bt.approve(tc.address, '1000000000000000000');
  let tx = await tc.run();

  console.log("done");
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });