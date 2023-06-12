## Sending Ether

---
### Table of Contents
1. [Accounts](#accounts)
1. [Storing Owner](#storing-owner)
    - [Solidity Addresses](#solidity-addresses)
    - [Ethereum Messages](#ethereum-messages)
    - [Your Goal: Store the Owner](#your-goal-store-the-owner)
1. [Recieve Ether](#receive-ether)
    - [Recieve Function](#receive-function)
    - [External Visibility](#external-visibility)
    - [Fallback Function](#fallback-function)
    - [Your Goal: Receive Ether](#your-goal-receive-ether)
1. [Tip Owner](#tip-owner)
    - [Transferring Funds](#transferring-funds)
    - [Your Goal: Transfer Tips](#your-goal-transfer-tips)
1. [Charity](#charity)
    - [Contract Account](#contract-account)
    - [This Keyword](#this-keyword)
    - [Your Goal: Charity Donation](#your-goal-charity-donation)
1. [Self Destruct](#self-destruct)
    - [Self-Destruct Repercussions](#self-destruct-repercussions)
    - [Your Goal: Self Destruct](#your-goal-self-destruct)
---

### Accounts
- In Ethereum, accounts are often distinguished into two types: Externally Owned Accounts and Contract Accounts.
    - The differences between these accounts is largely conceptual as the EVM essentially treats them the same!
- Every account on the EVM has a public address and a balance.
    - Contract accounts will also store their bytecode as well as their internal storage data.
- When making a call from an EOA to a Contract Account it's important to know things like who is making the call, how much ether they are sending and the function they are intending to invoke with which arguments.
- The Solidity language handles the wiring up of the transaction data to the function we have defined on the contract.
    - The language also gives us access to the transaction parameters through globals like ``msg.sender`` and ``msg.value``.
- By providing these utilities for working with accounts we can easily define roles, permissions and track token balances in contracts. Let's learn all about working with accounts in Solidity!

### Storing Owner
#### Solidity Addresses
- Let's talk about the address data type in Solidity!
- From our Ethereum lessons we know that an address on the EVM is a 160 bits long, or a 40 character, hexadecimal string:
    ```js
    address a = 0xc783df8a850f42e7f7e57013759c285caa701eb6;
    ```
- This is valid Solidity! 
    - We can store a fixed address in our contracts if we need to.
- We can also find the sender of the current message:
    ```solidity
    import "hardhat/console.sol";
    contract Example {
        constructor() {
            console.log( msg.sender ); // 0xc783df8a850f42e7f7e57013759c285caa701eb6
        }
    }
    ```
    - Here we are logging the address of the account calling this contract.
> What is msg? We'll take a closer look at Ethereum Messages
#### Ethereum Messages 
- When we have an Externally Owned Account and we want to communicate with the Ethereum Network we broadcast a **transaction**. 
    - Inside this transaction we can choose to send **data** which is bytecode intended to interact with the EVM.
>  If we don't send **data** then there's no intention to interact with the EVM. This is the case for simple ether transfers from one address to another.
- The data, often referred to as the **calldata**, is used to pass a **message** into the EVM. 
    - It will target a specific contract account (could be either a ``contract`` or ``library`` in Solidity terms) which may also make calls to another contract account. 
    - Every time a contract account calls into another contract account it forms a message. 
    - This message includes its sender address, the targeted function signature, and the amount of wei sent.
- In Solidity we have access to these message through global variables:
    - **msg.data** (``bytes``) - the complete calldata
    - **msg.sender** (``address``) - the address sending the message
    - **msg.sig** (``bytes4``) - the targeted function signature
    - **msg.value** (``uint``) - the amount of wei sent
> Wondering why the **msg.sig** is 4 bytes? This value is actually the first four bytes of the **keccak256 hash** of the function signature. It provides a way to uniquely identify (and target) the functions on a smart contract without worrying about how long the function signature is. Otherwise you could potentially store a ``reallyLongNameForAFunction`` and the calldata would need to store all of this information to invoke that function!

###  Your Goal: Store the Owner
1. Create a public ``address`` state variable called ``owner`` on the contract
1. Next create a constructor function which will store the ``msg.sender`` in ``owner``
> Since the constructor is only called **once during contract deployment**, storing the ``owner`` is not all too uncommon, especially if you need to have an administrative role. Of course, keep in mind that the administrative role can infringe on the decentralized nature of your contract!
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
```
---

### Receive Ether
#### Receive Function
- In the latest versions of Solidity, contracts **cannot receive ether** by default.
- In order to receive ether, a contract must specify a **payable** function.
    - This is another keyword which affects the function's mutability similar to **view** and **pure**.
> In fact, in the ABI, a function's ``stateMutability`` can be one of four values: **view**, **pure**, **payable** and **nonpayable**. The last one is the default, it is **nonpayable** when we don't specify the state mutability.
- Let's see a payable function in action:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        function pay() public payable {
            console.log( msg.value ); // 100000
        }
    }
    ```
- Here the ``msg.value`` is the amount of ether sent to this function ``pay`` measured in Wei.
    - Just by adding a ``payable`` keyword to this function we are able to accept ether.
    - The ether is automatically stored in the contract's balance, no need to do anything else!
> What if someone tried to send a payment to a nonpayable function? The transaction will **fail**, sending the ether back to the sender.
- In the case above we used the method ``pay`` as a ``payable`` function.
    - This means we have to call this function in order to send the ether to the contract.
    - What if we wanted to send it directly without specifying a method?
- Turns out, we can do that too:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        receive() external payable {
            console.log(msg.value); // 100000
        }
    }
    ```
    - You'll notice that ``receive`` does not use the ``function`` keyword.
        - This is because it is a special function (like ``constructor``).
        - It is the function that runs when a contract is sent ether without any **calldata**.
- The receive function must be **external**, **payable**, it cannot receive arguments and it cannot return anything.
> Another option to receive ether without specifying a function signature on a contract is to use a payable fallback function.

#### External Visibility
- We've discussed **public** and **private** visibilities.
    - What is **external** and why is it necessary for the ``receive`` function?
- **External** means that the function can **only be called from EOAs**. It cannot be called internally by any contract or library.
- The ``receive`` function, in particular, requires external visibility quite simply because it's not meant for responding to internal messaging.
    - It's sole purpose is to provide a function body for developers to write logic when ether is sent to a contract account.
- Quite similarly, the fallback function also requires **external** visibility.

#### Fallback Function
- The fallback function is the function you're calling *when no other function comes to the phone*!
- All joking aside, it is really quite that simple.
- If you make a call into a smart contract function with a bunch of bogus bytecode data, it will execute the fallback function.
    - This could be a simple mistake of typing the wrong function name or specifying a bad argument type.
    - It could also be the bytecode 0xdeadbeef, it doesn't matter.
    - **If the contract doesn't know how to respond the data sent to it, it will invoke the fallback function**.
- The fallback function is also a special function and it looks like this:
    ```solidity
    contract Contract {
        fallback() external {
            // do somethin'
        }
    }
    ```
    -  Just like the ``receive`` function, the ``fallback`` function must be **external**, it cannot accept any arguments or return any values.
        - Unlike the ``receive`` function, ``fallback`` does not need to be ``payable``.
- With a **payable** fallback function you can essentially replace the *receive* function, however, for the most part, it's inadvisible.
    - The two functions serve different purposes!
- When you create a ``receive`` function it's clear you're accepting ether on transactions without data.
- When you create a ``fallback`` function it's generally for the purposes of handling function signature mistakes.

#### Your Goal: Receive Ether
- Add a function to the contract that will allow it to receive ether on a transaction without any calldata.
> If you take a look at the test cases you'll notice that the method used is the web3 sendTransaction which is the same method used to send ether from one Externally Owned Account to another. No bytecode data required.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {

    }
}
```
---

### Tip Owner
#### Transferring Funds
- We can make any regular function payable.
    - This allows us to differentiate the purpose of the ether coming into the smart contract.
- Perhaps a contract has two addresses and we wanted to be able to pay one or the other:
    ```solidity
    contract Contract {
        address public a;
        address public b;

        constructor(address _a, address _b) {
            a = _a;
            b = _b;
        }

        function payA() public payable {
            (bool s, ) = a.call{ value: msg.value }("");
            require(s);
        }

        function payB() public payable {
            (bool s, ) = b.call{ value: msg.value }("");
            require(s);
        }
    }
    ```
    -  We have two pay methods ``payA`` and ``payB`` which will transfer ether to the respective address.
        - It takes a ``uint`` amount of Wei and transfers it from the contract account to the address.
#### Your Goal: Transfer Tips
- Let's create a way to tip the contract owner!
- Create a public payable function ``tip`` which sends any of its received ether to the ``owner``.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function tip() public payable {
        (bool s, ) = owner.call{value: msg.value}("");
        require(s);
    }

    receive() external payable {}
}
```
---



### Charity
#### Contract Account
- Within contracts, the ``this`` keyword can explicitly be converted to an address:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        constructor() {
            console.log( address(this) ); // 0x7c2c195cd6d34b8f845992d380aadb2730bb9c6f
            console.log( address(this).balance ); // 0
        }
    }
    ```
    - Using ``this`` we can easily find the address and balance of the contract!
#### ``This`` Keyword
- In Solidity the ``this`` keyword give us access to the contract itself.
    - We can call functions on it using the ``.`` operator:
    ```soliditiy
    import "hardhat/console.sol";
    contract Example() {
        function a() public view {
            console.log( this.b() ); // 3
        }
        function b() public pure returns(uint) {
            return 3;
        }
    }
    ```
    - If you think back to the Solidity **libraries** lesson, this is exactly how we call **external** functions as well!
- Let's look at an example calling library functions:
    ```solidity
    import "./UIntFunctions.sol";
    import "hardhat/console.sol";
    contract Example {
        constructor() {
            console.log( UIntFunctions.isEven(2) ); // true
            console.log( UIntFunctions.isEven(3) ); // false
        }
    }
    ```
- More importantly for ``this``, we can also explicitly convert this type to an ``address``:
    ```solidity
    import "./UIntFunctions.sol";
    import "hardhat/console.sol";
    contract Example {
        constructor() {
            console.log( address(this) ); // 0x8858eeb3dfffa017d4bce9801d340d36cf895ccf
            console.log( address(this).balance ); // 100000000000000000
            console.log( address(UIntFunctions) ); // 0x7c2c195cd6d34b8f845992d380aadb2730bb9c6f
        }
    }
    ```
    - Once we convert ``this`` to an address we can treat it like any other ``address``. It represents the address of the contract account itself.
#### Your Goal: Charity Donation
- Let's take all funds that were passed to the receive function and donate them to charity.
    - We'll do this in two steps.
1. **First**, modify the constructor to accept a new argument: the charity address.
1. **Next**, add a new function called donate. When this function is called transfer all remaining funds in the contract to the charity address.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address public owner;
    address public charity;

    constructor(address _charity) {
        owner = msg.sender;
        charity = _charity;
    }

    receive() external payable {}

    function tip() public payable {
        (bool s, ) = owner.call{value: msg.value}("");
        require(s);
    }

    function donate() public payable {
        (bool s, ) = charity.call{value: address(this).balance}("");
        require(s);
    }
}
```
---

### Self Destruct
- Contracts can destroy themselves by using the ``SELFDESTRUCT`` opcode on the EVM!
- This opcode actually **refunds ether** in order to incentivize folks to clean up the blockchain from unused contracts.
- Let's see it in action:
    ```solidity
    contract Contract {
        uint _countdown = 10;

        constructor() payable { }

        function tick() public {
            _countdown--;
            if(_countdown == 0) {
                // NOTE: we must cast to payable here
                // some solidity methods protect
                // against accidentally sending ether
                selfdestruct(payable(msg.sender));
            }
        }
    }
    ```
    - After 10 calls to the ``tick`` function the ``Contract`` will ``selfdestruct``!
- So you might be wondering, why did we provide the argument ``msg.sender``?
- The address provided to the ``selfdestruct`` function gets all of the ether remaining in the contract!
    - Ether sent to the ``payable`` constructor will be refunded to the final caller of the ``tick`` function.
>  Before self-destructing your smart contract you may want to consider the repercussions.
#### Self-Destruct Repercussions
- When you call selfdestruct on a contract account, the bytecode is cleared.
    - The contract will no longer be able to respond to ether transfers.
- If you are going to use ``selfdestruct``, you should be sure that nobody will accidentally send ether to your contract in the future.
    - There may be no recourse for getting that ether back if they do.
    - Future funds sent to this address could be locked forever!
>  Once the bytecode is cleared, you can deploy the same code to the same address using the CREATE2 opcode introduced in EIP-1014. Historically, the address of a contract was determined by the sender's address and account nonce. Instead of the nonce, CREATE2 opcode will take a salt and the contract creation code. Notice: we can only re-deploy to the same address if we used CREATE2 for the original deployment. You can learn more about how to do this by checking out [this tutorial](https://docs.alchemy.com/docs/how-to-deploy-a-contract-to-the-same-address-on-multiple-networks)
- Instead of self-destructing the contract, you could consider setting state variables so that nobody can call the function.
    - Then you revert the transaction if they try to call a function or send ether in the future!
    - This is probably the safest course of action.

#### Your Goal: Self Destruct
- When the ``donate`` function is called, trigger a ``selfdestruct`` in the contract!
> The ``selfdestruct`` will send all remaining funds to the ``address`` passed in, so it might be a good candidate to replace the existing functionality in your ``donate`` function by sending the funds to the ``charity``! Just be sure to cast the ``address`` to an ``address payable`` as shown in the example above.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    address public owner;
    address public charity;

    constructor(address _charity) {
        owner = msg.sender;
        charity = _charity;
    }

    receive() external payable {}

    function tip() public payable {
        (bool s, ) = owner.call{value: msg.value}("");
        require(s);
    }

    function donate() public payable {
        selfdestruct(payable(charity));
    }
}
```