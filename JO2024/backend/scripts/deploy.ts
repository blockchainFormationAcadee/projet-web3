import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { NFT, NFT__factory } from "../typechain-types";

async function main() {
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();

  const name = "JO 2024 Paris";
  const symbol = "JO";
  const baseURI = "ipfs://bafybeigcxzbzbs2p3x2yjqu2y6n5i7qqjj6lbbryjqvunp6u6p22fi5j3y";

  // Create factory
  const NFT = new NFT__factory(owner);

  // Deploy
  //const instanceNFT = (await NFT.deploy(name, symbol, baseURI)) as NFT;
  const instanceNFT = (await NFT.deploy()) as NFT;

  await instanceNFT.deployed();

  console.log(`deployed to ${instanceNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
