# Evolution of Proxies

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./StorageSlot.sol";

contract Proxy {
    function changeImplementation(address _implementation) external {
        StorageSlot.getAddressSlot(keccak256("impl")).value = _implementation;
    }

    fallback() external {
        (bool success, ) = StorageSlot.getAddressSlot(keccak256("impl")).value.delegatecall(msg.data);
        require(success);
    }
}
```

You can find the StorageSlot Library in [EIP 1967: Proxy Storage Slots](https://eips.ethereum.org/EIPS/eip-1967).

- This ``Proxy`` should only be used for learning purposes!
    - One thing that it does not do is return the return value in the ``fallback`` function.
    - This can only be done by dropping down into assembly code, as shown by the [OpenZeppelin proxy logic here](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#proxy-forwarding).
    - In general, you should try to stick to using proxies that are audited and battle tested!