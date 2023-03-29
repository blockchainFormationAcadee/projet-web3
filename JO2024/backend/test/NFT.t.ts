import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT, NFT__factory } from "../typechain-types";

let NFTFactory: NFT__factory

describe("NFT", function () {
  let instanceNFT: NFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  before(async () => {
    // Get the Signers here
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Create factory
    NFTFactory = new NFT__factory(owner);
  });

  beforeEach(async () => {
    instanceNFT = (await NFTFactory.deploy(
      "MyNFT",
      "MN",
      "ipfs://"
    )) as NFT;
    await instanceNFT.deployed();
  });

  describe("Deployment", () => {
    it("Should deploy", async () => { });

    it("Shouldn't pause the mint", async () => {
      expect(await instanceNFT.paused()).to.be.equal(false);
    })
  });

  describe("Minting", () => {

    it("Should mint correctly", async () => {

      await instanceNFT.mint(addr1.address, "QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc4");
      expect(await instanceNFT.tokenURI(0)).to.be.equal("ipfs://QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc4");
      expect(await instanceNFT.ownerOf(0)).to.be.equal(addr1.address);

    });

    it("Should mint multiples times correctly", async () => {

      await instanceNFT.mint(addr1.address, "QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc4");
      expect(await instanceNFT.tokenURI(0)).to.be.equal("ipfs://QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc4");
      expect(await instanceNFT.ownerOf(0)).to.be.equal(addr1.address);

      await instanceNFT.mint(addr2.address, "QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc5");
      expect(await instanceNFT.tokenURI(1)).to.be.equal("ipfs://QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc5");
      expect(await instanceNFT.ownerOf(1)).to.be.equal(addr2.address);

    });

  });

  describe("Pause", () => {

    it("Shouldn't pause if not owner", async () => {

      await expect(instanceNFT.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Shouldn't unpause if not owner", async () => {

      await expect(instanceNFT.connect(addr1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should pause correctly", async () => {

      await instanceNFT.pause();

      expect(await instanceNFT.paused()).to.be.equal(true);

    });

    it("Should unpause correctly", async () => {

      await instanceNFT.pause();
      expect(await instanceNFT.paused()).to.be.equal(true);

      await instanceNFT.unpause();
      expect(await instanceNFT.paused()).to.be.equal(false);

    });

    it("Shouldn't mint while paused", async () => {

      await instanceNFT.pause();

      await expect(instanceNFT.mint(addr1.address, "QmbWqibQSuvvsGVDUVvDCGdgcdCDCfycDFC3VV4v4Ghgc4")).to.be.revertedWith("Pausable: paused");
    });

  });
});
