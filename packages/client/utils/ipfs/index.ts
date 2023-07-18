import { create } from 'ipfs-http-client';

// initialize Infura IPFS
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID ?? '';
const INFURA_PROJECT_SECRET_KEY =
  process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET_KEY ?? '';

const auth =
  'Basic ' +
  Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET_KEY).toString(
    'base64'
  );

export const infuraClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export * from './uploadFile';
export * from './uploadJSON';
