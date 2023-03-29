import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { JO2024, JO2024__factory } from "../typechain-types";

async function main() {
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();

  // Create factory
  const JO2024 = new JO2024__factory(owner);

  // Deploy
  const instanceJO2024 = (await JO2024.deploy()) as JO2024;

  await instanceJO2024.deployed();

  console.log(`deployed to ${instanceJO2024.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
