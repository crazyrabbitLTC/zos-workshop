pragma solidity ^0.4.24;

import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "zos-lib/contracts/Initializable.sol";

contract MultiOwnerWallet is Initializable {
  address _owner;
  mapping (address => bool) _allowedToTransfer;
  
  function initialize(address owner) initializer public {
    _owner = owner;
  }

  function owner() public view returns (address) {
    return _owner;
  }

  function grantAccess(address who) {
    require(msg.sender == _owner);
    _allowedToTransfer[who] = true;
  }

  function transferERC20(IERC20 token, address to, uint256 amount) public returns (bool) {
    require(msg.sender == _owner || _allowedToTransfer[msg.sender]);
    require(token.transfer(to, amount));
  }
}