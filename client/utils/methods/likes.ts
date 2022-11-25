import { Contract } from 'web3-eth-contract';
import { UseCelo } from '@celo/react-celo';
import { fetchNftOwner } from './minter';

export const _likeSong = async (
  intuneContract: Contract,
  cUsdContract: Contract,
  performActions: UseCelo['performActions'],
  id: number,
) => {
  await performActions(async (kit) => {
    if (id < 0) {
      throw new Error('Invalid token id');
    }

    const defaultAccount = kit.connection.defaultAccount;
    if (!defaultAccount) {
      throw new Error('_likeSongs: No default account');
    }

    try {
      const owner = (await fetchNftOwner(intuneContract, id)) as string;
      if (owner.toLowerCase() === defaultAccount.toLowerCase()) {
        // eslint-disable-next-line prettier/prettier
        throw new Error('Owner can\'t like song');
      }
      // approve for Token transfer of mintFee
      await cUsdContract.methods.approve(
        intuneContract,
        kit.connection.web3.utils.toWei('0.15'),
      );
      return await intuneContract.methods
        .likeSong(id)
        .send({ from: defaultAccount });
    } catch (error) {
      console.error('Error liking song: ', error);
    }
  });
};

export type GetLikedSongs = {
  index: number;
  tokenId: number;
};

export const _getLikedSongs = async (
  intuneContract: Contract,
  address: string,
) => {
  try {
    const likedSongs: GetLikedSongs[] = [];
    const likedSongsLength = await intuneContract.methods
      .totalLikedSongs()
      .call();
    for (let i = 0; i < Number(likedSongsLength); i++) {
      // eslint-disable-next-line no-async-promise-executor
      const likedSong = new Promise<GetLikedSongs>(async (resolve) => {
        const res = await intuneContract.methods
          .getLikedSongs(i, address)
          .call();
        resolve({
          index: i,
          tokenId: res,
        });
      });
      likedSongs.unshift(await likedSong);
    }
    return Promise.all(likedSongs);
  } catch (error) {
    // eslint-disable-next-line prettier/prettier
    console.error('Error getting user\'s liked songs: ', error);
    
  }
};
