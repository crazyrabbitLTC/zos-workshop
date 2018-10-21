require('chai').should();
const behavesLikeWallet = require('./Wallet.behaviour');

const Wallet = artifacts.require('OldWallet');

contract('Wallet', function (accounts) {
  const [walletOwner] = accounts;

  beforeEach('deploying wallet', async function () {
    this.wallet = await Wallet.new(walletOwner, { from: walletOwner });
  });

  behavesLikeWallet(accounts);
});