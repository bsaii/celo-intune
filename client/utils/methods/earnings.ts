import { Contract } from 'web3-eth-contract';
import { UseCelo } from '@celo/react-celo';

export const _getEarnings = async (intuneContract: Contract, owner: string) => {
  try {
    const earnings = await intuneContract.methods.getEarnings(owner).call();
    return earnings as number;
  } catch (error) {
    console.error('Error getting earnings: ', error);
  }
};

export const _withdrawEarnings = async (
  intuneContract: Contract,
  cUsdContract: Contract,
  performActions: UseCelo['performActions'],
  owner: string,
) => {
  await performActions(async (kit) => {
    const defaultAccount = kit.connection.defaultAccount;
    if (!defaultAccount) {
      throw new Error('_withdrawEarnings: No default account');
    }

    try {
      // Get the earnings
      const earnings = String(_getEarnings(intuneContract, owner));
      // approve for Token transfer of mintFee
      await cUsdContract.methods.approve(
        intuneContract,
        kit.connection.web3.utils.toWei(earnings),
      );
      return intuneContract.methods
        .withdrawEarnings(owner)
        .send({ from: defaultAccount });
    } catch (error) {
      console.error('Error withdrawing earnings: ', error);
    }
  });
};
