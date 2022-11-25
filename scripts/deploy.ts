import { ethers } from "hardhat";

// Contract deployed to: 0xB29094f86dB2827800dFb5d31743Cb42A92d508A

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
