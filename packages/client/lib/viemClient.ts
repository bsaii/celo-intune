import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';

const infura_api_key = process.env.NEXT_PUBLIC_INFURA_API_KEY ?? '';

export const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(`https://celo-alfajores.infura.io/v3/${infura_api_key}`),
});
