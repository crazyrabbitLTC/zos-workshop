require('chai').should();
const assertRevert = require('zos-lib').assertRevert;
const behavesLikeWallet = require('../Wallet.behaviour');

const SampleERC20 = artifacts.require('SampleERC20');

contract('MultiOwnerWallet', function (accounts) {
  const [walletOwner, tokenOwner, someoneElse] = accounts;

  beforeEach('deploying upgradeable wallet', async function () {
    const MultiOwnerWallet = artifacts.require('MultiOwnerWallet');
    this.wallet = await MultiOwnerWallet.new({ from: walletOwner });
    await this.wallet.initialize(walletOwner);
  });

  behavesLikeWallet(accounts);

  describe('multi owners', function () {
    beforeEach('deploys ERC20', async function () {
      this.erc20 = await SampleERC20.new({ from: tokenOwner });
      await this.erc20.transfer(this.wallet.address, 20e8, { from: tokenOwner });
    });

    it('can transfer from its owner', async function () {
      this.wallet.transferERC20(this.erc20.address, someoneElse, 1e8, { from: walletOwner });
      (await this.erc20.balanceOf(someoneElse)).toNumber().should.eq(1e8);
    });

    it('cannot transfer from someone else', async function () {
      await assertRevert(this.wallet.transferERC20(this.erc20.address, someoneElse, 1e8, { from: someoneElse }));
    });

    it('can transfer from someone else if granted access', async function () {
      await this.wallet.grantAccess(someoneElse, { from: walletOwner });
      this.wallet.transferERC20(this.erc20.address, someoneElse, 1e8, { from: someoneElse });
      (await this.erc20.balanceOf(someoneElse)).toNumber().should.eq(1e8);
    });
  });
});