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
      await instanceJO2024.mint(0, 1);
      await instanceJO2024.mint(1, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);
      await instanceJO2024.mint(0, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(2);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(1);

      await instanceJO2024.mintWithAddress(addr1.address, 4, 10);
      expect(await instanceJO2024.balanceOf(addr1.address, 4)).to.be.equal(10);

    });
  });

  describe("exchangeStart", () => {
    it("Should exchangeStart correctly", async () => {
      await instanceJO2024.mint(0, 1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      await instanceJO2024.exchangeStart(0,1,1);
      expect(await instanceJO2024.balanceOf(owner.address, 0)).to.be.equal(1);
      expect(await instanceJO2024.exchangeState()).to.be.equal(0);
    });
  });

  describe("exchangeFound", () => {
    it("Should exchangeFound correctly", async () => {
      await instanceJO2024.mintWithAddress(addr1.address, 4, 10);
      await instanceJO2024.mintWithAddress(addr2.address, 3, 10);
      expect(await instanceJO2024.balanceOf(addr1.address, 4)).to.be.equal(10);
      expect(await instanceJO2024.balanceOf(addr2.address, 3)).to.be.equal(10);
      await instanceJO2024.exchangeStartWithAddress(addr1.address, 4, 3, 10);
      await instanceJO2024.exchangeFoundWithAddress(addr1.address, addr2.address);
      expect(await instanceJO2024.exchangeStateWithAddress(addr1.address)).to.be.equal(1);
    });
  });

  describe("exchange", () => {
    it("Should exchange correctly", async () => {
      await instanceJO2024.mintWithAddress(addr1.address, 4, 10);
      await instanceJO2024.mintWithAddress(addr2.address, 3, 10);
      expect(await instanceJO2024.balanceOf(addr1.address, 4)).to.be.equal(10);
      expect(await instanceJO2024.balanceOf(addr2.address, 3)).to.be.equal(10);
      await instanceJO2024.exchangeStartWithAddress(addr1.address, 4, 3, 10);
      await instanceJO2024.exchangeFoundWithAddress(addr1.address, addr2.address);
      expect(await instanceJO2024.exchangeStateWithAddress(addr1.address)).to.be.equal(1);
/*
      // pb car pas le msg.sender
      await instanceJO2024.exchangeWithAddress(addr1.address);

      expect(await instanceJO2024.balanceOf(addr1.address, 4)).to.be.equal(0);
      expect(await instanceJO2024.balanceOf(addr2.address, 3)).to.be.equal(0);
      expect(await instanceJO2024.balanceOf(addr1.address, 3)).to.be.equal(10);
      expect(await instanceJO2024.balanceOf(addr2.address, 4)).to.be.equal(10);
      expect(await instanceJO2024.exchangeStateWithAddress(addr1.address)).to.be.equal(2);
*/
    });
  });

  describe("exchangeClose", () => {
    it("Should exchangeClose correctly", async () => {
      //expect(await instanceJO2024.exchangeState()).to.be.equal(2);
      //await instanceJO2024.exchangeClose(addr1.address);
    });
  });

  describe("burn", () => {
    it("Should burn correctly", async () => {
      await instanceJO2024.mint(1, 10000);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(10000);
      await instanceJO2024.burn(1);
      expect(await instanceJO2024.balanceOf(owner.address, 1)).to.be.equal(9000);
      expect(await instanceJO2024.balanceOf(owner.address, 6)).to.be.equal(1);
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

  });
});
