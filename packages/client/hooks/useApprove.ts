import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { IERC20 } from '@/lib/ABIs';
import { parseEther } from 'viem';

const celo_stableCoint_address = process.env
  .NEXT_PUBLIC_CELO_STABLECOIN_CONTRACT_ADDRESS as `0x${string}`;
const intune_address = process.env
  .NEXT_PUBLIC_INTUNE_CONTRACT_ADDRESS as `0x${string}`;

export const useApproveCoin = (amt: number) => {
  const {
    config,
    error: prepareApproveCoinError,
    isError: isPrepareApproveCoinError,
  } = usePrepareContractWrite({
    abi: IERC20,
    address: celo_stableCoint_address,
    functionName: 'approve',
    args: [intune_address, parseEther(`${amt}`)],
    onSettled(data, error) {
      console.log('Settled Prepare ApproveCoin: ', { data, error });
    },
  });

  const {
    data: approveCoinData,
    error: approveCoinError,
    isError: isApproveCoinError,
    status: approveCoinStatus,
    writeAsync: approveCoinWriteAsync,
  } = useContractWrite({
    ...config,
    onSettled(data, error) {
      console.log('Settled ApproveCoin: ', { data, error });
    },
  });

  return {
    approveCoinData,
    approveCoinError,
    approveCoinStatus,
    approveCoinWriteAsync,
    isApproveCoinError,
    isPrepareApproveCoinError,
    prepareApproveCoinError,
  };
};
