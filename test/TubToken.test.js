// Import necessary modules from Hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// Start describing the test suite
describe("TubToken", function() {

    // Deploy the TubToken contract before each test case
    async function deployTokenFixture() {
        [owner, addr1, addr2] = await ethers.getSigners();
        const TubToken = await ethers.getContractFactory("TubToken");
        const taxPercent = 0;
        const taxAddress = "0xe5C538024188eD687a26C88390c7433c6a09F909";

        let tubToken = await TubToken.connect(owner).deploy(taxPercent,taxAddress );
        return { tubToken, owner, addr1, addr2};
    }

    // Test the initial state of the TubToken contract
    describe("Deployment", function() {
        
        it("Should set the right owner", async function() {
            const { tubToken, owner} = await loadFixture(deployTokenFixture);
            expect(await tubToken.owner()).to.equal(owner.address);
        });

        it("Should set the total supply to 0", async function() {
            const { tubToken} = await loadFixture(deployTokenFixture);
            expect(await tubToken.totalSupply()).to.equal(0);
        });
    });

    // Test the minting functionality of the TubToken contract
    describe("Minting", function() {
        it("Should mint 1000 tokens to the contract owner", async function() {
            const { tubToken, owner} = await loadFixture(deployTokenFixture);
            await tubToken.connect(owner).mint(1000);
            expect(await tubToken.balanceOf(owner.address)).to.equal(1000);
            expect(await tubToken.totalSupply()).to.equal(1000);   
        });

        it("Should revert when non-owner tries to mint", async function() {
            const { tubToken, addr1} = await loadFixture(deployTokenFixture);
            await tubToken.connect(addr1).mint(1000);
            expect(await tubToken.balanceOf(addr1.address)).to.equal(1000);
        });

    });

    // Test the token transfer functionality of the TubToken contract
    describe("Transfers", function() {
    
        it("Should transfer tokens between two accounts", async function() {
            const { tubToken, owner, addr1, addr2} = await loadFixture(deployTokenFixture);
            await tubToken.connect(owner).mint(1000);
            // Transfer 50 tokens from owner to addr1
            await expect(
                tubToken.transfer(addr1.address, 50)
            ).to.changeTokenBalances(tubToken, [owner, addr1], [-50, 50]);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(
                tubToken.connect(addr1).transfer(addr2.address, 50)
            ).to.changeTokenBalances(tubToken, [addr1, addr2], [-50, 50]);
        });
    });

    describe("Owner only functions", function(){
        it("Should revert when non-owner tries to change Tax Percentage", async function() {
            const { tubToken, owner} = await loadFixture(deployTokenFixture);
            await tubToken.connect(owner).setFeePercentage(10);
            });
        it("Should revert when non-owner tries to change Tax address", async function() {
            const { tubToken, owner, addr2} = await loadFixture(deployTokenFixture);
            await tubToken.connect(addr2).setTaxAddress(addr2.address);
        });
    });
});