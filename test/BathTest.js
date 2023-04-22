// Import necessary modules from Hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// Start describing the test suite
describe("BathToken", function() {

    // Deploy the BathToken contract before each test case
    async function deployTokenFixture() {
        [owner, addr1, addr2] = await ethers.getSigners();
        const BathToken = await ethers.getContractFactory("BathToken");
        const taxPercent = 0;
        const taxAddress = "0xe5C538024188eD687a26C88390c7433c6a09F909";

        let bathToken = await BathToken.connect(owner).deploy(taxPercent,taxAddress );
        return { bathToken, owner, addr1, addr2};
    }

    // Test the initial state of the BathToken contract
    describe("Deployment", function() {
        
        it("Should set the right owner", async function() {
            const { bathToken, owner} = await loadFixture(deployTokenFixture);
            expect(await bathToken.owner()).to.equal(owner.address);
        });

        it("Should set the total supply to 0", async function() {
            const { bathToken} = await loadFixture(deployTokenFixture);
            expect(await bathToken.totalSupply()).to.equal(0);
        });
    });

    // Test the minting functionality of the BathToken contract
    describe("Minting", function() {
        it("Should mint 1000 tokens to the contract owner", async function() {
            const { bathToken, owner} = await loadFixture(deployTokenFixture);
            await bathToken.connect(owner).mint(1000);
            expect(await bathToken.balanceOf(owner.address)).to.equal(1000);
            expect(await bathToken.totalSupply()).to.equal(1000);   
        });

        it("Should revert when non-owner tries to mint", async function() {
            const { bathToken, addr1} = await loadFixture(deployTokenFixture);
            await bathToken.connect(addr1).mint(1000);
            expect(await bathToken.balanceOf(addr1.address)).to.equal(1000);
        });

    });

    // Test the token transfer functionality of the BathToken contract
    describe("Transfers", function() {
    
        it("Should transfer tokens between two accounts", async function() {
            const { bathToken, owner, addr1, addr2} = await loadFixture(deployTokenFixture);
            await bathToken.connect(owner).mint(1000);
            // Transfer 50 tokens from owner to addr1
            await expect(
                bathToken.transfer(addr1.address, 50)
            ).to.changeTokenBalances(bathToken, [owner, addr1], [-50, 50]);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(
                bathToken.connect(addr1).transfer(addr2.address, 50)
            ).to.changeTokenBalances(bathToken, [addr1, addr2], [-50, 50]);
        });
    });

    describe("Owner only functions", function(){
        it("Should revert when non-owner tries to change Tax Percentage", async function() {
            const { bathToken, owner} = await loadFixture(deployTokenFixture);
            await bathToken.connect(owner).setFeePercentage(10);
            });
        it("Should revert when non-owner tries to change Tax address", async function() {
            const { bathToken, owner, addr2} = await loadFixture(deployTokenFixture);
            await bathToken.connect(addr2).setTaxAddress(addr2.address);
        });
    });
});

