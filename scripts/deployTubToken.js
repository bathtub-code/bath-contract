const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const BathTokenContract = await ethers.getContractFactory("TubToken");

    const taxRate = 5;
    const taxCollectorAddress = "0xe5C538024188eD687a26C88390c7433c6a09F909";

    const BathToken = await BathTokenContract.deploy(taxRate,taxCollectorAddress);
  
    console.log("Token address:", BathToken.address);

    await hre.run("verify:verify", {
      address: BathToken.address,
      constructorArguments: [taxRate, taxCollectorAddress],
    });

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });