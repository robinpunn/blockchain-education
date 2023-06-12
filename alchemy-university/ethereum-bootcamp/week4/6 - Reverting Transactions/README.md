## Learning Revert 
- We've been building up to this lesson for quite a few coding lessons now! 
    - It's time to learn the basics of reverting transactions in Solidity!
- In this lesson we'll discuss how to detect an error condition and **immediately halt** the smart contract code, stopping any further execution of the transaction that the code is running in, and refunding any remaining gas to the user. 
    - The EVM gives us a few ways to **stop a transaction and roll-back any state changes and emitted events** with the ``REVERT`` EVM opcode.
- In Solidity version ^0.8.0 there are 3 ways to express errors in Solidity. They are:
    - ``assert``
    - ``require``
    - ``revert``

---
### Table of Contents
1. [Constructor Revert](#constructor-revert)
    - [Reverting Transactoins](#reverting-transactions)
    - [The Nitty Gritty of Creating Errors](#the-nitty-gritty-of-creating-errors)
    - [Notes](#notes)
    - [References and Further Reading](#references-and-further-reading)
    - [Your Goal: Require 1 Ether Deposit](#your-goal-require-1-ether-deposit)
1. [Only Owner](#only-owner)
    - [Restricting by Address](#restricting-by-address)
    - [Your Goal: Owner Withdrawal](#your-goal-owner-withdrawal)
1. [Owner Modifier](#owner-modifier)
    - [Function Modifiers](#function-modifiers)
    - [Your Goal: Require Owner](#your-goal-require-owner)
---

### Constructor Revert
#### Reverting Transactions
- In the EVM the main opcode to revert a transaction is ``REVERT``. 
    - There are three ways to invoke the ``REVERT`` opcode from Solidity are ``assert``, ``require`` and ``revert``, but let's ignore assert for now.
- We can **revert** a transaction in Solidity by using the ``require`` function and the ``revert`` statement.
- A ``require`` statement has two forms
    ```solidity
    require(someBooleanCondition);
    ```
- and
    ```solidity
    require(someBooleanCondition, "Optional error message");
    ```
    - These will revert if ``someBooleanCondition`` is false. 
        - We can use these to check for all kinds of conditions.
- A ``revert`` provides the same access to the ``REVERT`` opcode without a condition.
    ```solidity
    if(!someBooleanCondition) {
        revert SomeCustomError(errorArg1, errorArg2, ...);
    }
    ```
- Note that as of Solidity ^0.8.0, revert is a statement and NOT a function. 
    - However, for backward compatibility reasons, revert can still be used in function form. 
    - So revert can also be used like:
    ```solidity
        if(!someBooleanCondition) {
        revert("Some error message");
    }
    ```
- In both of the ``revert`` usages above, we check the boolean condition ourselves. 
    - If the condition is unexpected, we can call ``revert`` with a custom error or a string describing the reason for the error.
#### The Nitty-Gritty of Creating Errors 
- ``assert``, ``require`` and ``revert`` all communicate errors to the calling code by stopping any further code execution and immediately handing control of code execution back to the calling code, usually with an error message or error code.
- These are Solidity's different ways of creating an error (aka: ``throw-ing`` an exception which is a core error handling concept in many languages). 
    - Under the hood, they all use the EVM's ``REVERT`` opcode, but there are some differences between them, both semantically and functionally.
1. ``assert`` - a function that creates an error of type ``Panic(uint256)``. ``asserts`` should be used to check for internal errors and function *invariants*.
- Example usage of ``assert`` looks like:
    ```solidity
    assert(someBooleanCondition);
    ```
2. ``revert`` - Use ``revert`` to check *preconditions* of a function.
- A *precondition* is another piece of Computer Science lingo, which is defined as a condition that a function expects to be true regarding an input of a function.
- Remember that, as of Solidity version ``^0.8.0``, ``revert`` is technically a *statement* and **not** a *function*. It's used via a statement that looks like:
    ```solidity
    revert MyCustomError(arg1, arg2, ...);
    ```
- However, for backwards compatibility reasons, ``revert`` can still be used in function form which accepts a string like so:
    ```solidity
    if (!someBooleanCondition) {
        revert("It was false!");
    }
    ```
3. ``require`` - Use ``require`` with the same purpose you would use ``revert`` to check the preconditions of a function. ``require`` is a function that takes 1 required boolean argument and an optional second argument which can be any expression that evaluates to a string. 
    - For example:
    ```solidity
    // "It was false" is an optional, but recommended argument
    require(someBooleanCondition, "It was false!");
    ```
- Note that the 2nd optional argument to ``require`` is any expression that evaluates to a string. 
    - For example, ``require`` can also be called like:
    ```solidity
    // Note that the `require` function is evaluated just as any other function and that
    // someFunctionThatReturnsAString() will be executed even if someBooleanCondition is true
    require(someBooleanCondition, someFunctionThatReturnsAString());
    ```
    - Usage of 1b. and 2a. above  are equivalent as long as the arguments to ``revert`` and ``require`` do not have side-effects, for example if they are just strings. 1b. and 2b. are not equivalent and have different gas cost implications.
- **In all cases, if ``someBooleanCondition`` is false, code execution is immediately stopped and control of the code execution is handed back to the calling code via the EVM's ``REVERT`` opcode.**
- If the calling code does not catch the error, then all changes made inside the transaction are reverted and all remaining gas is returned to the user (usually ``msg.sender``). 
    - Additionally, any events that were emitted will be reverted as well.
####  Notes
- If you do not provide the optional 2nd argument to ``require``, it will revert with empty error data and not even the error selector will be included in the data. Ouch! 
- It is currently not possible to use custom errors in combination with ``require``. 
    - Use ``if (!condition) revert CustomError();`` when custom errors are needed.
#### Questions
1. Can you think of any situations where you would want to use revert instead of require, or require instead of revert?
- In some cases using revert instead of require can improve code readability when handling more complex boolean expressions. 
    - This is highly subjective however and up to any given team's style guidelines.
- As mentioned in the Notes above, if you want to use a custom error, you'll need to use revert.
2. Between using ``revert`` and ``require``, which do you think requires the least amount of gas or will the amount of gas be equal? 
- Using ``revert`` with a custom error will usually be much cheaper than a string description, because you can use the name of the error to describe it, which is encoded in only four bytes.
- *Having said this, it is a good engineering principle to never try to optimize code until it is deemed necessary.*
#### References and Further Reading
- [Error Handling in Solidity](https://docs.soliditylang.org/en/v0.8.4/control-structures.html#error-handling-assert-require-revert-and-exceptions)
- More on the ['REVERT' EVM Opcode](https://ethervm.io/#FD)

#### Your Goal: Require 1 Ether Deposit
- Add a payable constructor method that requires a 1 ether deposit.
- If at least 1 ether is not sent to the constructor, revert the transaction.
> There are globally available ether units such as ``ether`` that you can use instead of having to convert from Wei (``1 ether == 1e18``).

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {

    constructor() payable {
        require(msg.value >= 1 ether, 'Not enough');
    }

}
```
---

### Only Owner
#### Restricting by Address
- We can provide certain roles to an address.
- For instance, let's say we had an address that could create new game items:
    ```solidity
    error NotItemCreator();

    contract Game {
        address itemCreator = 0xc783df8a850f42e7f7e57013759c285caa701eb6;

        function createItem() public {
            if(msg.sender != itemCreator) {
                revert NotItemCreator();
            }
            // TODO: create the item!
        }
    }
    ```

#### Your Goal: Owner Withdrawal
1. Create a public function ``withdraw`` that will withdraw all funds from the contract and send them to the deployer of the contract.
1. Require that only the deployer of the contract be allowed to call this function. For all other addresses, this function should revert.
> The deployer of the contract is ``msg.sender`` of the constructor.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address owner;

    constructor() payable {
        require(msg.value >= 1 ether, 'Not enough');
        owner = msg.sender;
    }

    function withdraw() public {
        require(msg.sender == owner);
        (bool s, ) = msg.sender.call{value: address(this).balance}("");
        require(s);
    }

}
```
---

    - This function ``createItem`` may be ``public``, but there's only one address that can call it without the transaction reverting!
### Owner Modifier
#### Function Modifiers
- We can write **modifiers** on functions to run logic before and after the function body.
- Let's see an example:
    ```solidity
    import "hardhat/console.sol";
    contract Example {
        function logMessage() public view logModifier {
            console.log("during");
        }

        modifier logModifier {
            console.log("before");
            _;
            console.log("after");
        }
    }
    ```
    - Let's say we called ``logMessage``, what would you expect the order of the logged messages to be?
- It would be
    ```
    before
    during 
    after
    ```
- Why? 
    - Notice that the ``logMessage`` function signature is decorated with the ``logModifier`` modifier.
    - This modifier can add behavior to the function before and after the function body runs. 
    - The ``_`` in the ``modifier`` body is where the function body of the modified function will run.

#### Your Goal: Require Owner
- You'll notice that the onlyOwner modifier has been added to each of the configuration functions in this contract.
    - Only problem is, it doesn't currently do anything!
- Update the onlyOwner modifier to require that only the owner address can call these functions without reverting.
> Remember to use the ``_`` to indicate where the function body should go!

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Contract {
	address owner;
	uint configA;
	uint configB;
	uint configC;

	constructor() {
		owner = msg.sender;
	}

	function setA(uint _configA) public onlyOwner {
		configA = _configA;
	}

	function setB(uint _configB) public onlyOwner {
		configB = _configB;
	}

	function setC(uint _configC) public onlyOwner {
		configC = _configC;
	}

	modifier onlyOwner {
		// TODO: require only the owner access
		require(msg.sender == owner);
		// TODO: run the rest of the function body
		_;
	}
}
```
---