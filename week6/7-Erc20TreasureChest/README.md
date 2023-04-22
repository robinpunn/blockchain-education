## ERC20 Treasure Chest
- In this challenge you will create a contract that can transfer multiple ERC20 balances from the contracts address to function caller's address.
- By completing this challenge you demonstrate your ability to work with the ERC20 standard and address balances.

### Plunder
#### ERC20 Treasure Chest
- Many ERC20 tokens have been sent to the Chest contract. 
    - It's your job to to write a function that will allow someone to withdraw those tokens.
- To accomplish this, the function will need to interact with several ERC20 Token Contracts. 
    - It will need to find the token balance for the ``Chest`` contract address for each of these tokens and then it will need to transfer that balance to the caller of the function.
#### Your Goal: Plunder
1. Create an external function called ``plunder`` which will take an **array of addresses** as its only parameter. 
    - There will be an ERC20 Token deployed to each of these addresses in the array.
2. In the ``plunder`` function, transfer the entire balance of each of these tokens owned by the ``Chest`` address and send them to the ``msg.sender.``
> For instance, the tests will deploy a token with a supply of 10000 and send 1000 of those tokens to the ``Chest`` address. Then it will send the token address to the ``plunder`` function on the Chest. This function should move the tokens from the ``Chest`` address to the address of the ``msg.sender``.
- You can use the ``IERC20.sol`` interface to interact with the functions necessary to accomplish this goal.

---

**SOLUTION**

```solidity
// Chest.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract Chest {
    function plunder(address[] calldata _tokens) external {
        for (uint i =0; i < _tokens.length; i++){
            IERC20(_tokens[i]).transfer(msg.sender, IERC20(_tokens[i]).balanceOf(address(this)));
        }
    }
}

// IERC20.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

---