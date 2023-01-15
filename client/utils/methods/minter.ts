import { IERC20, Intune } from '../../types/web3-v1-contracts';
import { IntuneContractAddress } from '../../hooks/useContract';
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

export interface MintSong {
  image: string;
  animation_url: string;
  artist: string;
  duration: string;
  title: string;
}

/** @dev mint a song */
export const _mintSong = async (
  intuneContract: Intune,
  cUsdContract: IERC20,
  performActions: UseCelo['performActions'],
  data: MintSong,
) => {
  const { animation_url, artist, duration, image, title } = data;
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
      animation_url,
      artist,
      duration,
      image,
      title,
    });

    try {
      // save NFT metadata to IPFS
      const added = await client.add(data);

      // IPFS url for uploaded metadata - https://saii.infura-ipfs.io/ipfs/
      const metadataUri = `https://saii.infura-ipfs.io/ipfs/${added.path}`;

      // get mintFee
      const mintFee = await intuneContract.methods.getMintFee().call();

      // approve for Token transfer of mintFee
      await cUsdContract.methods
        .approve(IntuneContractAddress, mintFee)
        .send({ from: defaultAccount });

      // mint the NFT and save the IPFS url to the blockchain
      let mint = await intuneContract.methods
        .mintSong(metadataUri)
        .send({ from: defaultAccount });

      return mint;
    } catch (error) {
      console.error('Error minting song: ', error);
    }
  });
};

/** returns an IPFS gateway URL for the given CID and path */
export const makeGatewayURL = (cid: string, path: string) => {
  return `https://${cid}.ipfs.w3s.link/${encodeURIComponent(path)}`;
};

/** @dev uploads a file to IPFS via web3.storage */
export const uploadFileToWebStorage = async (file: File[]) => {
  // Construct with token and endpoint
  const token = process.env.NEXT_PUBLIC_STORAGE_API_KEY ?? '';

  if (!token) {
    throw new Error(
      'A token is needed. You can create one on https://web3.storage',
    );
  }
  const client = new Web3Storage({ token });

  if (!file)
    console.error(
      `Error ${typeof uploadFileToWebStorage} uploadFileToWebStorage: No file provided`,
    );

  // Pack files into a CAR and send to web3.storage
  console.log('Uploading file to web3Storage...');
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

  const _url = makeGatewayURL(cid, file[0].name);

  if (!_url)
    console.error(
      `Error ${typeof uploadFileToWebStorage} uploadFileToWebStorage: Failed to make gateway url.`,
    );

  return _url;

  // unpack File objects from the response
  // const files = (await res?.files()) || []; // Promise<Web3File[]>
  // console.log('latest upload: ', files[0]?.cid);

  // return `https://infura-ipfs.io/ipfs/${files[0].cid}`;
};

/** @dev get the metedata for an NFT from IPFS */
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

/** @dev get the owner address of an NFT */
export const fetchNftOwner = async (intuneContract: Intune, index: number) => {
  try {
    return await intuneContract.methods.ownerOf(index).call();
  } catch (error) {
    console.log('Error fetching owner of NFT: ', error);
  }
};

export type GetSong = {
  index: number;
  animation_url: string;
  artist: string;
  duration: string;
  image: string;
  likes: number;
  title: string;
  owner: string;
};

/** @dev Get all minted songs */
export const getSong = async (intuneContract: Intune) => {
  try {
    const songs: Array<GetSong> = [];
    const songsLength = await intuneContract.methods.totalSupply().call();
    for (let i = 0; i < Number(songsLength); i++) {
      const song = new Promise<GetSong>((resolve) => {
        void (async () => {
          const uri = await intuneContract.methods.tokenURI(i).call();
          const meta = await fetchNftMeta(uri);
          const _song = await intuneContract.methods.getSong(i).call();

          resolve({
            index: i,
            animation_url: meta?.data.animation_url,
            artist: meta?.data.artist,
            duration: meta?.data.duration,
            image: meta?.data.image,
            likes: parseInt(_song?.likes),
            title: meta?.data.title,
            owner: _song?._owner,
          });
        })();
      });
      songs.unshift(await song);
    }
    return Promise.all(songs);
  } catch (error) {
    console.error('Error getting song: ', error);
  }
};
