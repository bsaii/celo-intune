import { IERC20, Intune } from '../../types/web3-v1-contracts';
import { IntuneContractAddress } from '../../hooks/useContract';
import { UseCelo } from '@celo/react-celo';

export const _getEarnings = async (intuneContract: Intune, owner: string) => {
  try {
    return await intuneContract.methods.getEarnings(owner).call();
  } catch (error) {
    console.error('Error getting earnings: ', error);
  }
};

export const _withdrawEarnings = async (
  intuneContract: Intune,
  cUsdContract: IERC20,
  performActions: UseCelo['performActions'],
  owner: string,
) => {
  await performActions(async (kit) => {
    const defaultAccount = kit.connection.defaultAccount;
    if (!defaultAccount) {
      throw new Error('function _withdrawEarnings: No default account');
    }

    try {
      // Get the earnings
      const earnings = _getEarnings(intuneContract, defaultAccount);
      // approve for Token transfer of mintFee
      await cUsdContract.methods
        .approve(IntuneContractAddress, earnings as unknown as string)
        .send({ from: defaultAccount });
      return intuneContract.methods
        .withdrawEarnings(owner)
        .send({ from: defaultAccount });
    } catch (error) {
      console.error('Error withdrawing earnings: ', error);
    }
  });
};
