require('chai').should();

const SampleERC20 = artifacts.require('SampleERC20');

function behavesLikeWallet(accounts) {
  const [walletOwner, tokenOwner, tokenRecipient] = accounts;
  
  describe('like Wallet', function () {
    beforeEach('deploys ERC20', async function () {
      this.erc20 = await SampleERC20.new({ from: tokenOwner });
    });

    it('can accept tokens', async function () {
      await this.erc20.transfer(this.wallet.address, 20e8, { from: tokenOwner });
      (await this.erc20.balanceOf(this.wallet.address)).toNumber().should.eq(20e8);
    });

    it('can transfer tokens', async function () {
      await this.erc20.transfer(this.wallet.address, 20e8, { from: tokenOwner });
      await this.wallet.transferERC20(this.erc20.address, tokenRecipient, 5e8, { from: walletOwner });
      (await this.erc20.balanceOf(tokenRecipient)).toNumber().should.eq(5e8);
    });
  });
}

module.exports = behavesLikeWallet;