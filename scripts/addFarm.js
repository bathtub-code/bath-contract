const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BathtubFarm = await ethers.getContractFactory("BathtubFarm");
  const farm = await BathtubFarm.attach("0x340EB4619f74Cf1aB52781ECC25248acDcBe08D8");

  // // just for testing!
  // const BathtubToken = await ethers.getContractFactory("BathtubToken");
  // const Bath = await BathtubToken.deploy(deployer.address);

  // uint256 _allocPoint, --> total: 10_000, so 35% is 3500
  // IERC20 _token,
  // uint16 _depositFee,
  // uint16 _withdrawFee,
  // bool _withUpdate,
  // uint256 _lastRewardTime

  // // Rameses BATH/USDC LP -- pool 0
  // let tx = await farm.add(
  //   2500, // 25% allocation
  //   '0x240cE8668BFBc8891A63D836730b724af7c36cdC', // use BATH/USDC LP address here
  //   400, // 4% deposit fee
  //   0, // 0% withdraw fee
  //   true, // with update
  //   0 // last reward time
  // );
  // console.log("Pool 0 added: ", tx.hash);

  // // Rameses ETH/USDC LP -- pool 1
  // tx = await farm.add(
  //   1500, // 15% allocation
  //   '0x5513a48F3692Df1d9C793eeaB1349146B2140386', // use ETH/USDC LP address here
  //   400, // 4% deposit fee
  //   0, // 0% withdraw fee
  //   true, // with update
  //   0 // last reward time
  // );
  // console.log("Pool 1 added: ", tx.hash);


  // // Rameses ETH/ARB LP -- pool 2
  // tx = await farm.add(
  //   1500, // 15% allocation
  //   '0x275f7112e3900fdf3c9532d749dd4985790e7933', // use ETH/ARB LP address here
  //   400, // 4% deposit fee
  //   0, // 0% withdraw fee
  //   true, // with update
  //   0 // last reward time
  // );
  // console.log("Pool 2 added: ", tx.hash);

  // // Rameses USDT/USDC LP -- pool 3
  // tx = await farm.add(
  //   1000, // 15% allocation
  //   '0xe25c248Ee2D3D5B428F1388659964446b4d78599', // use USDT/USDC LP address here
  //   400, // 4% deposit fee
  //   0, // 0% withdraw fee
  //   true, // with update
  //   0 // last reward time
  // );
  // console.log("Pool 3 added: ", tx.hash);



  // MISSING BATH/ETH

  // // BATH/WETH LP -- pool 4
  // const tx = await farm.add(
  //   3500, // 35% allocation
  //   '', // use BATH/WETH LP address here
  //   400, // 4% deposit fee
  //   0, // 0% withdraw fee
  //   true, // with update
  //   0 // last reward time
  // );
  // console.log("Pool 4 added: ", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });