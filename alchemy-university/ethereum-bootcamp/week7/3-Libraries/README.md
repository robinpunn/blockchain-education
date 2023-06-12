## Libraries

---

### Table of Contents
1. [UInt Library](#uint-library)
    - [Libraries](#libraries-1)
    - [Library Functions](#library-functions)
    - [Your Goal: Library Function](#your-goal-library-function)
1. [Using Library](#using-library)
    - [Using the Library](#using-the-library)
    - [Library Compilation & Communication](#library-compilation--communication)
    - [Your Goal: Even Teams](#your-goal-even-teams)
1. [Console Log](#console-log)
    - [Logging](#logging)
    - [Your Goal: Find the Secret!](#your-goal-find-the-secret)
1. [Evenly Divides](#evenly-divides)
    - [Base Functions](#base-functions)
    - [Your Goal: Evenly Divides](#your-goal-evenly-divides)
1. [Is Prime](#is-prime)
    - [Building on Functions](#building-on-functions)
    - [Prime Strategy](#prime-strategy)
        - [Example: 7](#example-7)
        - [Example: 25](#example-25)
    - [Your Goal: Is it Prime?](#your-goal-is-it-prime)
1. [Next Prime](#next-prime)
    - [Block Global](#block-global)
    - [Your Goal: Prime Block Winner](#your-goal-prime-block-winner)

---

### UInt Library
#### Libraries
- Libraries are quite similar to contracts! They are defined with the same syntax: ``contract C {}`` and ``library C {}``.
    - They both contain functions with all the same properties, types and syntax.
    - They have access to the same global variables and opcodes.
- So what are the differences?
- One major difference between libraries and contracts is that libraries do not have state.
    - Trying to declare a state variable on a library will not compile.
> Libraries also cannot receive ether, inherit (or be inherited from), or be destroyed. These are functions of contracts we will cover later in the curriculum.
- The purpose of libraries is to share code.
- Ideally libraries contain functions with basic reusable algorithms.
    - This will help developers stop themselves from re-inventing the wheel!
- Good libraries are rigorously tested and audited.
    - Using such a library is a benefit to your contract as less new code reduces your chances for bugs
> OpenZeppelin provides many great [Solidity libraries](https://github.com/OpenZeppelin/openzeppelin-contracts) that have been audited by leading security firms in the field.

#### Library Functions
- Libraries functions are primarily intended to be used by contracts.
    - Libraries **do not have their own state**.
- For this reason, library functions are most often ``pure`` which means they do not read/write state.
- Library functions can only be called directly if they are marked as ``pure`` or ``view``.
    - You can see that in the test cases of this stage we are calling the library function directly from JavaScript.
    - This only works if the function is marked indicating it will not modify state.
- If the function does not make this guarantee that it will not modify state, it will not be compiled into the library's ABI.
    - This means neither the tests nor the ABI Validations will be able to access it.
> You can try this out yourself! Once you have the validations tab passing on this stage, try removing the ``pure`` keyword. The validation will no longer be able to **see** the function since it's not part of the interface definition any longer.
- So, what is the alternative to calling a library directly?
- Library functions can run in the context of a contract which means it uses its transaction/message data and can have access to state variables on the contract.
    - At that point the library can make changes to the contract's state.

#### Your Goal: Library Function
1. Create a public pure function called ``isEven``.
    - This must be a pure or view function.
2. This function should take a ``uint`` as a parameter and return a ``bool`` indicating if the integer is even.
> Recall that the modulo operator is available in Solidity! It returns the remainder after division so ``3 % 2`` will evaluate to ``1`` while ``4 % 2`` will evaluate to ``0``.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library UIntFunctions {
    function isEven(uint _num)
        public
        pure
        returns(bool)
    {
        return _num % 2 == 0;
    }
}
```
---

### Using Library
#### Using the Library
- Now that we have a library with a useful function, it's time to use it!
- Libraries can be called directly, just as they were in the test cases of the last stage.
    - However, they are more commonly imported into contracts.
- Let's use the library we built in the last stage in an Example contract!
- There's two ways to do this. First:
```solidity
import "./UIntFunctions.sol";
contract Example {
    function isEven(uint x) public pure returns(bool) {
        return UIntFunctions.isEven(x);
    }
}
```
- Here we can explicitly reference the ``UIntFunctions`` library and invoke its function ``isEven``.
- The other way to do this:
```solidity
import "./UIntFunctions.sol";
contract Example {
    using UIntFunctions for uint;
    function isEven(uint x) public pure returns(bool) {
        return x.isEven();
    }
}
```
- In this example, we're applying the ``UIntFunctions`` library to the ``uint`` data type.
    - This will add all the functions in the library to any ``uint`` in our contract. So flashy!

#### Library Compilation & Communication
- Libraries are imported into contracts in two ways:
1. If the contract uses a library function marked as **internal**, the code inside the function will be **copied into the contract itself** and compiled with the contract.
1. If the contract uses a library function marked as **external** or **public**, the library must be deployed to its own address.
    - The contract is then **linked** to the library address.
    - At runtime, the contract will create a message using ``DELEGATECALL`` (an EVM opcode) to access the library function.
> Of course, if the library function is marked as **private** the contract has no access to it. Only the library can access its own private functions.
- When a library is imported, its code is run in the same context as the contract code.
    - When the library is compiled into the bytecode, the code actually runs inside of the contract.
    - When the library is linked, the ``DELEGATECALL`` opcode calls into the library while maintaining the contract's context.
- When the library needs to deployed on its own, the solidity compiler will insert a placeholder inside the **contract's bytecode**:
```bash
608060405234801561001057600080fd5b5073__$ba528da1e2dc9d528a3d6faf88239359ae$__633ef7df506040518163ffffffff1660e01b815260040160206040518083038186803b15801561005557600080fd5b505af4158015610069573d6000803e3d6000fd5b505050506040513d602081101561007f57600080fd5b81019080805190602001909291905050506000819055506085806100a46000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80630c55699c14602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea264697066735822122086180a06d1da4b2b704e3d89f6c825310e78b0304df1d268790893e24b9f206164736f6c63430006020033
```
- Did you find it in there?
- It's the __$ba528da1e2dc9d528a3d6faf88239359ae$__.
    - Those underscores and dollar signs are not valid hexadecimal! This is the link placeholder.
- The compiler will also provider a reference to where this placeholder exists inside of the bytecode:
```json
"linkReferences": {
    "contracts/Library.sol": {
        "Library": [
            {
                "length": 20,
                "start": 19
            }
        ]
    }
}
```
- This tells us that the reference to Library.sol begins at hex character 38 (19 bytes) and is 40 hex characters long.
- Once the library is deployed, this placeholder can be replaced with the library's address on the blockchain.
> Don't worry, the linking is generally done for you. You can use development frameworks like [Truffle](https://www.trufflesuite.com/truffle) or [Hardhat](https://hardhat.org/). Also, the solidity compiler itself (solc) has a linking tool that makes this relatively easy.
- When the placeholder has been replaced, the contract bytecode is ready to be deployed!
- In the EVM, when the library function needs to called, the contract will create a message with ``DELEGATECALL`` to run the function at the library's address.

#### Your Goal: Even Teams
- We have a contract called ``Game``, you can find it on the new ``Game.sol`` tab!
- This contract has two state parameters: ``participants`` and ``allowTeams``.
1. Your goal is to create a constructor which takes a ``uint`` parameter for the number of participants in the game.
1. Store this ``uint`` in the ``participants`` state variable.
1. This game can be played free-for-all or team-against-team. To make sure the teams have the same number, ensure that the boolean ``allowTeams`` is only ``true`` if the number of participants is even.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./UIntFunctions.sol";

contract Game {
    using UIntFunctions for uint;
    uint public participants;
    bool public allowTeams;

    constructor(uint _participants) {
        if(_participants.isEven()){
            allowTeams = true;
        }
        participants = _participants;
    }
}
```
### Console Log
- Do you miss our friend console.log from JavaScript?
- Well, miss it no longer! Now we can console.log in Solidity as well.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";

contract Contract {
    constructor(uint x, string y, bool z) {
        console.log(x); // 1
        console.log(y); // Hello World!
        console.log(z); // true
    }
}
```
- This method can take an ``uint``, ``string``, ``bool``, or ``address`` as its argument.
    - It will log the results to the console on execution.

#### Logging
- Thanks to the **Hardhat** task runner you can log messages to the console in Solidity for debugging purposes!
- You can use the [Hardhat Console Log](https://hardhat.org/hardhat-network/docs/overview#console-log) in any of the Alchemy University solidity coding tutorials:
```solidity
import "hardhat/console.sol";
```
- This will allow you to use ``console.log`` in your Solidity functions anywhere.
    - Additional methods defined on the ``console`` can be found in the [Hardhat Network Reference](https://hardhat.org/hardhat-network/reference/#console-log).

#### Your Goal: Find the Secret!
- There is a **secret unsigned integer** that will pass this stage.
    - Your goal is to find what that secret is!
- You can do so by logging the message passed to the constructor.
    - Follow the message's instructions to pass the stage!
> You'll notice the keyword **memory** on the string argument. This is the string's "data location". We talked about this concept in the Week 5 Reference Types section.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Contract {
	function getSecret(string memory _message) public view returns(uint) {
		console.log(_message);
		return 1337;
	}
}
```
---

### Evenly Divides
#### Base Functions
- We can create functions which serve a basic purpose and then re-use them in other library functions.
- In this way we make it easier to **DRY** up our code.
> As metioned in an earlier JavaScript lesson **DRY** stands for **Don't Repeat Yourself**, it's a great [sofware practice](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and a huge motivation behind libraries.

#### Your Goal: Evenly Divides
- Let's create a public pure function on the library ``Prime`` called ``dividesEvenly``.
    - This function should take two ``uint`` parameters and return a ``bool``.
1. The function should determine if the second ``uint`` divides the first ``uint`` **evenly**.
    - If it divides evenly the function should return ``true``. If not, it should return ``false``.
> If an integer **evenly divides** the other, there should be **no remainder**. Remember that there's an operator that helps us determine the remainder after division, which we used in the first stage
- Some examples:
```js
console.log( dividesEvenly(4, 2) ); // true
console.log( dividesEvenly(5, 2) ); // false
console.log( dividesEvenly(6, 3) ); // true
console.log( dividesEvenly(6, 4) ); // false
```

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Prime {
    function dividesEvenly(uint first, uint second)
    public
    pure
    returns(bool)
    {
        return first%second == 0;
    }
}
```
---

### Is Prime
#### Building on Functions
- It's quite easy to invoke another defined function within the library itself:
```solidity
library UIntFunctions {
    function isEven(uint x) public pure returns(bool) {
        return x % 2 == 0;
    }
    function isOdd(uint x) public pure returns(bool) {
        return !isEven(x);
    }
}
```
- We're re-using the ``UIntFunctions`` library we made earlier.
    - You can see we added an ``isOdd`` function that simply takes the result of ``isEven`` and flips it with the boolean NOT operator

#### Prime Strategy
- Let's take a few examples to determine how we would figure out a prime!

##### Example: 7
**Is 7 a prime number?**
- How would we figure this out?
- We could start checking numbers to see if 7 is evenly divisible by it.
    - We should start at 2 since every number is divisible by 1.
```js
console.log( dividesEvenly(7, 2) ); // false
console.log( dividesEvenly(7, 3) ); // false
console.log( dividesEvenly(7, 4) ); // false
console.log( dividesEvenly(7, 5) ); // false
console.log( dividesEvenly(7, 6) ); // false
```
- None of these numbers evenly divide 7!
    It's a **prime number**. Boom!
> Could we have stopped earlier? We know that any number larger than half of the number will not evenly divide it. This an optimization you could consider when you go to program your function!

##### Example: 25
**Is 25 a prime number?**
```js
console.log( dividesEvenly(25, 2) ); // false
console.log( dividesEvenly(25, 3) ); // false
console.log( dividesEvenly(25, 4) ); // false
console.log( dividesEvenly(25, 5) ); // true
```
- The number ``5`` evenly divides ``25``.
    - This means that ``25`` is **not a prime number**.
    - At this point we can stop and return ``false`` definitively.

#### Your Goal: Is it Prime?
1. Create a function called ``isPrime`` that takes a ``uint`` parameter and returns a ``bool`` indicating if the number is a prime number.
> A prime number is a number that is only **evenly divisible** by ``1`` and itself.

---
**SOLUTION**
```solidity
// Prime.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Prime {
    function dividesEvenly(uint first, uint second)
        public
        pure
        returns(bool)
    {
        return first%second == 0;
    }

    function isPrime(uint _num)
        public
        pure
        returns(bool)
    {
        for (uint i=2; i<=_num/2;i++) {
            if (dividesEvenly(_num,i)){
                return false;
            }
        }
        return true;
    }
}
```
---

### Next Prime
#### Block Global
- Among many global properties we can access inside Solidity is the block.
    - The block will tell us information about the current block this transaction is being mined on:
        - **block.coinbase** - The miner of this block's address
        - **block.difficulty** - The difficulty of the current block
        - **block.gaslimt** - The total gaslimit of the block
        - **block.number** - The current block number
        - **block.timestamp** - The current timestamp of the block (in seconds since unix epoch)
    - All of these are 256 bit unsigned integers with the exception of coinbase which is an address.
- We can use these globals in contracts and libraries very simply:
```solidity
import "hardhat/console.sol";
contract MyExample {
    constructor() {
        console.log( block.timestamp ); // 1583271154
        console.log( block.number ); // 9600665
    }
}
```

####  Your Goal: Prime Block Winner
- You'll find the ``PrimeGame`` contract in the new file ``PrimeGame.sol``. This file has already imported the ``Prime`` library for you.
1. In this contract, create a function called ``isWinner`` that determines if the current block number is prime.
    - If it is prime, return true. A winner!
    - If not, return false.

---
**SOLUTION**
```solidity
// PrimeGame.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Prime.sol";

contract PrimeGame {
    using Prime for uint;

    function isWinner()
        public
        view
        returns(bool)
    {
        return block.number.isPrime();
    }
}

//Prime.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Prime {
    function dividesEvenly(uint first, uint second)
        public
        pure
        returns(bool)
    {
        return first%second == 0;
    }

    function isPrime(uint _num)
        public
        pure
        returns(bool)
    {
        for (uint i=2; i<=_num/2;i++) {
            if (dividesEvenly(_num,i)){
                return false;
            }
        }
        return true;
    }
}
```
---