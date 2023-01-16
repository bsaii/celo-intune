import { IERC20, Intune } from '../types/web3-v1-contracts';
import { useCallback, useEffect, useState } from 'react';
import type { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { useCelo } from '@celo/react-celo';

// eslint-disable-next-line sort-imports
import ERC20Abi from '../utils/ABIs/IERC20.json';
import IntuneAbi from '../utils/ABIs/Intune.json';
export const IntuneContractAddress =
  '0xb00d0505dca3D1419E49e3B9F3Abbee5CD374B4B';
const cUsdTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
const RPC_HOST = 'https://alfajores-forno.celo-testnet.org';

export type ContractAbis = IERC20 | Intune;

/** Returns a new instance of the Contract connected to provider which is read-only. */
export function useContract(abi: AbiItem | AbiItem[], contractAddress: string) {
  const { address } = useCelo();
  const [contract, setContract] = useState<ContractAbis>();

  const getContract = useCallback(async () => {
    const web3 = new Web3(RPC_HOST);

    const _contract = new web3.eth.Contract(
      abi,
      contractAddress,
    ) as unknown as ContractAbis;

    setContract(_contract);
  }, [abi, contractAddress]);

  useEffect(() => {
    if (address) {
      try {
        return void (async () => {
          await getContract();
        })();
      } catch (error) {
        console.error(`Error ${typeof getContract} getContract: `, error);
      }
    } else {
      console.error(
        `Error ${typeof getContract} getContract: Wallet not connected.`,
      );
    }
  }, [address, getContract]);

  return contract;
}

/** Returns a new instance of the Contract connected to signer, so that you can pay to send state-changing transactions. */
export function useContractWithSigner(
  abi: AbiItem | AbiItem[],
  contractAddress: string,
) {
  const { address, getConnectedKit } = useCelo();
  const [contractWithSigner, setContractWithSigner] = useState<ContractAbis>();

  const getContractWithSigner = useCallback(async () => {
    const kit = await getConnectedKit();

    const _contractWithSigner = new kit.connection.web3.eth.Contract(
      abi as any,
      contractAddress,
    ) as unknown as ContractAbis;

    setContractWithSigner(_contractWithSigner);
  }, [abi, contractAddress, getConnectedKit]);

  useEffect(() => {
    if (address) {
      try {
        return void (async () => {
          await getContractWithSigner();
        })();
      } catch (error) {
        console.error(
          `Error ${typeof getContractWithSigner}: getContractWithSigner `,
          error,
        );
      }
    } else {
      console.error(
        `Error ${typeof getContractWithSigner}: getContractWithSigner Wallet not connected.`,
      );
    }
  }, [address, getContractWithSigner]);

  return contractWithSigner;
}

// Read-Only Contracts
export const useIntuneContract = () =>
  useContract(IntuneAbi as AbiItem[], IntuneContractAddress);
export const useCUSDContract = () =>
  useContract(ERC20Abi as AbiItem[], cUsdTokenAddress);

// State Changing Contracts
export const useIntuneContractWithSigner = () =>
  useContractWithSigner(IntuneAbi as AbiItem[], IntuneContractAddress);
export const useCUSDContractWithSigner = () =>
  useContractWithSigner(ERC20Abi as AbiItem[], cUsdTokenAddress);
