const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const stakingContract = await ethers.getContractFactory("BathtubStaking");

  const stakedTokenAddress = "0xA4D3f3FB7E05c3456F6D6Aa94520EfF62Cf89f4d";
  const rewardTokenaddress = "0x912ce59144191c1204e64559fe8253a0e49e6548"
  const bathPerSecond = "100000000000000000";
  const lockDays = 0;
  const lockPenalty = 0;
  const rewardAddress = "0xe5C538024188eD687a26C88390c7433c6a09F909";

  //Deploy staking contract
  const BathTubStaking = await stakingContract.deploy();
  console.log("Staking address: ", BathTubStaking.address);

  await BathTubStaking.initialize(
    stakedTokenAddress,
    rewardTokenaddress,
    bathPerSecond,
    lockDays,
    lockPenalty,
    rewardAddress,
    deployer.address
  );

  //Verify staking contract
  await hre.run("verify:verify", {
    address: BathTubStaking.address});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });