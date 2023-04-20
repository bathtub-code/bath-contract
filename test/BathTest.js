// Import necessary modules from Hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Start describing the test suite
describe("BathToken", function() {
    let bathToken;
    let owner;
    let addr1;
    let addr2;

    // Deploy the BathToken contract before each test case
    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();
        const BathToken = await ethers.getContractFactory("BathToken");
        const taxPercent = 0;
        const taxAddress = "0xe5C538024188eD687a26C88390c7433c6a09F909";

        bathToken = await BathToken.connect(owner).deploy(taxPercent,taxAddress );
    });

    // Test the initial state of the BathToken contract
    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            expect(await bathToken.owner()).to.equal(owner.address);
        });

        it("Should set the total supply to 0", async function() {
            expect(await bathToken.totalSupply()).to.equal(0);
        });
    });

    // Test the minting functionality of the BathToken contract
    describe("Minting", function() {
        it("Should mint 1000 tokens to the contract owner", async function() {
        await bathToken.connect(owner).mint(1000);
        expect(await bathToken.balanceOf(owner.address)).to.equal(1000);
        expect(await bathToken.totalSupply()).to.equal(1000);
        });

        it("Should revert when non-owner tries to mint", async function() {
        await expect(bathToken.connect(addr1).mint(1000))
            .to.be.revertedWith("Ownable: caller is not the owner");
        });

    });

    // Test the token transfer functionality of the BathToken contract
    describe("Transfers", function() {

        beforeEach(async function() {
        //await bathToken.connect(owner).mint(addr1.address, 1000);
            await bathToken.connect(owner).mint(1000);
        });
    
        it("Should transfer tokens between two accounts", async function() {
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
});
