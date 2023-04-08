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

  describe("Modify uri by Ownable and not Ownable", () => {
    it("Should set uri", async () => {
      await instanceJO2024.setURI("https://nftstorage.link/ipfs");
      await expect(instanceJO2024.connect(signer1).setURI("https://nftstorage.link/ipfs")).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Modify supply by Ownable and not Ownable", () => {
    it("Should set uri", async () => {
      await instanceJO2024.setSupply(0,50000);
      await expect(instanceJO2024.connect(signer2).setSupply(0,50000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Modify change the amount to burn by Ownable and not Ownable", () => {
    it("Should set amount to burn", async () => {
      await instanceJO2024.setAmountBurn(50000);
      await expect(instanceJO2024.connect(signer1).setAmountBurn(50000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting signer1", () => {
    it("Should mint correctly", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
    });
  });

  describe("Multiple Minting", () => {
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

  describe("exchangeCloseeStart", () => {
    it("Should exchangeStart not possible until close", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
      await instanceJO2024.connect(signer2).mint(3, 10);
      await instanceJO2024.connect(signer1).exchangeStart(4, 3, 10);
      await instanceJO2024.connect(signer2).exchangeFound(signer1.address);
      await expect(instanceJO2024.connect(signer1).exchangeStart(3, 1, 10)).to.be.revertedWith("Exchange to close");
    });
  });

  describe("exchangeInsufficientBalance", () => {
    it("Should exchange signer Insufficient balance for transfer", async () => {
      await instanceJO2024.connect(signer1).mint(4, 10);
      await instanceJO2024.connect(signer2).mint(3, 5);
      await expect(instanceJO2024.connect(signer1).exchangeStart(5, 3, 10)).to.be.revertedWith("NFT does not exist to exchange");
      await expect(instanceJO2024.connect(signer1).exchangeStart(4, 5, 10)).to.be.revertedWith("NFT does not exist to exchange");
      await expect(instanceJO2024.connect(signer1).exchangeStart(4, 3, 11)).to.be.revertedWith("Insufficient balance for transfer : from");
      await instanceJO2024.connect(signer1).exchangeStart(4, 3, 10);
      await expect(instanceJO2024.connect(signer2).exchangeFound(signer1.address)).to.be.revertedWith("Insufficient balance for transfer : to");
    });
  });

  describe("exchangeByContract not the adress contrat", () => {
    it("Should error not the adress contrat", async () => {
      await expect(instanceJO2024.connect(signer2).exchangeByContract(signer1.address)).to.be.revertedWith("Only contract address could exchange");
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
      await instanceJO2024.unpause();
      expect(await instanceJO2024.paused()).to.be.equal(false);
    });

  });
});

