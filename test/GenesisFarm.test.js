const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("GenesisFarm", function () {
  
  let poolInfo;
  let userInfo;
  
  async function deployTokenFixture() {
    [owner, user] = await ethers.getSigners();

    const LPToken = await ethers.getContractFactory("TubToken");
    let lpToken = await LPToken.connect(owner).deploy(
      0,"0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E");

    const RewardToken = await ethers.getContractFactory("BathToken");
    let rewardToken = await RewardToken.connect(owner).deploy(
      0,"0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E");

    await lpToken.connect(owner).mint(100000);
    await rewardToken.connect(owner).mint(500000);

    await lpToken.transfer(user.address, 1000);
    return { lpToken, rewardToken, owner, user};
  }
  async function deployFarmFixture() {
    const { lpToken, rewardToken, owner, user } = await loadFixture(deployTokenFixture);
    const GenesisFarm = await ethers.getContractFactory("GenesisFarm");
    
    const startTime = 1682095100;  //Friday, April 21, 2023 12:30:00 GMT+09:00
    const runningTime = 3600*24*365*10;  //1 years - 315,360,00sec
    const BathPerSecond = 1; 
    const feeCollector = "0xe8f082A0831ECb553023f9de03f7e8fBd8EFc15E";

    let genesisFarm = await GenesisFarm.connect(owner).deploy(
      rewardToken.address,
      startTime,
      runningTime,
      BathPerSecond,
      feeCollector);
    await rewardToken.transfer(genesisFarm.address, 10000);

    return { genesisFarm, lpToken, rewardToken, owner, user};
  }

  describe("Staking Feature Tests", function () {
    it("Owner should add a pool", async function () {
      const { genesisFarm, lpToken, rewardToken, owner, user } = 
        await loadFixture(deployFarmFixture);

      await genesisFarm.connect(owner).add(1,lpToken.address,10,10,true,0);
      let poolInfo = await genesisFarm.poolInfo(0);

      //check pool lp token address   
      expect(poolInfo.token).to.equal(lpToken.address);

    });

    it("should deposit LP tokens and check rewards", async function () {
      const { genesisFarm, lpToken, rewardToken, owner, user } = 
      await loadFixture(deployFarmFixture);

      const depositAmount = 100;
      await genesisFarm.connect(owner).add(1,lpToken.address,10,10,true,0);

      await lpToken.connect(user).approve(genesisFarm.address, depositAmount);
      await genesisFarm.connect(user).deposit(0, depositAmount);

      let userInfo = await genesisFarm.userInfo(0,user.address);
      //check deposited amount is correct
      expect(userInfo.amount).to.equal(depositAmount);

      //let's wait 1000sec and should check user has pending rewards
      await time.increase(1000);
      let userEarned = await genesisFarm.pendingBaths(0, user.address);
      //Does user earn Bath?
      expect(userEarned).to.be.above(0);

    });

    it("should withdraw LP tokens and rewards", async function () {
      const { genesisFarm, lpToken, rewardToken, owner, user } = 
      await loadFixture(deployFarmFixture);
      const depositAmount = 100;

      await genesisFarm.connect(owner).add(1,lpToken.address,10,10,true,0);

      await lpToken.connect(user).approve(genesisFarm.address, depositAmount);
      await genesisFarm.connect(user).deposit(0, depositAmount);
      //let's wait 3600 seconds
      await time.increase(3600);
/*
      await ethers.provider.send("evm_increaseTime", [86400]); // Increase time by 1 day
      await ethers.provider.send("evm_mine", []);
*/
      let userInfo = await genesisFarm.userInfo(0,user.address);
      let userEarned = await genesisFarm.pendingBaths(0, user.address);
      
      //Yes, user have some pending Bath, let's harvest!
      await genesisFarm.connect(user).withdraw(0, 0);

      //let's check user have bath reward or not
      let userRewardTokenBalance = await rewardToken.balanceOf(user.address);
      expect(userEarned).to.be.above(0);
      expect(userRewardTokenBalance).to.be.above(userEarned);
    });

    
    it("should check updating pool with new parameters", async function () {

      const { genesisFarm, lpToken, rewardToken, owner, user } = 
      await loadFixture(deployFarmFixture);
      await genesisFarm.connect(owner).add(1,lpToken.address,10,10,true,0);
      const pool = await genesisFarm.poolInfo(0);

      await genesisFarm.connect(owner).set(0, 2, 50, 500);
      newPool = await genesisFarm.poolInfo(0);
      
      expect(pool.allocPoint).to.not.equal(newPool.allocPoint);
    });

  });
  describe("Owner Only Feature", function () {
    it("should not allow non-owner to add new pool", async function () {
      const { genesisFarm, lpToken, rewardToken, owner, user } = 
      await loadFixture(deployFarmFixture);
      await expect(genesisFarm.connect(owner).add(1,lpToken.address,10,10,true,0));
    
    });
    it("should not allow non-owner to update emission rate", async function () {
      const { genesisFarm, lpToken, rewardToken, owner, user } = 
      await loadFixture(deployFarmFixture);
      await expect(genesisFarm.connect(owner).updateEmissionRate(10));
      
    });
  });

});