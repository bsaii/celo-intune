import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Signer } from 'ethers';

describe('Intune', function () {
  async function deployIntuneFixture() {
    let owner: Signer;
    let user1: Signer;
    let user2: Signer;
    const initFunding = ethers.utils.parseEther('1.5');
    const Intune = await ethers.getContractFactory('Intune');
    const intune = await Intune.deploy({ value: initFunding });
    await intune.deployed();

    [owner, user1, user2] = await ethers.getSigners();

    return { intune, owner, user1, user2 };
  }

  async function deployCeloStableTokenFixture() {
    const StableToken = await ethers.getContractFactory('CeloStableToken');
    const cUsdToken = await StableToken.deploy();
    await cUsdToken.deployed();

    return { cUsdToken };
  }

  it('should have initial funding more than 1 ETH', async function () {
    const { intune } = await loadFixture(deployIntuneFixture);
    const intuneBalance = await ethers.provider.getBalance(intune.address);
    expect(intuneBalance).to.greaterThan(ethers.utils.parseEther('1'));
  });

  it('should allow a user to mint a song by paying the minting fee', async function () {
    const { intune, user1 } = await loadFixture(deployIntuneFixture);
    const { cUsdToken } = await loadFixture(deployCeloStableTokenFixture);
    const mintFee = ethers.utils.parseEther('0.35');

    // transfer token to user
    await cUsdToken.transfer(
      await user1.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the minting fee
    const user1_tokens = cUsdToken.connect(user1);
    await user1_tokens.approve(intune.address, mintFee);

    // Check the allowance for the user
    const user1_token_allowance = await cUsdToken.allowance(
      await user1.getAddress(),
      intune.address
    );
    expect(user1_token_allowance).to.equal(mintFee);

    // Mint the song
    const uri =
      'https://saii.infura-ipfs.io/ipfs/QmYyYfZka2ZKVAH7dz4suFuf8eDJvtnWnUgwkTZXTb6ehh';
    await intune
      .connect(user1)
      .mintSong(uri, cUsdToken.address, { value: mintFee });

    // Check if the song was minted
    const songOwner = await intune.ownerOf(0);
    expect(songOwner).to.equal(await user1.getAddress());

    // Assert the song details are correct
    const song = await intune.getSong(0);
    expect(song.owner).to.equal(await user1.getAddress());
    expect(song.likes).to.equal(0);
    expect(song.comments).to.equal(0);
    expect(song.price).to.equal(0);
    expect(song.isListed).to.be.false;
  });

  it('should allow users to like a song and update song likes', async function () {
    const { intune, user1, user2 } = await loadFixture(deployIntuneFixture);
    const { cUsdToken } = await loadFixture(deployCeloStableTokenFixture);
    const mintFee = ethers.utils.parseEther('0.35');
    const likeFee = ethers.utils.parseEther('0.15');

    // transfer token to user One
    await cUsdToken.transfer(
      await user1.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the minting fee
    const user1_tokens = cUsdToken.connect(user1);
    await user1_tokens.approve(intune.address, mintFee);

    // Check the allowance for the user
    const user1_token_allowance = await cUsdToken.allowance(
      await user1.getAddress(),
      intune.address
    );
    expect(user1_token_allowance).to.equal(mintFee);

    // Mint the song
    const uri =
      'https://saii.infura-ipfs.io/ipfs/QmYyYfZka2ZKVAH7dz4suFuf8eDJvtnWnUgwkTZXTb6ehh';
    await intune
      .connect(user1)
      .mintSong(uri, cUsdToken.address, { value: mintFee });

    // transfer token to user Two
    await cUsdToken.transfer(
      await user2.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the like song price
    const user2_tokens = cUsdToken.connect(user2);
    await user2_tokens.approve(intune.address, likeFee);

    // Check the user allowance
    const user2_token_allowance = await cUsdToken.allowance(
      await user2.getAddress(),
      intune.address
    );
    expect(user2_token_allowance).to.equal(likeFee);

    // Like a song
    await intune
      .connect(user2)
      .likeSong(0, 'Great Song', cUsdToken.address, { value: likeFee });

    // Assert the song likes are updated
    const song = await intune.getSong(0);
    expect(song.likes).to.equal(1);
  });

  it('should list a song for sale and update song details', async function () {
    const { intune, user1 } = await loadFixture(deployIntuneFixture);
    const { cUsdToken } = await loadFixture(deployCeloStableTokenFixture);
    const mintFee = ethers.utils.parseEther('0.35');

    // transfer token to user One
    await cUsdToken.transfer(
      await user1.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the minting fee
    const user1_tokens = cUsdToken.connect(user1);
    await user1_tokens.approve(intune.address, mintFee);

    // Check the allowance for the user
    const user1_token_allowance = await cUsdToken.allowance(
      await user1.getAddress(),
      intune.address
    );
    expect(user1_token_allowance).to.equal(mintFee);

    // Mint the song
    const uri =
      'https://saii.infura-ipfs.io/ipfs/QmYyYfZka2ZKVAH7dz4suFuf8eDJvtnWnUgwkTZXTb6ehh';
    await intune
      .connect(user1)
      .mintSong(uri, cUsdToken.address, { value: mintFee });

    // Approve the smart contract for the ERC721
    await intune.connect(user1).approve(intune.address, 0);

    // List the song for sale
    const price = ethers.utils.parseEther('5');
    await intune.connect(user1).listSongForSale(0, price);

    // Get the updated song details
    const song = await intune.getSong(0);

    // Assert the song details are updated
    expect(song.price).to.equal(price);
    expect(song.isListed).to.be.true;
  });

  it('should allow a user to purchase a song and update song ownership', async function () {
    const { intune, user1, user2 } = await loadFixture(deployIntuneFixture);
    const { cUsdToken } = await loadFixture(deployCeloStableTokenFixture);
    const mintFee = ethers.utils.parseEther('0.35');

    // transfer token to user One
    await cUsdToken.transfer(
      await user1.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the minting fee
    const user1_tokens = cUsdToken.connect(user1);
    await user1_tokens.approve(intune.address, mintFee);

    // Check the allowance for the user
    const user1_token_allowance = await cUsdToken.allowance(
      await user1.getAddress(),
      intune.address
    );
    expect(user1_token_allowance).to.equal(mintFee);

    // Mint the song
    const uri =
      'https://saii.infura-ipfs.io/ipfs/QmYyYfZka2ZKVAH7dz4suFuf8eDJvtnWnUgwkTZXTb6ehh';
    await intune
      .connect(user1)
      .mintSong(uri, cUsdToken.address, { value: mintFee });

    // Approve the smart contract for the ERC721
    await intune.connect(user1).approve(intune.address, 0);

    // List the song for sale
    const price = ethers.utils.parseEther('5');
    await intune.connect(user1).listSongForSale(0, price);

    // transfer token to user Two
    await cUsdToken.transfer(
      await user2.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve tokens for the sale price
    const user2_tokens = cUsdToken.connect(user2);
    await user2_tokens.approve(intune.address, price);

    // Purchase the song
    await intune.connect(user2).purchaseSong(0, cUsdToken.address);

    // Get the updated song details
    const song = await intune.getSong(0);

    // Assert the song ownership and status are updated
    expect(await intune.ownerOf(0)).to.equal(await user2.getAddress());
    expect(song.isListed).to.be.false;
  });

  it('should withdraw earnings and update earnings balance', async function () {
    const { intune, user1, user2 } = await loadFixture(deployIntuneFixture);
    const { cUsdToken } = await loadFixture(deployCeloStableTokenFixture);
    const mintFee = ethers.utils.parseEther('0.35');
    const likeFee = ethers.utils.parseEther('0.15');

    // transfer token to user One
    await cUsdToken.transfer(
      await user1.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the minting fee
    const user1_tokens = cUsdToken.connect(user1);
    await user1_tokens.approve(intune.address, mintFee);

    // Check the allowance for the user
    const user1_token_allowance = await cUsdToken.allowance(
      await user1.getAddress(),
      intune.address
    );
    expect(user1_token_allowance).to.equal(mintFee);

    // Mint the song
    const uri =
      'https://saii.infura-ipfs.io/ipfs/QmYyYfZka2ZKVAH7dz4suFuf8eDJvtnWnUgwkTZXTb6ehh';
    await intune
      .connect(user1)
      .mintSong(uri, cUsdToken.address, { value: mintFee });

    // transfer token to user Two
    await cUsdToken.transfer(
      await user2.getAddress(),
      ethers.utils.parseEther('1000')
    );

    // Approve the like song price
    const user2_tokens = cUsdToken.connect(user2);
    await user2_tokens.approve(intune.address, likeFee);

    // Check the user allowance
    const user2_token_allowance = await cUsdToken.allowance(
      await user2.getAddress(),
      intune.address
    );
    expect(user2_token_allowance).to.equal(likeFee);

    // Like a song
    await intune
      .connect(user2)
      .likeSong(0, 'Great Song', cUsdToken.address, { value: likeFee });

    // Get the owner's initial earnings balance
    const onwersEarnings = await intune.getEarnings(await user1.getAddress());
    expect(onwersEarnings).to.equal(likeFee);

    // Withdraw earnings
    await intune.connect(user1).withdrawEarnings(cUsdToken.address);

    // Assert the earnings balance is updated to zero
    const onwersFinalEarnings = await intune.getEarnings(
      await user1.getAddress()
    );
    expect(onwersFinalEarnings).to.equal(ethers.utils.parseEther('0'));
  });
});
