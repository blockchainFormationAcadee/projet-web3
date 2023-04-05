import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { JO2024, JO2024__factory } from "../typechain-types";

let JO2024Factory: JO2024__factory

describe("JO2024", function () {
  let instanceJO2024: JO2024;
  let owner: SignerWithAddress;
  let signer1: SignerWithAddress;
  let signer2: SignerWithAddress;

  before(async () => {
    // Get the Signers here
    [owner, signer1, signer2] = await ethers.getSigners();
    // Create factory
    JO2024Factory = new JO2024__factory(owner);
  });

  beforeEach(async () => {
    instanceJO2024 = (await JO2024Factory.deploy()) as JO2024;
    await instanceJO2024.deployed();
  });

  describe("Deployment Pause false", () => {
    it("Shouldn't pause the mint", async () => {
      expect(await instanceJO2024.paused()).to.be.equal(false);
    })
  });

  describe("Minting signer1", () => {
    it("Should mint correctly", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
    });
  });
  describe("Minting", () => {
    it("Should mint correctly", async () => {
      await expect(instanceJO2024.mint(0, 0)).to.be.revertedWith("Mint Zero");
      await instanceJO2024.mint(0, 1);
      await instanceJO2024.mint(1, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);
      await instanceJO2024.mint(0, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(2);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);

      await instanceJO2024.connect(signer1).mint(4, 10);
      expect(await instanceJO2024.balanceOf(signer1.address, 4)).to.be.equal(10);

    });
  });
  describe("exchangeStart", () => {
    it("Should exchangeStart correctly", async () => {
      await instanceJO2024.mint(0, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      await expect(instanceJO2024.exchangeStart(0, 0, 1)).to.be.revertedWith("NFTs equals");
      await instanceJO2024.exchangeStart(0,1,1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      expect(await instanceJO2024.exchangeState()).to.be.equal(1);
    });
  });

  describe("exchangeFound", () => {
    it("Should exchangeFound correctly", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
      await instanceJO2024.connect(signer2).mint(3, 10);
      expect(await instanceJO2024.balanceOf(signer1.address, 4)).to.be.equal(10);
      expect(await instanceJO2024.balanceOf(signer2.address, 3)).to.be.equal(10);
      await instanceJO2024.connect(signer1).exchangeStart(4, 3, 10);
      await instanceJO2024.connect(signer2).exchangeFound(signer1.address);

      expect(await instanceJO2024.balanceOf(signer1.address, 4)).to.be.equal(0);
      expect(await instanceJO2024.balanceOf(signer1.address, 3)).to.be.equal(10);
      expect(await instanceJO2024.balanceOf(signer2.address, 3)).to.be.equal(0);
      expect(await instanceJO2024.balanceOf(signer2.address, 4)).to.be.equal(10);

      expect(await instanceJO2024.connect(signer1).exchangeState()).to.be.equal(2);
    });
  });

  describe("exchangeClose", () => {
    it("Should exchangeClose correctly", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
      await instanceJO2024.connect(signer2).mint(3, 10);
      await instanceJO2024.connect(signer1).exchangeStart(4, 3, 10);
      await instanceJO2024.connect(signer2).exchangeFound(signer1.address);
      await instanceJO2024.connect(signer1).exchangeClose();
      expect(await instanceJO2024.connect(signer1).exchangeState()).to.be.equal(0);
    });
  });


  describe("burn", () => {
    it("Should burn correctly", async () => {
      await instanceJO2024.mint(1, 10000);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(10000);
      // burn type 1 amountBurn=100
      await instanceJO2024.burn(1);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(9900);
      expect(await instanceJO2024.balanceOf(owner.address, 6)).to.be.equal(1);
    });
  });

  describe("Pause", () => {
    it("Shouldn't pause if not owner", async () => {
      await expect(instanceJO2024.connect(signer1).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Shouldn't unpause if not owner", async () => {
      await expect(instanceJO2024.connect(signer1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should pause correctly", async () => {
      await instanceJO2024.pause();
      expect(await instanceJO2024.paused()).to.be.equal(true);
    });

    it("Should unpause correctly", async () => {
      await instanceJO2024.pause();
      expect(await instanceJO2024.paused()).to.be.equal(true);
      // await expect(await instanceJO2024.connect(signer1).mint(0, 1)).to.be.revertedWith("Pausable: paused");

      await instanceJO2024.unpause();
      expect(await instanceJO2024.paused()).to.be.equal(false);
    });

  });
});

