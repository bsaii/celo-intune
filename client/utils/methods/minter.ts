import { ChangeEvent } from 'react';
import { Contract } from 'web3-eth-contract';
import { UseCelo } from '@celo/react-celo';
import { Web3Storage } from 'web3.storage';
import axios from 'axios';
import { create } from 'ipfs-http-client';

// initialize IPFS
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID || '';
const INFURA_SECRET_KEY = process.env.NEXT_PUBLIC_INFURA_SECRET_KEY || '';
const auth =
  'Basic ' +
  Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export type MintSong = {
  album: string;
  animation_url: string;
  artists: string;
  duration: string;
  image: string;
  name: string;
};

// mint a Song
export const _mintSong = async (
  intuneContract: Contract,
  cUsdContract: Contract,
  performActions: UseCelo['performActions'],
  data: MintSong,
) => {
  const { album, animation_url, artists, duration, image, name } = data;
  const isValid = Object.values(data).filter((item) => item).length === 0;

  await performActions(async (kit) => {
    if (isValid) {
      throw new Error('No or missing mint song data');
    }

    const defaultAccount = kit.connection.defaultAccount;
    if (!defaultAccount) {
      throw new Error('No default account');
    }

    // Convert NFT metadata to JSON format
    const data = JSON.stringify({
      album,
      animation_url,
      artists,
      duration,
      image,
      name,
    });

    try {
      // save NFT metadata to IPFS
      const added = await client.add(data);

      // IPFS url for uploaded metadata - https://infura-ipfs.io/ipfs/
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;

      // get mintFee
      const mintFee = await intuneContract.methods.getMintFee().call();

      // approve for Token transfer of mintFee
      await cUsdContract.methods.approve(intuneContract, mintFee);

      // mint the NFT and save the IPFS url to the blockchain
      let mint = await intuneContract.methods
        .mintSong(url)
        .send({ from: defaultAccount });

      return mint;
    } catch (error) {
      console.error('Error minting song: ', error);
    }
  });
};

// function to upload a file to IPFS via web3.storage
export const uploadFileToWebStorage = async (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  // Construct with token and endpoint
  const token = process.env.NEXT_PUBLIC_STORAGE_API_KEY as string;

  if (!token) {
    throw new Error(
      'A token is needed. You can create one on https://web3.storage',
    );
  }
  const client = new Web3Storage({ token });

  const file = (e.target as HTMLInputElement).files;
  if (!file) return;
  // Pack files into a CAR and send to web3.storage
  const cid = await client.put(file); // Promise<CIDString>
  console.log('Content added with CID: ', cid);

  // Fetch and verify files from web3.storage
  const res = await client.get(cid); // Promise<Web3Response | null>
  console.log(`Got a response! [${res?.status}] ${res?.statusText}`);
  if (!res?.ok) {
    throw new Error(
      `failed to get ${cid} - [${res?.status}] ${res?.statusText}`,
    );
  }

  // unpack File objects from the response
  const files = (await res?.files()) || []; // Promise<Web3File[]>
  console.log('latest upload: ', files[0]?.cid);

  return `https://infura-ipfs.io/ipfs/${files[0].cid}`;
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl: string) => {
  try {
    if (!ipfsUrl) {
      throw new Error('No ipfs url provided');
    }
    const meta = await axios.get(ipfsUrl);
    return meta;
  } catch (error) {
    console.log('Error fetching metadata: ', error);
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (
  intuneContract: Contract,
  index: number,
) => {
  try {
    return await intuneContract.methods.ownerOf(index).call();
  } catch (error) {
    console.log('Error fetching owner of NFT: ', error);
  }
};

export type GetSong = {
  index: number;
  album: string;
  animation_url: string;
  artists: string;
  duration: string;
  image: string;
  likes: number;
  name: string;
  owner: string;
};

// Get all the songs
export const getSong = async (intuneContract: Contract) => {
  try {
    const songs: GetSong[] = [];
    const songsLength = await intuneContract.methods.totalSupply().call();
    for (let i = 0; i < Number(songsLength); i++) {
      // eslint-disable-next-line no-async-promise-executor
      const song = new Promise<GetSong>(async (resolve) => {
        const uri = await intuneContract.methods.tokenURI(i).call();
        const likes = await intuneContract.methods.getLikes(i).call();
        const meta = await fetchNftMeta(uri);
        const owner = await fetchNftOwner(intuneContract, i);
        resolve({
          index: i,
          album: meta?.data.album,
          animation_url: meta?.data.animation_url,
          artists: meta?.data.artists,
          duration: meta?.data.duration,
          image: meta?.data.image,
          likes,
          name: meta?.data.name,
          owner,
        });
      });
      songs.unshift(await song);
    }
    return Promise.all(songs);
  } catch (error) {
    console.error('Error getting song: ', error);
  }
};
