
---
## Smart Contract Basics
---

---
### Solidity Syntax
---

### Intro to Solidity
#### A First Look at [Solidity](https://docs.soliditylang.org/en/v0.8.11/)
- As per the official docs, Solidity is an object-oriented, high-level language for implementing smart contracts. It is a language that closely resembles other popular programming languages like C++, Python and JavaScript.
> Solidity particularly resembles JavaScript!
- A decision that the early Ethereum founders had to make was: what language to use for the eventual Ethereum computer? 
    - It was decided that the creation of a new language would be more appropriate; Solidity is specifically designed to be compiled and run on the EVM.
- Here are some important properties of the Solidity language:
    - **statically-typed** (fancy term meaning variables must be defined at compile time)
    - **supports inheritance**: (specifically, smart contract inheritance chains)
    - **libraries**
    - **complex user-defined types**, among other features
- Solidity is a programming language used to write smart contracts.
> P.S.: There are many smart contract programming languages! We like to focus on Solidity because it has a very active developer ecosystem. [Vyper](https://vyper.readthedocs.io/en/stable/) is a cool language to explore too!

#### Smart Contracts
- Since we are focusing on Solidity, the language used to build EVM-compatible smart contracts, we should first also cover **smart contracts**.

#### Smart Contracts - The Theoretical Approach
- Nick Szabo, a famous computer scientist and cypherpunk, ideated the original concept and cointed the term smart contracts.
- In his 1996 paper, Szabo states the formal definition behind the early concept:
- "A smart contract is a set of promises, specified in digital form, including protocols within which the parties perform on these promises."
- The theoretical approach is for us to gain an understanding of the generalizec concept behind smart contracts... basically that they are typical contracts but in digital form and have stronger enforcement parameters.

#### Smart Contracts - The Ethereum Approach
- A smart contract is simply a program that runs on the Ethereum computer. 
- More specifically, a smart contract is a collection of code (functions) and data (state) that resides on a specific address on the Ethereum blockchain. 
- These are written in Solidity which means they must be compiled into bytecode first in order to be EVM-compatible.

#### Smart Contracts - Properties
- Smart contracts inherit many awesome cryptographic properties directly from the Ethereum computer. Mainly, smart contracts are:
- **permissionless**: anyone can deploy a smart contract to the Ethereum computer
> The only requirement here is some ETH in order to pay for gas fees!
-**composable** : smart contracts are globally available via Ethereum, so they can be thought of as open APIs for anyone to use
> Functions in smart contracts can be thought of as globally accessible API endpoints! 

#### Smart Contracts - The Vending Machine 
- In '[The Idea of Smart Contracts](https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/idea.html)', published in 1997, Szabo states:
- ``“A canonical real-life example, which we might consider to be the primitive ancestor of smart contracts, is the humble vending machine.”``
- Basically, he is saying that vending machines are a great analogous way to understand the concept of smart contracts. 
- Why? Well because they function pretty much the same! 
- A vending machine is a machine that you program some set logic into. 
    - That set logic dictates how users will interact with the machine. A vending machine's logic is pretty simple:
    1. If you deposit sufficient money into the machine...
    1. ... then select a drink that is priced below or equal to the amount of money you deposited...
    1. ... then the machine will provide you the drink you selected.
- In simpler terms, here is a quick formula representing the logic behind a simple vending machine:
    - ``money`` + ``drink_selection`` = ``drink dispensed``
- A smart contract, just like a vending machine, has logic programmed directly into it. 
- That logic sets up how users must interact with the contract. 
- If users interact outside of the scope of the programmed logic, then the program fails. 
    - Just like if you choose not to deposit money in a vending machine, it will simply not dispense a drink to you. 
    - Same with a smart contract! But smart contracts are cooler! And we can't wait to see you build em like a psycho-builder!! 

#### Back to Solidity
- Ok, now that we've framed a conceptual understanding to smart contracts (smart contracts = really fancy digital vending machines with cryptopgrahic powers!), it's time to come back to our main focus: Solidity.

#### Solidity - The Contract 📜
```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    contract MyContract {

    }
```
- Let's the get the basics out of the way. Line by line:
    - ``Line 1`` - This is a line you will typically always see as the first line of most smart contracts.
        - This line for the developer to specify what license rules fall on that specific smart contract.
    - ``Line 2`` - The pragma line tells us which version of Solidity to compile the smart contract with.
        - The above tells us the contract will be compiled on ^0.8.4.
    - ``Lines 4-6`` - The contract scope - anything inside is specific to MyContract.
        - The contract keyword behaves eerily similar to the class keyword of JavaScript****
> Check out all of the licenses you can use for your smart contracts [here](https://spdx.org/licenses/).
- Solidity Uses Semantic Versioning
![Semver](https://media.geeksforgeeks.org/wp-content/uploads/semver.png)
- We are early!
    - We are still on Solidity major version 0 which means the minor versions act as breaking changes (something major versions typically do) until the Solidity team feels like the language is ready for major version 1.

#### Solidity - Constructor
- Let's add a ``constructor()`` to the skeleton Solidity code started above:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    contract MyContract {
        constructor() {
            // called only ONCE on contract deployment
        }
    }
    ```
- ``Lines 5-7`` - The constructor() function is called only once during deployment and completely discarded thereafter.
    - It is typically used to specify state when deploying a contract.
        - For example, if you are deploying a new DAO smart contract, the constructor() would make a great place to initialize it directly with specific state like an array of member addresses or a boolean flag to indicate whether the DAO will accept proposals on deployment.

#### Solidity - State Variables
- You might be wondering what is meant by a constructor specifying state at deployment... typically, a smart contract will contain state variables (let's keep adding to the same block of code!):
    ```solidity
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.4;

        address owner;
        bool isHappy;

        contract MyContract {
            constructor(address _owner, bool _isHappy) {
                owner = _owner;
                isHappy = _isHappy;
            }
        }
    ```
- ``Lines 4-5`` - These lines declare two state variables: owner and isHappy.
    - They are initialized to their default values (0x0 and false respectively) if no explicit initialization is performed.
- ``Line 8`` - Notice the smart contract's constructor now requires two parameters: an address and bool type respectively.
    - This means the constructor expects you to pass two values as arguments at deploy time.
> Notice the _owner and _isHappy variables have underscore preceding them? This is to prevent [variable shadowing](https://en.wikipedia.org/wiki/Variable_shadowing). 👻
- ``Lines 9-10`` - These lines are executed as soon as the smart contract is deployed, which means the state variables declared at the top of the contract receive the value passed in by the deployer.
> A typical script deployment for the constructor above, written in JS, might look like this:
```javascript
// this line deploys a smart contract that sets the `owner` state variable to `0x38..CB` and the `isHappy` state variable to `true`
const myContractInstance = await contract.deploy('0x38cE03CF394C349508fBcECf8e2c04c7c66D58CB', true)
```
- Solidity - State Variables Visibility
- Let's add visibility to the state variables above:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    address public owner;
    bool public isHappy;

    contract MyContract {
        constructor(address _owner, bool _isHappy) {
            owner = _owner;
            isHappy = _isHappy;
        }
    }
    ```
- ``Lines 4-5`` - These are the exact same lines as the above snippet but we've added a visibility of public to the contract's state variables
- When you make state variables ``public``, an automatic "getter" function is created on the contract. This just means the variable is publically accessible via a ``get`` call.
>  State variables can be declared as public, private, or internal but NOT external.

#### Solidity - Numbers
- Let's add a ``uint`` and an ``int`` state variable to our code:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    address public owner;
    bool public isHappy;
    uint public x = 10;
    int public y = -50;

    contract MyContract {
        constructor(address _owner, bool _isHappy) {
            owner = _owner;
            isHappy = _isHappy;
        }
    }
    ```
- ``Lines 6-7`` - We've added two new state variables to ``MyContract`` and initialized them directly to ``10`` and ``-50``. In Solidity there are ``uint`` and ``int`` variables used to represent numbers. An **unsigned integer** has no sign.
- Numbers Have Different Sizes!
- The uint and int variables have set sizes:
    ```solidity
    contract MyNumberContract {
        uint8 x = 255;
        uint16 y = 65535;
        uint256 z = 10000000000000000000;
    }
    ```
> A ``uint`` by default is 256 bits. So labelling a state variable as ``uint`` is the exact same as labelling it with ``uint256``.
- Familiar Math Operators ➕
- Solidity has many of the same familiar math operators:
    ```solidity
    contract MyNumberContract {
        uint x = 100 - 50;
        uint y = 100 + 22;
        uint z = 100 / 20;
    }
    ```
#### Solidity - [Data Types](https://docs.soliditylang.org/en/v0.8.17/types.html)
- The following are all data types available on Solidity:
    - [boolean](https://docs.soliditylang.org/en/v0.8.17/types.html#booleans): declared as ``bool``
    - [string](https://docs.soliditylang.org/en/v0.8.17/types.html#string-literals-and-types): declared as ``string``
    - [integers](https://docs.soliditylang.org/en/v0.8.17/types.html#booleans): declared as either ``uint`` or ``int``
    - [bytes](https://docs.soliditylang.org/en/v0.8.17/types.html#bytes-and-string-as-arrays): decalred as ``bytes``
    - [enums](https://docs.soliditylang.org/en/v0.8.17/types.html#enums)
    - [arrays](https://docs.soliditylang.org/en/v0.8.17/types.html#enums)
    - [mappings](https://docs.soliditylang.org/en/v0.8.17/types.html#mapping-types)
    - [structs](https://docs.soliditylang.org/en/v0.8.17/types.html#mapping-types)
- Solidity - ``address`` and ``address payable``
- You've probably seen similar variations of most of the types listed above. There is also a very important Solidity-specific type called ``address``. As per the Solidity docs:
    - "The address type comes in two flavours, which are largely identical:
    - ``address``: Holds a 20 byte value (size of an Ethereum address).
    - ``address payable``: Same as ``address``, but with the additional members ``transfer`` and ``send``."
> Whenever you see the keyword ``payable``, that's just Solidity fancy lingo for: "this can accept money!". Don't worry, we'll break down the ``payable`` keyword much further...
- ``address`` and ``address payable`` are first-class types, meaning they are more than simple strings holding some Ethereum address value. Any ``address``, either passed in to a function or cast from a contract object, [has a number of attributes and methods directly accessible on it](https://docs.soliditylang.org/en/v0.8.17/types.html#members-of-addresses):
    - ``address.balance``: returns the balance, in units of ``wei``
    - ``address.transfer``: sends ether to a ``address payable`` type
> Curious to know a smart contract's own balance? Just use address(this).balance!

#### Smart Contract Context
> This short section is really important to understand!
- When a smart contract function is called via a transaction, the called function gets some extra information passed to it. Within a smart contract function you’ll have access to these context variables, including:
1. **Message Context (msg)**
    - ``msg.sender`` - returns the current transaction sender address
    - ``msg.value`` - returns the ``value`` property of the current transaction
2. **Transaction Context (tx)**
    - ``tx.gasLimit`` - returns the ``gasLimit`` property of the current tx
3. **Block Context (block)**
    - ``block.number`` - returns the current block ``number``
    - ``block.timestamp`` - returns the current block ``timestamp``
- Other Ways to Think About ``msg.sender``
    - ``msg.sender``: Who is currently sending this transaction?
    - ``msg.value``: How much value does this transaction carry?

#### Suggested Reading
- [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook)
    - Chapter 7: Smart Contracts & Solidity
    - Chapter 9: Smart Contract Security
    - Chapter 13: EVM
- [Smart Contracts: Building Blocks for Digital Markets](https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/smart_contracts_2.html)
- [The Idea of Smart Contracts](https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/idea.html)
- [Solidity by Example](https://solidity-by-example.org/)

#### Conclusion
- We learned a lot of the basic stuff that powers Solidity such as data types and constructors.
- Using Solidity, we can write cutting edge smart contracts, which we learned to conceptualize as just really smart and cryptographically secure vending machine descendants.
- The very important takeaways from this section are:
    - ``msg.sender`` (understand message context!)
    - ``address`` (understand the EVM-specific types)

---

### Solidity and the EVM
- Solidity is a **high-level language** that **compiles** down into **bytecode** which is run directly on the Ethereum Virtual Machine.
- The terms **high-level** and **low-level** can be thought of as a spectrum.
    - Programming languages like C are considered low-level.
    - On the other hand, Solidity and JavaScript are considered high-level languages.
    - We can say that JavaScript is more high-level than C.
    - In general, the more details of the machine that are abstracted away from the developer, the more high-level it is considered.
- Solidity is **more low-level** than JavaScript, which means it hides less of the underlying machine details.
    - This can make it more difficult to work with, which is by design, to some degree, as we should be very careful about what we're deploying on the EVM!
    - Every operation on the EVM and everything we store on the blockchain costs money, so it becomes expensive to be inefficient.
    - Plus, we want to make sure we understand our Smart Contracts inside and out so we don't have any bugs!
- The lowest-level languages are what the machine actually executes.
    - For the EVM this is bytecode, which is where the code for the operations, known as opcodes, are stored in a byte.
#### Talk Bytecode To Me
- Solidity is the part we deal with as a developers. What does the EVM deal with?
    - Bytecode! Let's talk about bytecode and EVM opcodes a bit.
> This part goes over some low-level details of the EVM which we won't cover in too much detail. Some parts may be confusing. Stick with it though, it's a good idea to have a basic understanding of the low-level!
- Consider a Smart Contract containing a simple ``while`` loop:
    ```solidity
    uint i = 0;
    uint sum = 0;
    while(i < 5) {
        sum += i;
    }
    ```
>  Here ``uint`` is a declaration of an **unsigned integer**. We'll discuss the intricacies of this data type in future lessons. For now consider it a declaration of a variable that stores a number.
- When we send a Smart Contract to the EVM we send only the bytecode
- For a contract containing just the loop code above, the resulting bytecode can be quite long:
```
6080604052348015600f57600080fd5b5060a58061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063a92100cb14602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000806000905060008090505b600582101560675781810190506056565b80925050509056fea264697066735822122058d7e11ff1d36fc53779562e305af3c9180b2ab8dccfe6d234fa50420908a5d864736f6c63430006030033
```
- Well that's quite scary! What is all that?
- Some of it is **opcodes** and some of it is **operands**, which are the optional arguments. An opcode and its operands combined form an **instruction**.
- We can lookup [EVM Operation Codes](https://github.com/crytic/evm-opcodes) and replace the opcode with its name (commonly referred to as a mnemonic):
    ```
    PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0xA5 DUP1 PUSH2 0x1E PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x28 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0xA92100CB EQ PUSH1 0x2D JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x33 PUSH1 0x49 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 SWAP1 POP PUSH1 0x0 DUP1 SWAP1 POP JUMPDEST PUSH1 0x5 DUP3 LT ISZERO PUSH1 0x67 JUMPI DUP2 DUP2 ADD SWAP1 POP PUSH1 0x56 JUMP JUMPDEST DUP1 SWAP3 POP POP POP SWAP1 JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 PC 0xD7 0xE1 0x1F CALL 0xD3 PUSH16 0xC53779562E305AF3C9180B2AB8DCCFE6 0xD2 CALLVALUE STATICCALL POP TIMESTAMP MULMOD ADDMOD 0xA5 0xD8 PUSH5 0x736F6C6343 STOP MOD SUB STOP CALLER
    ```
- Even that doesn't really clear things up!
    - Fortunately the Solidity compiler has an assembly output that can help us take a closer look!
    - This output will line up the assembly code with the solidity code that it was generated from so we can study it.
> We won't study it all, however! Quite a lot of the code generated handles default behavior for Smart Contracts. We'll cover that behavior in upcoming lessons.
- For now let's take a look at one particular section:
    ```
    tag 7               while(i < 5) ...
    JUMPDEST          while(i < 5) ...
    PUSH 5            5
    DUP3              i
    LT                i < 5
    ISZERO            while(i < 5) ...
    PUSH [tag] 8      while(i < 5) ...
    JUMPI             while(i < 5) ...
    DUP2              i
    DUP2              sum += i
    ADD               sum += i
    SWAP1             sum += i
    POP               sum += i
    PUSH [tag] 7      while(i < 5) ...
    JUMP              while(i < 5) ...
    tag 8               while(i < 5) ...
    JUMPDEST          while(i < 5) ...
    DUP1              sum
    SWAP3             return sum
    POP               return sum
    ```
    - On the left-side you can see a representation of the EVM instructions.
    - On the right-side you can see a comment indicating where in the Solidity code the instruction is being generated from.
- Also included here, for human-readability, are **tags** which are more commonly referred to as **labels**.
    - Labels are used to mark **locations** in the code that we can go to.
    - This is necessary because, at the lowest level of computer instruction, **there are no loops**.
- Instead of loops, there are operations that allow you to change what line of code **runs next**.
    - These operations manipulate the **program counter** which is the variable that stores the line of code being executed.
- The two operations that manipulate the programming counter in the EVM are JUMP and JUMPI.
    - The tags are locations in the code that you can jump to.
    - That's why underneath the declaration of both tag 7 and tag 8 in the code above you'll see there's a JUMPDEST operation.
        - This operation creates a valid destination for a jump.
> Fun fact, ``JUMP`` and ``JUMPI`` are the instructions that make the EVM **Turing Complete**! With these operations we can trivially create an **infinite loop**, which is why it's necessary for Ethereum to apply a gas cost to every operation. Don't want the network nodes to be stuck in interminable loops!
- So if there are no loops in assembly code, how does a ``while`` loop get compiled from Solidity to bytecode?
- Let's take a look at this particular section of code:
    ```
    PUSH 5            5
    DUP3              i
    LT                i < 5
    ISZERO            while(i < 5) ...
    PUSH [tag] 8      while(i < 5) ...
    JUMPI             while(i < 5) ...
    ```
    - There's quite a bit going on here!
    - The value ``5`` is being pushed onto a memory structure called **the stack**.
>  The stack is where most operations on the EVM will load/store runtime data. It is a data structure that is used for temporary memory like storing local variables and running arithmetic on those variables. Many opcodes will use the values at the top of the stack as its operands. And just like the stack we programmed in **data structures** it's a LIFO structure with quite a bit of **pushing** and **popping**!
- The value for the variable ``i`` is stored in the third byte position on the stack, so that is duplicated and compared to the value ``5`` using the ``LT`` (less than) operator. If the value is less than ``5`` this will evaluate to ``1``, otherwise ``0``.
- The ``ISZERO`` here is the condition for which ``JUMPI`` will jump to the memory location ``tag 8``. If it results in ``1``, it will jump to ``tag`` ``8`` and will move towards the part of the program that will return the ``sum``.
- If the comparison results in ``0``, we'll run the loop code:
    ```
    DUP2              i
    DUP2              sum += i
    ADD               sum += i
    SWAP1             sum += i
    POP               sum += i
    PUSH [tag] 7      while(i < 5) ...
    JUMP              while(i < 5) ...
    ```
-  Here it will add the value stored in ``i`` to the ``sum`` value.
    - It does this through some stack manipulation and the ``ADD`` operation which, as you might imagine, adds two numbers together.
    - After this, the program will unconditionally jump back to ``tag 7`` from where it will run the ``i`` comparison again.
>  Quite a bit of this is simplified to give the **gist of what is happening**. If you have an interest in digging further, I'd suggest taking a look at an [EVM Disassembler](https://github.com/crytic/ethersplay).

---
### Solidity at a Glance
#### Smart Contracts
- Before we dive into Solidity Coding Tutorials, let's study a Smart Contract!
- Here is an example smart contract called OnOffSwitch written in Solidity:
    ```solidity
    /* Here we specify the solidity versions
    * Any version greater than or equal to 0.6.2
    * or less than 0.7.0 will compile this contract */
    pragma solidity ^0.6.2;

    contract OnOffSwitch {
        // the switch is on if true
        bool private isOn;

        constructor() public {
            // we'll default to being on
            isOn = true;
        }

        // a publicly accessible function to "flip" the switch
        function toggle() public returns(bool) {
            // flip isOn from true->false or false->true
            isOn = !isOn;
            // return the new value
            return isOn;
        }
    }
    ```
- Coming from learning JavaScript, what are some of the immediately noticeable things about this programming language?
- First let's look at the **similarities** to JavaScript:
    - Comments appear to be the same! Both syntaxes: ``// comment`` and ``/* comment */``
    - The casing used is the same as JavaScript, it is lowerCamelCase
    - Curly Braces ``{}`` seem to serve a similar purpose: marking scope
    - Boolean values ``true/false`` which can be modified with boolean operators like: ``!``
    - The ``contract`` keyword seems a bit like JavaScript ``class``, especially the constructor
    - The function syntax looks a bit similar to JavaScript
    - The ``return`` keyword is still used for passing a value back from a function
- Now let's look at the **dissimilarities**:
    - There seems to be some kind of version control statement at the top: ``pragma``
    - There are public/private keywords for variables and functions
    - The ``isOn`` variable is prefaced with its type ``bool``
    - The code refers to the ``isOn`` member variable without using ``this``
    - The function ``toggle`` defines what it will return, a ``bool``
- Ok, well that was a good quick glance!
- Now let's dive into all of these things we noticed to learn more about the language.

#### Compiler Version Control
- Version Control can be very helpful to specify a range of versions that are acceptable for a dependency or a tool.
- In Solidity, we can specify what versions of the compiler our contract will work with using the pragma keyword:
    ```solidity
    pragma solidity ^0.6.2;
    ```
    - The ``^`` symbol indicates that this contract will compile with not only version ``0.6.2``, but also anything above that version all the way up until the next minor version ``0.7.0``.
- This syntax may look very similar to you from **npm** when we worked with the **package.json**!
    - Both of these systems use [semantic versioning](https://semver.org/) where there are three values:
        - The **major** version: ``x.0.0``
        - The **minor** version: ``0.x.0``
        - The **patch** version: ``0.0.x``
- **Major** updates make no guarantee of backwards compatibility.
    - Generally major updates introduce **many breaking changes** that will require you to make changes to your code to update successfully.
- **Minor** version updates will generally add functionality in a backwards-compatible way.
- **Patch** version updates are meant for bugfixes and **should not** break your code's expected behavior (unless you were depending on behavior which was the result of a bug).
> It should be noted that, at the time of writing, **Solidity has yet to release its first major version**. Prior to the **major version 1.0.0**, many systems are considered unstable where anything may change at any time. So far Solidity development has stuck to making breaking changes on the **minor** version updates. That is, for example, contracts written for ``0.4.x`` may not work with solidity compiler versions ``0.5.x`` and above. Each release will [document the breaking changes](https://solidity.readthedocs.io/en/v0.6.2/050-breaking-changes.html).

#### The Contract
- At first glance, the ``contract`` keyword looks a bit like ``class`` in JavaScript!
    ```js
    contract OnOffSwitch {
        // the switch is on if true
        bool private isOn;

        constructor() public {
            // we'll default to being on
            isOn = true;
        }
    }
    ```
   - Here we are declaring ``isOn`` as a member variable of the ``OnOffSwitch`` contract. In Solidity these variables are generally referred to as **state variables**.
- Just like in JavaScript classes, the constructor is run only once.
    - For contracts, the constructor is run when it is deployed.
    - The ``isOn`` state variable will be set to ``true`` on the deployment of this contract.
- The ``isOn`` variable is accessible anywhere in this contract by name.
    - Unlike JavaScript class variables, there is no need to use ``this.`` inside of the contract itself to gain access to the state variables.
> The this keyword is still used in Solidity as a reference to the contract account. We'll talk about this a bit more in the upcoming coding tutorials!
- Since state variables are referred to by name, you may often see constructor arguments using underscores to disambiguate:
    ```solidity
    constructor(bool _isOn) public {
        // in this case we'll accept a boolean argument
        // that will set the initial value of isOn
        isOn = _isOn;
    }
    ```
- It's important to recognize that when we make a change to a state variable on a deployed smart contract, we are **modifying permanent storage** on the blockchain.
>  Remember from our lessons on Ethereum that permanent storage on the blockchain is stored in Patricia Merkle Tries on every Ethereum Full Node.
- Local variables defined inside of a code block ``{}`` or passed in as arguments live in memory only for the length of their particular scope.

#### Control Structures
- As you may have noticed in our initial example, Solidity also has the ``return`` statement for passing back values from a function.
- One difference in Solidity is that multiple values can be returned from a Solidity function as a ``tuple``:
    ```solidity
    function getValues() public pure returns (int, bool) {
        return (49, true);
    }
    ```
    - The following statement is perfectly valid in Solidity.
    - Similarly, tuples can be used to destructure assignments similar to **destructuring** in JavaScript:
    ```solidity
    (bool x, bool y) = (true, false);
    ```
> You can think of a **tuple** simply as a group of values in parenthesis. They are not a formal structure in Solidity so they are primarily used for returning and destructuring as shown above.
- Along with the ``return`` keyword, Solidity also has ``if``, ``else``, ``while``, ``do``, ``for``, ``break``, and ``continue`` with the same semantics as JavaScript.

#### Visibility
- You may have noticed the keywords ``public`` and ``private`` in the initial contract example shown.
    - These keywords are called **visibility specifiers** because they determine from where functions can be accessed.
- As you might expect, a ``public`` function is one that can be accessed from anywhere.
    - A ``private`` function is one that cannot be.
    - When a variable is declared ``public``, a **getter** function is generated that will allow access to the variable state.
> The keyword private does not **protect the privacy of the data itself**. Any data committed to the Ethereum blockchain is public for anyone to see! Marking it as **private** will simply disallow any other contract from reading or modifying the information.
- In addition to ``public`` and ``private``, there are also ``internal`` and ``external`` visibility specifiers.
    - We'll discuss these specifiers further as we dive into contract communication through message passing.

#### Static Typing
- The last big distinction we noticed from the example is that Solidity has **static typing**.
- In JavaScript, you don't need to specify the data type.
    - We use keywords like ``var``, ``let`` and ``const`` that could hold numbers, strings, and other various objects:
    ```js
    let strangeValue = 3;
    strangeValue = "now im a string!";
    ```
    -  Changing a variable's type like this may not be the best practice, however from the JavaScript language's perspective this is perfectly valid!
        - This is because JavaScript is a **dynamically typed language**.
- In Solidity, all variables must declare their type:
    ```solidity
    bool isOn = true;
    ```
    - Here our ``isOn`` variable is a boolean value. It must always be ``true`` or ``false``.
> By default, boolean values are ``false``.
- What if we tried storing a number in a ``bool``?
    ```solidity
    bool myNumber = 10; // ...hmm?
    ```
- No good!. In fact, Solidity won't even compile with a statement like this.
- The compiler will raise a **"TypeError: Type int_const 10 is not implicitly convertible to expected type bool."** And rightly so!
> An exception raised at compile time is called a **compile-time exception**. This means that the compiler was unable to generate bytecode from the program, so we would not even be able to deploy this contract! This is opposed to a **run-time exception** which would happen when someone tried to interact with a contract on the blockchain in some expected way. The exception would occur when a miner tries to validate the transaction. Unless the exception is caught, the transaction will fail and the miner will consume all the gas.
- Static typing also affects the way the a function is declared. Let's use our example above where we returned a **tuple**:
    ```solidity
    function getValues() public pure returns (int, bool) {
        return (49, true);
    }
    ```
    - Here the function must declare what type of values it is going to return.
        - It defines that an integer and boolean will be returned in a tuple list in that order.
    - If it were to try and return values of a different data type it would throw an exception.


---
## Functions
---
### Intro to Solidity [Functions](https://docs.soliditylang.org/en/v0.8.17/contracts.html#functions)

#### Solidity Functions
- In Solidity, a function is generally defined by using the function keyword.
    - Functions are where actual logic is contained on a smart contract. Let's dive in...
#### Solidity Functions - Syntax
- The most common way to define a function in Solidity is by using the ``function`` keyword:
    ```solidity
    // function_keyword + function_name(paramter_list) + visibility {}
    function helloWorld(bool _saysHello) public {
        // statements
    }
    ```
- If the function returns a value, the syntax of a function header includes a ``returns`` statement, as shown below:
![Returns](https://res.cloudinary.com/divzjiip8/image/upload/v1671060100/alchemyu/Screen_Shot_2022-12-14_at_3.20.22_PM.png)
- Here's a quick function in a sample ``MyContract``:
    ```solidity
    contract MyContract {
        function myFunction() external pure {
            uint x = 5;
        }
    }
    ```
> The ``myFunction`` above doesn't really do much! Once called, the function will just declare a new variable ``x`` with a value of ``5`` in local memory, then execution will end which means local memory is wiped. Nothing happens!
- This is what a script call to this function would look like in JavaScript:
    ```js
    const myTx = await contract.myFunction();
    ```
    - The above script call will send a transaction to the MyContract address with a specific call to the myFunction() endpoint.
        - The EVM will execute the statements inside until it reaches the closing bracket.
        - Once the logic in a function completes, the transaction is mined and any effects are indexed in the tx's own receipt.
- What about a function that actually does something? Here is one example:
    ```solidity
    function changeOwner(address _newOwner) public {
        owner = _newOwner;
    }
    ```
- The above function lives in a smart contract containing an ``owner`` state variable.
    - By calling the ``changeOwner()`` function and passing a new ``address`` to it, the contract will overwrite the current contract ``owner`` with the passed-in ``_newOwner`` value.

#### Solidity Functions - Declarations
- You will sometimes see functions in Solidity contain one of the following keywords: [``view`` and ``pure``](https://solidity-by-example.org/view-and-pure-functions/).
    - ``view``: this function promises that** NO state will be changed, only read**
    > This is basically a keyword that can be seen as the function itself saying: "I promise to just "view", not change state!"
    - ``pure``: this function promises that NO state will be changed nor read
    > This is basically a keyword that can be seen as the function itself saying: "I promise to act completely independent of the smart contract I am in!"
- View Function Example
    - Let's set up a simple contract with two state variables...
    ```solidity
    pragma solidity 0.8.4;
    contract MyContract {
        uint x = 5;
        uint y = 10;
    }
    ```
    - Let's then add a new function called ``sum()`` and declare it as ``view``:
    ```solidity
    pragma solidity 0.8.4;
    contract MyContract {
        uint x = 5;
        uint y = 10;

        function sum() external view returns(uint) {
            return x + y;
        }
    }
    ```
    - Notice how the ``sum()`` function, declared as ``view``, keeps it promise?
        - It is only reading from state because it uses the ``x`` and ``y`` state variable values in order to return their sum.
        - It is reading from state to produce a new value but it is not changing any state.
    > A view cannot write to storage.
- Pure Function Example
    - If you noticed in the first contract example, there is already a pure function used:
    ```solidity
    contract MyContract {
        function myFunction() external pure {
            uint x = 5;
        }
    }
    ```
    - The keyword ``pure`` means this function does not read or write storage.
        - It functiona completely independent from contract state.
        - But again, the function above is not really useful at all...

#### Solidity Functions - Returns
- A more useful ``pure`` function would be one that ``returns`` something:
    ```solidity
    contract MyContract {
        function add(uint x, uint y) external pure returns(uint) {
            return x + y;
        }
    }
    ```
    - ``pure`` functions like the one shown above are typically used in libraries or for functionality that is not specific to a smart contract's state but is still needed for independent contract operations.
- Notice the syntax required for functions that actually ``return`` a value? You must indicate the return type in the ``returns(data_type)``  block.
- Implicit Return
    - The ``returns`` syntax in Solidity can also look like this:
    ```solidity
    contract MyContract {
        function add(uint x, uint y) external pure returns(uint z) {
            z = x + y;
        }
    }
    ```
    > Believe it or not, ``z`` is **implicitly returned** here!
- Return Multiple Values
    ```solidity
    contract MyContract {
        function mathTime(uint sum, uint product) external pure returns(uint sum, uint product) {
            sum = x + y;
            product = x * y;
        }
    }
    ```
    - In this case, both the ``sum`` and ``product`` are returned.
- Return Multiple Values Using ``return``
    ```solidity
    contract MyContract {
        function mathTime(uint sum, uint product) external pure returns(uint, uint) {
            uint sum = x + y;
            uint product = x * y;

            return (sum, product);
        }
    }
    ```
    > The returned value is referred to as a **tuple**.
#### Functions - Writing to Storage
- A function can write (fancy term for changing some state) if it is NOT ``pure`` or ``view``:
    ```solidity
    contract MyContract {
    uint x = 5;
    uint y = 10;
    uint z;

        function storeSum() external {
            z = x + y;
        }
    }
    ```
    - Since this function is writing to storage via directly assigning a value to the ``z`` state variable, it will always cost gas to execute on the Ethereum network.
> Storage is expensive on the Ethereum network! 💸 As a developer, you must always be optimizing for the least friction possible when changing state so that you do not incur large gas costs to you or your users!

#### Solidity Functions - [Visibility](https://solidity-by-example.org/visibility/)
- We've only seen the public visibility so far.
    - Function signatures always contain a visibility identifier... basicaly, how accessible to do you want this function to be?
- Functions can be declared, from most-public to least-public, as:
    - ``public`` - any contract or EOA can call into this function
    - ``external`` - only other contracts (external to the current contract) and EOAs can call, no internal calling
    - ``internal`` - only this contract along with its inheritance chain can call
    - ``private`` - only this contract can call
- State variables work off the same exact criteria for visibility. State variables can be declared as ``public``, ``private``, or ``internal`` but not ``external``.

#### Suggested Reading
- [Solidity function visibility explained](https://bitsofco.de/solidity-function-visibility-explained/)
- [Solidity by Example - Visibility](https://solidity-by-example.org/visibility/)
- [Solidity by Example - Pure and View](https://solidity-by-example.org/view-and-pure-functions/)
- [Modifying the Merkle Patricia Trie](https://medium.datadriveninvestor.com/modifying-the-merkle-patricia-trie-4b15813d8e6b)

#### Conclusion
- We've looked main pillars of Solidity logic: functions.
    - It is important to distinguish the appropriate visbility and declaration.
    - These keywords are extremely important to know, as they are typically included in most Solidity function signatures and have important security ramifications (ie. who can access this function?).
