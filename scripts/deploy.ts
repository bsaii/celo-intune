import { ethers } from "hardhat";

// Contract deployed to: 0x9d9018CF68D0fF744c4963B6e9B142215Ffc81AE

async function main() {
  const amt = ethers.utils.parseEther("1.5");

  const Intune = await ethers.getContractFactory("IntuneToken");
  const intune = await Intune.deploy({ value: amt });

  await intune.deployed();

  console.log(`Contract deployed to: ${intune.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
