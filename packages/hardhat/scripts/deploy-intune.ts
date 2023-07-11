import { ethers } from 'hardhat';

async function main() {
  const initFunding = ethers.utils.parseEther('1.5');
  const Intune = await ethers.getContractFactory('Intune');
  const intune = await Intune.deploy({ value: initFunding });
  await intune.deployed();

  console.log('Contract deployed at: ', intune.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Contract deployed at:  0x45d2f7cB3104D57551a3255Aa0B9E2DAeE688D34
// Stable Coin address:   0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
