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

## Upgradeability

Support upgradeability

## Challenges

We will go through different independent challenges that will require us to upgrade the contract to cater for different requirements.

### Security

Our `transferERC20` function currently allows anyone to transfer the wallet's token. We need to add a check that only the `owner` of the contract can do so, and upgrade to the new version.

### Compliance

The wallet contract's `transferERC20` method returns a boolean value to notify whether the transfer was successful, following the ERC20 standard. However, the implementation is missing its return value. We need to add a `return` statement to the function to avoid a [return value bug](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected).

### Features

We want to extend our wallet to support not only `ERC20` tokens, but also non-fungible [`ERC721`](http://erc721.org/) tokens, also known as NFTs. To do this, we need to add a new public function `transferERC721` to our contract.

### Improved access control

We want to allow more than a single account to manage our wallet. To do this, we'll need to add a new storage variable to keep track of those who can handle our assets, and change all access checks. Note that we need to be especially careful when modifying the storage of a contract.

### Governance

To avoid having a single account with the privileges to freely upgrade our wallet smart contract, we can set up a [MultiSigWallet](https://github.com/gnosis/MultiSigWallet) and yield upgradeability control to it using the `set-admin` command.

## Further reading

* [ZeppelinOS documentation](https://docs.zeppelinos.org/)
* [Exploring upgradeability governance in ZeppelinOS with a Gnosis MultiSig](https://blog.zeppelinos.org/exploring-upgradeability-governance-in-zeppelinos-with-a-gnosis-multisig/)