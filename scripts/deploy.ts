import { ethers } from "hardhat";

// Contract deployed to: 0xb00d0505dca3D1419E49e3B9F3Abbee5CD374B4B

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
