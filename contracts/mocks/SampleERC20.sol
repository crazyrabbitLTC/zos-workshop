pragma solidity ^0.4.24;

import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";

contract SampleERC20 is ERC20 {
  constructor() public {
    // Mints 100 tokens to the deployer of the contract assuming an 8 decimal token
    _mint(msg.sender, 100e8);
  }
}