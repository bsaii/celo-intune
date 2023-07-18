import { infuraClient } from '.';

const INFURA_DEDICATED_GATEWAY_SUBDOMAIN =
  process.env.NEXT_PUBLIC_INFURA_DEDICATED_GATEWAY_SUBDOMAIN ?? '';

/** Upload a file across the IPFS network using Infura's API endpoint */
export const uploadFileToIPFS = async (
  file: File,
  setUploadProg: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!file) {
    throw new Error('Error uploadFileToIPFS: No file provided.');
  }

  try {
    const fileData = await file.arrayBuffer();
    const added = await infuraClient.add(fileData, {
      progress: (prog) => {
        const progress = Math.round((prog / file.size) * 100);
        setUploadProg(progress);
      },
    });
    if (added) {
      return `${INFURA_DEDICATED_GATEWAY_SUBDOMAIN}/ipfs/${added.path}`;
    }
  } catch (error) {
    console.error('Error uploading file to IPFS.', error);
  }
};
