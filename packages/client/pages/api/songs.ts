import type { NextApiRequest, NextApiResponse } from 'next';
import { Intune } from '@/lib/ABIs';
import { SongMetadata } from '@/utils/ipfs';
import axios from 'axios';
import { publicClient } from '@/lib/viemClient';

const intune_address = process.env
  .NEXT_PUBLIC_INTUNE_CONTRACT_ADDRESS as `0x${string}`;

export interface SongsData {
  data: {
    owner: `0x${string}`;
    likes: number;
    comments: number;
    price: number;
    isListed: boolean;
    metadata: SongMetadata;
  }[];
}

type ResponseError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongsData | ResponseError>
) {
  const { method } = req;
  if (method !== 'GET') {
    return res
      .status(405)
      .json({ error: `${method ?? ''} Method Not Allowed` });
  }

  async function getAllSongs() {
    const allSongs = await publicClient.readContract({
      abi: Intune,
      address: intune_address,
      functionName: 'getAllSongs',
    });

    if (allSongs.length >= 0) {
      const songs = allSongs.map((song) => {
        const { comments, isListed, likes, owner, price } = song;
        return {
          comments: parseInt(comments.toString()),
          isListed,
          likes: parseInt(likes.toString()),
          owner,
          price: parseInt(price.toString()),
          metadata: {} as SongMetadata,
        };
      });

      const metadataPromises = songs.map(async (song, index) => {
        const tokenUri = await publicClient.readContract({
          abi: Intune,
          address: intune_address,
          functionName: 'tokenURI',
          args: [BigInt(index)],
        });

        try {
          const { data: metadata } = await axios.get<SongMetadata>(tokenUri);
          song.metadata = metadata;
        } catch (error) {
          console.error('Error fetching songs.', error);
        }
      });

      await Promise.all(metadataPromises);

      return songs.reverse();
    } else {
      throw new Error('Error fetching all songs.');
    }
  }

  try {
    const songs = await getAllSongs();
    return res.status(200).json({ data: songs ?? [] });
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Error fetching all song: ${error as string}` });
  }
}
