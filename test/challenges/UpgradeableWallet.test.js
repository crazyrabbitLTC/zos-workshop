require('chai').should();
const behavesLikeWallet = require('../Wallet.behaviour');

contract('UpgradeableWallet', function (accounts) {
  const [walletOwner] = accounts;

  beforeEach('deploying upgradeable wallet', async function () {
    const UpgradeableWallet = artifacts.require('UpgradeableWallet');
    this.wallet = await UpgradeableWallet.new({ from: walletOwner });
    await this.wallet.initialize(walletOwner);
  });

  behavesLikeWallet(accounts);
});