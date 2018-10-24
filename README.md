# ZeppelinOS Workshop

Workshop on upgradeability and [EVM packages](https://blog.zeppelinos.org/open-source-collaboration-in-the-blockchain-era-evm-packages/) based on [ZeppelinOS](https://zeppelinos.org) v2.

This repository contains a base contract, guides to deploy an upgradeable version of it, and to leverage the EVM package [`openzeppelin-eth`](https://github.com/openZeppelin/openzeppelin-eth), plus a set of challenges to upgrade the base contract and play with the ZeppelinOS CLI.

## Setup

_All the following commands have been tested in Ubuntu Linux and OSX, and depend on [`nodejs`](https://nodejs.org/). These instructions should also work on Windows, but YMMV._

1. Clone this repository and install all dependencies:

```sh
git clone git@github.com:spalladino/zos-workshop.git
cd zos-workshop
npm install
```

2. Compile the contracts:

```sh
npx truffle compile
```

3. Run tests to check everything is working fine:

```sh
npm test
```

4. Start a local ganache instance for development:

```sh
./start-ganache
```

## Working with ZeppelinOS

### Deployment

To support upgradeability we first need to make some changes to our contract. The most important one is to convert the constructor into an initializer (you can check the solution in `UpgradeableWallet.sol`).

Once set up, we will spin up our ZeppelinOS project and deploy it to a local ganache network using one of our local accounts. Run the following commands:

```sh
npx zos init my-wallet
npx zos add UpgradeableWallet:Wallet
npx zos session --network local --from 0x22d491bde2303f2f43325b2108d26f1eaba1e32b --expires 86400
```

We can now create our wallet instance, and set one of our local accounts as the owner:

```sh
npx zos create Wallet --init --args 0xffcf8fdee72ac11b5c542428b35eef5769c409f0
```

### Linking an EVM Package

To play around with the wallet, we'll need an ERC20 contract. We can use one of the contracts provided by `openzeppelin-eth` to do this.

```sh
npx zos link openzeppelin-eth --no-install
npx zos push --deploy-dependencies
```

Note that we'll need to deploy a local instance of `openzeppelin-eth` in this case since we're on a local ganache network. On a testnet or mainnet, `zos` will automatically use the deployed instances already provided by the package.

We can now create an ERC20 upgradeable contract from a logic contract provided by `openzeppelin-eth`, which has the following initializer:

```solidity
function initialize(
  string name, string symbol, uint8 decimals, uint256 initialSupply, address initialHolder,
  address[] minters, address[] pausers
) public initializer
```

We'll create an instance of the `StandaloneERC20` contract by running the following, replacing the wallet address:

```sh
npx zos create openzeppelin-eth/StandaloneERC20 --init --args 'MyToken,MYT,8,10000000000,WALLET_ADDRESS,[],[]'
```

### Testing our wallet

We can now fire up a truffle console to interact with our wallet and test it.

```sh
npx truffle console --network local
```
```js
> wallet = UpgradeableWallet.at(WALLET_ADDRESS) // replace with actual wallet address
> token = IERC20.at(TOKEN_ADDRESS) // replace with actual token address
> someone = web3.eth.accounts[3] // any random account
> owner = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0' // the same address we used when initializing the wallet
> token.balanceOf(wallet.address).then(x => x.toNumber())
> wallet.transferERC20(token.address, someone, 100, { from: owner })
> token.balanceOf(someone).then(x => x.toNumber())
```

But our wallet allows anyone to transfer our tokens:

```js
> wallet.transferERC20(token.address, someone, 100, { from: someone })
> token.balanceOf(someone).then(x => x.toNumber())
```

### Upgrading

We will now correct our contract and upgrade it to the fixed version. After fixing the Solidity code by adding a `require(msg.sender == _owner);` statement, upload the new version and upgrade by running:

```sh
npx zos push
npx zos update Wallet
```

We can now test that the fix is in place in the exact same wallet contract by attempting the transfer again and checking that it is reverted:

```js
> wallet.transferERC20(token.address, someone, 100, { from: someone }) // reverts
> wallet.transferERC20(token.address, someone, 100, { from: owner })   // works
```

## Challenges

We will go through different independent challenges that will require us to upgrade the contract to cater for different requirements.

### Security

Our `transferERC20` function currently allows anyone to transfer the wallet's token. We need to add a check that only the `owner` of the contract can do so, and upgrade to the new version. Bonus points for solving this using `Ownable` from `openzeppelin-eth`.

### Compliance

The wallet contract's `transferERC20` method returns a boolean value to notify whether the transfer was successful, following the ERC20 standard. However, the implementation is missing its return value. We need to add a `return` statement to the function to avoid a [return value bug](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected).

### Features

We want to extend our wallet to support not only `ERC20` tokens, but also non-fungible [`ERC721`](http://erc721.org/) tokens, also known as NFTs. To do this, we need to add a new public function `transferERC721` to our contract. And we can use `StandaloneERC721` from `openzeppelin-eth` for testing.

### Improved access control

We want to allow more than a single account to manage our wallet. To do this, we'll need to add a new storage variable to keep track of those who can handle our assets, and change all access checks. Note that we need to be especially careful when modifying the storage of a contract.

### Governance

To avoid having a single account with the privileges to freely upgrade our wallet smart contract, we can set up a [MultiSigWallet](https://github.com/gnosis/MultiSigWallet) and yield upgradeability control to it using the `set-admin` command.

## Further reading

* [ZeppelinOS documentation](https://docs.zeppelinos.org/)
* [Exploring upgradeability governance in ZeppelinOS with a Gnosis MultiSig](https://blog.zeppelinos.org/exploring-upgradeability-governance-in-zeppelinos-with-a-gnosis-multisig/)
* [Slides from Web3 Summit 2018 workshop](https://docs.google.com/presentation/d/1oEWkM-n89bKfw0tySRjmhGCEVoeznfk8bOL93vLVkSs/edit?usp=sharing)