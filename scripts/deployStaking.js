const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BathtubStaking = await ethers.getContractFactory("BathtubStaking");

  const BathTokenAddress = "0xA4D3f3FB7E05c3456F6D6Aa94520EfF62Cf89f4d";
  const ARBaddress = "0x912ce59144191c1204e64559fe8253a0e49e6548"
  const BathPerSecond = "100000000000000000";
  //0.1 Bath per sec-  31,536,000 BATH will be spent for farms
  //3,153,600 BATH will be spent per Year.
  //262,800 BATH will be spent per Month.
  // The treasury Address for getting deposit Fee
  const Farm = await BathtubStaking.deploy();
  console.log("Staking address: ", Farm.address);

  // _stakedToken: staked token address
  // _rewardToken: reward token address
  // _rewardPerBlock: reward per block (in rewardToken)
  // _lockDays: lock days for claim reward and withdraw
  // _rewardAddress: address where reward comes from
  // _admin: admin address with ownership
  await Farm.initialize(BathTokenAddress, ARBaddress, BathPerSecond, 10, 80, '0x', deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });