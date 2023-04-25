const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BathTokenContract = await ethers.getContractFactory("BathToken");

  const buyTax = 500;
  const sellTax = 1000;
  const taxCollectorAddress = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";
  const uniswapV2Router = "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3";
  const BathToken = await BathTokenContract.deploy(buyTax, sellTax, taxCollectorAddress, uniswapV2Router);

  console.log("Token address:", BathToken.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });