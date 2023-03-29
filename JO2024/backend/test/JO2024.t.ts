import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { JO2024, JO2024__factory } from "../typechain-types";

let JO2024Factory: JO2024__factory

describe("JO2024", function () {
  let instanceJO2024: JO2024;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  before(async () => {
    // Get the Signers here
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
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

  describe("Minting", () => {
    it("Should mint correctly", async () => {
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);
      await instanceJO2024.mintNFT(0, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(2);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);
    });
  });

  describe("Pause", () => {
    it("Shouldn't pause if not owner", async () => {
      await expect(instanceJO2024.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Shouldn't unpause if not owner", async () => {
      await expect(instanceJO2024.connect(addr1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should pause correctly", async () => {
      await instanceJO2024.pause();
      expect(await instanceJO2024.paused()).to.be.equal(true);
    });

    it("Should unpause correctly", async () => {
      await instanceJO2024.pause();
      expect(await instanceJO2024.paused()).to.be.equal(true);
      await instanceJO2024.unpause();
      expect(await instanceJO2024.paused()).to.be.equal(false);
    });

    it("Shouldn't mint while paused", async () => {
      await instanceJO2024.pause();
      await expect(instanceJO2024.mintNFT(0, 1)).to.be.revertedWith("Pausable: paused");
    });

  });
});
