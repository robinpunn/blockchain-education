### Party Split
- This challenge is all about sharing expenses among your friends!
#### Challenge Skills
- By completing this challenge you demonstrate your ability to handle ether payments, both to and from the smart contract. 
- You'll be able to accept and account for ether being stored in the contract, and then send that ether to other addresses when the conditions call for it!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {
    uint256 deposit;
    address[] public party;
    mapping(address => bool) paid;

	constructor(uint256 _deposit){
        deposit = _deposit;
    }

    function rsvp() external payable {
        require(!paid[msg.sender]);
        require(msg.value == deposit);
        party.push(msg.sender);
        paid[msg.sender] = true;
    }

    function payBill(address venue, uint total) external {
        (bool success, ) = venue.call{value: total}(""); // send ether to the venue address using call

        require(success, "Payment to venue failed");

        uint256 remaining = address(this).balance;
        uint256 share = remaining / party.length;

        for (uint256 i = 0; i < party.length; i++) {
            (bool sent, ) = payable(party[i]).call{value: share}(""); // send share to each party member using call
            require(sent, "Payment to party member failed");
        }
    }
}
```