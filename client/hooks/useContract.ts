import { useCallback, useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { useCelo } from '@celo/react-celo';

// eslint-disable-next-line sort-imports
import ERC20Abi from '../utils/ABIs/IERC20.json';
import IntuneAbi from '../utils/ABIs/Intune.json';
const IntuneContractAddress = '0x1f210c6c1Ba279be3797f31031915838850EadE3';
const cUsdTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';

export function useContract(
  abi: AbiItem | AbiItem[],
  contractAddress: string | undefined,
) {
  const { getConnectedKit, address } = useCelo();
  const [contract, setContract] = useState<Contract>();

  const getContract = useCallback(async () => {
    const kit = await getConnectedKit();

    // get a contract interface to interact with
    setContract(
      new kit.connection.web3.eth.Contract(
        abi,
        contractAddress,
      ) as unknown as Contract,
    );
  }, [abi, contractAddress, getConnectedKit]);

  useEffect(() => {
    if (address) getContract();
  }, [address, getContract]);

  return contract;
}

export const useIntuneContract = () =>
  useContract(IntuneAbi as AbiItem[], IntuneContractAddress);

export const useCUSDContract = () =>
  useContract(ERC20Abi as AbiItem[], cUsdTokenAddress);
