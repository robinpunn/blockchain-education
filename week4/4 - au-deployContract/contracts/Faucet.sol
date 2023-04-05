//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Faucet {
  
  function withdraw(uint _amount) public {
    // users can only withdraw .05 ETH at a time, feel free to change this!
    require(_amount <= 5000000000000000000);
    payable(msg.sender).transfer(_amount);
  }

  // fallback function
  receive() external payable {}
}