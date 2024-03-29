## CallData
- When we want to communicate with a smart contract, we send a transaction from an Externally Owned Account.
    - Inside of that transaction is a data property which is commonly referred to as the "calldata".
    - This call data format is the same for calling solidity functions whether it is in a transaction from an EOA or if its in a message call from one contract to another.
- The format looks a little like this. Let's say you wanted to call a method approve on a contract, that takes a uint:
```js
function approve(uint val) external;
```
-  We can target this function by taking its signature and hashing it with keccak256, then taking the first 4 bytes.
    - So for approve here, it would be the ``keccak256("approve(uint256)")``.
    - The first 4 bytes of the resulting hash is ``0xb759f954``. This is the first part of our calldata!

Then we need to decide how much we want to approve. What is our val? Let's say it was 15, that would 0xf in hexadecimal.
    - We will need to pad this value out to 256 bits, or 64 hexadecimal characters.
    - The resulting value will be:
```bash
000000000000000000000000000000000000000000000000000000000000000f
```
- If we combine this with the function signature, our call data would look like this:
```bash
0xb759f954000000000000000000000000000000000000000000000000000000000000000f
```
- Regardless of whether its in a transaction from an EOA or a message call from one contract to another, this would be our calldata sending 15 to an approve function.
- Ready to start working with calldata? Let's jump in!

---
### Table of Contents
1. [Call Function](#call-function)
    - [Interfaces](#interfaces)
    - [Your Goal: Alert Hero](#your-goal-alert-hero)
---

### Call Function

#### Interfaces
- The simplest way to program a contract to communicate with another contract is by defining the contract you're interacting with. 
    - Interfaces provide this functionality for us, so for example:
    ```solidity
    interface IToken {
        function getBalance(address user) external;
    }
    ```
    -  We can use this interface to properly communicate with a token contract that implements the ``getBalance`` method:
    ```solidity
    // tokenAddress: a contract adddress we want to communicate with
    // userAddress: the address we want to lookup the balance for
    uint balance = IToken(tokenAddress).getBalance(userAddress);
    ```
    - Behind the scenes Solidity is creating a message call that follows the calldata format described in the introduction.
#### Your Goal: Alert Hero
- Use the ``IHero`` interface and the ``hero`` address passed into ``sendAlert`` to alert the hero from the Sidekick contract.

---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hero {
    bool public alerted;

    function alert() external {
        alerted = true;
    }
}

// Sidekick.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IHero {
    function alert() external;
}

contract Sidekick {
    function sendAlert(address hero) external {
        // TODO: alert the hero using the IHero interface
        IHero(hero).alert();
    }
}
```
---

### Signature
#### Function Signature
- As mentioned in the introduction, the first step to forming calldata manually is taking the keccak256 hash of the function signature you are targeting.
- So, for example, if we we are trying to call ``rumble``:
    ```solidity
    function rumble() external;
    ```
#### Your Goal: Alert Hero, Manually
- Alert the Hero, manually this time!
- Fill in the function signature for the Hero's ``alert`` function.
    - Notice that we are taking the first 4 bytes of the hash of this function and passing it in as calldata to the hero.

---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hero {
    bool public alerted;

    function alert() external {
        alerted = true;
    }
}

// Sidekick.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sidekick {
    function sendAlert(address hero) external {
        // TODO: fill in the function signature
        bytes4 signature = bytes4(keccak256("alert()"));

        (bool success, ) = hero.call(abi.encodePacked(signature));

        require(success);
    }
}
```
---


### With Signature
#### Encode with Signature
- As a bit of a shortcut to the previous stage, we can learn about the method abi.encodeWithSignature! 
    - This method will do everything we did in the last stage, in one function.
- So this:
    ```solidity
    bytes4 memory payload = abi.encodePacked(bytes4(keccak256("rumble()")));

    (bool success, ) = hero.call(payload);
    ```
- Becomes
    ```solidity
    bytes memory payload = abi.encodeWithSignature("rumble()");

    (bool success, ) = hero.call(payload);
    ```
- And if you want to add arguments, you can add them to signature and as comma separted arguments to the encodeWithSignature method. 
    - If rumble took two uint arguments, we could pass them like this:
    ```solidity
    bytes memory payload = abi.encodeWithSignature("rumble(uint256,uint256)", 10, 5);

    (bool success, ) = hero.call(payload);
    ```
#### Encoding Calldata
- Behind the scenes, ``abi.encodeWithSignature`` is doing a few things for us and it's helpful to take a look behind the curtain to understand why it will behave the way it does!
- Let's take a look at an example:
    ```solidity
    contract Example {
        function sendData(address x) external {
            (bool s, ) = x.call(
                abi.encodeWithSignature("receiveData(uint256)", 5)
                );
            require(s);
        }
    }
    ```
- How does abi.encodeWithSignature turn these arguments into calldata? It's a process that involves a few steps:
    1. Taking the keccak256 hash of the function signature ``receiveData(uint256)``
    1. Taking the first four bytes of the keccak256 hash
    1. Appending the value 5, padded out to 256 bits
- The resulting calldata is: ``de947c85`` (four bytes of the signature) + ``0000000000000000000000000000000000000000000000000000000000000005`` (the argument padded out to 256 bits).
> Check our work! You can put the ``receiveData(uint256)`` input into this [keccak256 online tool](https://emn178.github.io/online-tools/keccak_256.html) to see that the function signature is what we said it was here.
#### Signature Issues
- You'll notice that this makes the function signature part of the calldata very brittle! One small change to the signature and you will encode entirely different calldata.
    - The smart contract on the other end will not understand the value you're trying to call in that case!
- Let's say for example, you forget to take out the argument name and you type out ``abi.encodeWithSignature("receiveData(uint256 x)", 5)``.
    - The resulting hash from keeping the ``x`` in there is going to be entirely different from the one we came up with! This makes the ``abi.encodeWithSignature`` notoriously tricky.
- Here's some rules to follow when you type in the function signature:
    1. Only include the function name: don't include any visibilities or other keywords
    1. Include all variables, comma-delimited: make sure that all your arguments are specified in a comma delimited list without spaces. For instance ``receiveData(uint256,uint256)`` is good but ``receiveData(uint256 uint256)`` and ``receiveData(uint256, uint256)`` will not work.
    1. Be careful not to use aliases! The keyword ``uint`` is shorthand for ``uint256``. You'll need to use ``uint256`` or the call data encoding will not work.
#### Your Goal: Alert the Hero with Arguments
- Alert the ``Hero`` by calling ``alert`` and passing the number of ``enemies`` and whether or not they are ``armed``!

---
**SOLIDITY**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hero {
    Ambush public ambush;

    struct Ambush {
        bool alerted;
        uint enemies;
        bool armed;
    }

    function alert(uint enemies, bool armed) external {
        ambush = Ambush(true, enemies, armed);
    }
}

// Sidekick.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sidekick {
    function sendAlert(address hero, uint enemies, bool armed) external {
        (bool success, ) = hero.call(
            /* TODO: alert the hero with the proper calldata! */
            abi.encodeWithSignature("alert(uint256,bool)",enemies,armed)
        );

        require(success);
    }
}
```
---

### Arbitrary Alert
#### Taking Calldata
- If we take calldata as an argument to a function we can pass that arbitrary calldata along to another contract.
    - This can allow the message sender to decide which function to call and with what arguments.
- This can be super useful, especially in contracts that require many people to pass their approval before a transaction is executed.
    - We'll talk about decentralized organizations and multiple-signature wallets later on in the course and you'll see that storing calldata for later use is critical for maximum flexibility in these cases.
#### Your Goal: Pass Calldata


---
**SOLIDITY**
```solidity
//Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hero {
    Ambush public ambush;

    struct Ambush {
        bool alerted;
        uint enemies;
        bool armed;
    }

    uint lastContact;

    function alert(uint enemies, bool armed) external {
        ambush = Ambush(true, enemies, armed);
    }
}

// Sidekick.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sidekick {
    function relay(address hero, bytes memory data) external {
        // send all of the data as calldata to the hero
        (bool success, ) = hero.call(data);
          require(success);
    }
}
```

### Fallback
- When calldata is sent to a contract, and the contract doesn't have a function signature to match the selector, it will trigger its fallback function.
- So if we chose 4 bytes randomly and sent them to a contract, most likely this will not match a function signature and will invoke the fallback function if there is one.
    - You could also choose to send less than 4 bytes or more than 4 bytes.
    - So long as that first 4 bytes does not match a function selector, the fallback function will be triggered.

#### Your Goal: Trigger the fallback
- In the ``makeContact`` method, send some calldata to the ``Hero`` contract that will trigger its fallback function.

---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hero {
    Ambush public ambush;

    struct Ambush {
        bool alerted;
        uint enemies;
        bool armed;
    }

    uint public lastContact;

    function alert(uint enemies, bool armed) external {
        ambush = Ambush(true, enemies, armed);
    }

    fallback() external {
        lastContact = block.timestamp;
    }
}

// Sidekick.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sidekick {
    function makeContact(address hero) external {
        (bool success, ) = hero.call("0xfffff");
        require(success);
    }
}
```
---