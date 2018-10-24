pragma solidity ^0.4.24;

import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-eth/contracts/ownership/Ownable.sol";
import "zos-lib/contracts/Initializable.sol";

contract OwnableWallet is Ownable {
  function transferERC20(IERC20 token, address to, uint256 amount) public onlyOwner returns (bool) {
    require(token.transfer(to, amount));
  }
}