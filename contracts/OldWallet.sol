pragma solidity ^0.4.24;

import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";

contract OldWallet {
  address _owner;
  
  constructor(address owner) public {
    _owner = owner;
  }

  function owner() public view returns (address) {
    return _owner;
  }
  
  function transferERC20(IERC20 token, address to, uint256 amount) public returns (bool) {
    require(token.transfer(to, amount));
  }
}