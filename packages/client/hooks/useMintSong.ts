import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Intune } from '@/lib/ABIs';
import { parseEther } from 'viem';
import { useAppContext } from '@/lib/context';

const intune_address = process.env
  .NEXT_PUBLIC_INTUNE_CONTRACT_ADDRESS as `0x${string}`;
const celo_stableCoint_address = process.env
  .NEXT_PUBLIC_CELO_STABLECOIN_CONTRACT_ADDRESS as `0x${string}`;

export const useMintSong = () => {
  const { state } = useAppContext();
  const { tokenUri } = state;

  const {
    config,
    error: prepareMintSongError,
    isError: isPrepareMintSongError,
  } = usePrepareContractWrite({
    abi: Intune,
    address: intune_address,
    functionName: 'mintSong',
    args: [tokenUri, celo_stableCoint_address],
    value: parseEther(`${0.35}`), // mint fee
    onSettled(data, error) {
      console.log('Settled Prepare Mint Song: ', { data, error });
    },
  });

  const {
    data: mintSongData,
    error: mintSongError,
    isError: isMintSongError,
    status: mintSongStatus,
    writeAsync: mintSongWriteAsync,
  } = useContractWrite({
    ...config,
    onSettled(data, error) {
      console.log('Settled Mint Song: ', { data, error });
    },
  });

  const {
    data: mintSongTxn,
    isLoading: isLoadingMintSongTxn,
    isSuccess: isMintSongTxnSuccess,
  } = useWaitForTransaction({ hash: mintSongData?.hash });

  return {
    isLoadingMintSongTxn,
    isMintSongError,
    isMintSongTxnSuccess,
    isPrepareMintSongError,
    mintSongError,
    mintSongStatus,
    mintSongTxn,
    mintSongWriteAsync,
    prepareMintSongError,
  };
};
