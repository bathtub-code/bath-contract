const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const GenesisContract = await ethers.getContractFactory("GenesisFarm");
    
    const BathAddress = "0x67A7812B1FF6d1040F94ddb79F983BD9E5BEA535";
    const startBlock = 28664500; 
    const BathPerBlock = 25*10^8; //25bath
    // The treasury Address for getting deposit Fee
    const treasuryAddress = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";

    // The address who holds BATH for reward
    const rewardHolder = "0xe5C538024188eD687a26C88390c7433c6a09F909";

    const Farm = await GenesisContract.deploy(
      BathAddress,startBlock,BathPerBlock,treasuryAddress,rewardHolder);
  
    console.log("Farm address: ", Farm.address);

    await hre.run("verify:verify", {
      address: Farm.address,
      constructorArguments: 
      [BathAddress, startBlock, BathPerBlock, treasuryAddress, rewardHolder],
    });

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });