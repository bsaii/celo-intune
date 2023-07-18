import { infuraClient } from '.';

export interface SongMetadata {
  /** This is the URL to the cover image of the item */
  image: string;
  /** The song title. */
  name: string;
  /**
A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA. */
  animation_url: string;
  /** The name of the artist */
  artist: string;
  // /** The duration of the song */
  duration: string;
}

const INFURA_DEDICATED_GATEWAY_SUBDOMAIN =
  process.env.NEXT_PUBLIC_INFURA_DEDICATED_GATEWAY_SUBDOMAIN ?? '';

export const uploadJSONToIPFS = async (metadata: SongMetadata) => {
  const data = JSON.stringify(metadata);

  try {
    const added = await infuraClient.add(data, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    if (added) {
      return `${INFURA_DEDICATED_GATEWAY_SUBDOMAIN}/ipfs/${added.path}`;
    }
  } catch (error) {
    console.error('Error adding metadata to IPFS.', error);
  }
};
