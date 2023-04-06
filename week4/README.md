
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

---
## Smart Contract Communication
---
#### Smart Contract Compilation
- Up until now, we've learned about the Solidity programming language and how it used to write programs on the Ethereum computer, otherwise referred to as smart contracts.
- Let's get a little lower-level... In order to understand how contracts communicate, we must first understand:
    - contract **compilation**
    - contract **deployment**
    - contract **interaction**
#### Contract Compilation Produces Two Artifacts: ABI & Bytecode
- When a smart contract is compiled, the Solidity compilation process produces two very important artifacts:
![artifacts](https://res.cloudinary.com/divzjiip8/image/upload/v1671068770/alchemyu/Screen_Shot_2022-12-14_at_5.27.18_PM_5b9ff7.png)
1. [the contract's **ABI**](https://docs.soliditylang.org/en/v0.8.13/abi-spec.html):
    - we keep the ABI for front-end libraries to be able to communicate with the contract
2. the contract's **bytecode**
    - we deploy the bytecode directly to the blockchain, in which case it is stored directly in the contract account's state trie

#### ABI - Application Binary Interface (Computer Science)
- In computer science, an ABI is typically an interface between two program modules.
    - For example, an operating system must communicate with a user program somehow.
    - That communication is bridged by an ABI, an Application Binary Interface.
- An ABI defines how data structures and functions are accessed in the machine code.
    - Thus, this is the primary way of encoding/decoding data in and out of machine code.
- You can think of an ABI as a general encoding/decoding bridge for machine code.

#### ABI - Application Binary Interface (Ethereum)
- **In Ethereum, a contract's ABI is the standard way to interact with a contract.**
- The ABI is needed to communicate with smart contracts, whether you are:
    - attempting to interact with a contract from outside the blockchain (ie. interacting with a smart contract via a dApp)
    - attempting a contract-to-contract interaction (ie. a contract performing a JUMP call to another contract)
- The ABI is used to encode contract calls for the EVM and to read data out of transactions.
- In Ethereum, the purpose of the ABI is to:
    - define the functions in the contract that can be invoked and...
    - describe how each function will accept arguments and return its result

#### What Does the ABI Look Like?
- Let's look at a quick Solidity smart contract:
    ```solidity
    // SPDX-Licence-Identifier: MIT
    pragma solidity 0.8.4;

    contract Counter {
        uint public count;

        // Function to get the current count
        function get() public view returns (uint) {
            return count;
        }

        // Function to increment count by 1
        function inc() public {
            count += 1;
        }

        // Function to decrement count by 1
        function dec() public {
            // This function will fail if count = 0
            count -= 1;
        }
    }
    ```
    - ``Counter.sol`` is a simple smart contract that presides over one single state variable: ``count``.
        - There are a few function that directly control the ``count`` state and anyone can call them.
        - That's all fine as well, but what if we want to cool a function from this contract from a front-end library like Ethers.js?
        - This is where you'll need the ABI!
- This is what the ``Counter.sol`` ABI looks like:
    ```json
    [
        {
            "inputs": [],
            "name": "count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "dec",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "get",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "inc",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    ```
    - As you can see, the ABI of a contract is just one big JSON object.
        - As developers, we simply need to know that the ABI is necessary in order for front-end tools to be able to interface and thus communicate with a smart contract!
        - This is further explained in the **ABI Encoding** section below.
> If you aren't familiar with the term "calldata", make sure to review the last section of Intro to Transactions. 🧠

#### ABI vs API
- Similar to an API, the ABI is a human-readable representation of a code's interface.
    - An ABI defines the methods and structures used to interact with the machine code representation of a contract, just like APIs do for higher-level composability.

#### ABI Encoding
- The ABI indicates to the caller of a contract function how to encode the needed information, such as function signatures and variable declarations, in such a way that the EVM knows how to communicate that call to the deployed contract's bytecode.

#### Interacting With a Smart Contract
- If your web application wants to interact with a smart contract on Ethereum, it needs:
    1. the contract's **address**
    2. the contract's **ABI**
- We provide the ABI to the front-end library.
    - The front-end library then translates and delivers any requests we make using that ABI.
- Let's look at an example...
- Ethers.js Contract Instance Example
- [``Contract`` is a class abstraction in ethers.js](https://docs.ethers.org/v5/api/contract/contract/) that allows us to create programmatic instances of contracts in a flash.
- Here is a quick script that can be used to interact with the ``Counter.sol`` contract we inspected above, [now deployed on Göerli test network](https://goerli.etherscan.io/address/0x5F91eCd82b662D645b15Fd7D2e20E5e5701CCB7A):
    ```javascript
    require('dotenv').config();
    const ethers = require('ethers');

    const contractABI = [
    {
        inputs: [],
        name: 'count',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'dec',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'get',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'inc',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    ];

    const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    process.env.TESTNET_ALCHEMY_KEY
    );

    const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

    async function main() {
    const counterContract = new ethers.Contract(
        '0x5F91eCd82b662D645b15Fd7D2e20E5e5701CCB7A',
        contractABI,
        wallet
    );

    await counterContract.inc();
    }

    main();
    ```
#### Bytecode
- We've covered the main artifact produced via contract compilation: the contract's ABI.
    - Now let's look at what is produced at contract deployment: the contract's bytecode.
    - Contract bytecode is the translation of that smart contract that machines can understand, specifically the EVM.
    - It represents the actual program, in machine code, on the Ethereum computer.
- There are two types of bytecode:
    1. **Creation time bytecode** - is executed only once at deployment, contains the ``constructor``
    2. **Run time bytecode** - is stored on the blockchain as permanent executable
#### Transaction Receipt
![Transaction Receipt](https://res.cloudinary.com/divzjiip8/image/upload/v1671079099/alchemyu/Screen_Shot_2022-12-14_at_8.37.41_PM.png)
- As in the script above, we provide the ABI to ethers.
    - Once ethers has the contract's ABI, we can make a call to the [``Counter``](https://goerli.etherscan.io/address/0x5F91eCd82b662D645b15Fd7D2e20E5e5701CCB7A#code) smart contract's ``inc()`` function.
    - Like the image above shows, the front-end library then translates and delivers any requests using the ABI.
    - Once the transaction is successfully sent and validated on the Ethereum network, a **receipt** is generated containing logs and any gas used.
#### Receipts Trie
- Anytime a transaction occurs on the Ethereum network, the receipt is stored in the receipt trie of that block. The trie contains four pieces of information:
    - Post-Transaction State
    - Cumulative Gas Used
    - Set of Logs Created During Execution (ie. did any **events** fire?)
    - Bloom Filter Composed from the Logs
#### Conclusion
![Conclusion](https://res.cloudinary.com/divzjiip8/image/upload/v1671078706/alchemyu/Screen_Shot_2022-12-14_at_8.31.19_PM.png)
- As you can see in the diagram above, if you want to interact with the Ethereum computer in one of a few ways, you must have some important artifacts with you.
- If you are writing contracts TO Ethereum (ie. deploying), the contract compilation produces what you need: the contract's bytecode.
- If you are reading contracts FROM Ethereum, the contract compilation produces what you need here as well: the contract's ABI.

## Intor to Hardhat
### Hardhat
![Hardhat](https://hardhat.org/card.jpg)
#### Intro
- You might be wondering, what the heck is Hardhat!?
    - We'll define that shortly, but the important concept to know is that we've made it to the most powerful Ethereum smart contract development tool. 🔨
- We started at the low-level and have slowly moved our way up to the high-level.
    - This is the flow the AU Ethereum Developer Bootcamp has taken:
        1. Blockchain and Cryptography Fundamentals
        1. Blockchain Account Tracking and Blockchain Storage
        1. Ethereum Introduction and Using JSON-RPC to Read, Signed JSON-RPC to Write, Ethers.js & Alchemy SDK for Higher Developer Abstraction
        1. Solidity Syntax, Smart Contracts and Hardhat (we are here!!)
- Hardhat is an extremely powerful tool for any developer in web3. Let's dive in...
#### What is [Hardhat](https://hardhat.org/)?
- [Hardhat](https://hardhat.org/) is a development environment to compile, deploy, test, and debug Ethereum smart contracts.
#### Why Hardhat?
- It helps developers manage and automate the recurring tasks that are inherent to the process of building smart contracts and dApps, as well as easily introducing more functionality around this workflow
- Hardhat Features
- Hardhat facilitates common development flows for smart contracts with the following features:
    - Local testing, including local Hardhat Network (super useful!!)
    - Solidity compilation and error-checking
    - Flexible combination with other tooling/plugins (ie, Ethers.js)
    - Easy deployment of and interaction with smart contracts
- Hardhat Project Structure
- When you initialize a Hardhat project in your local environment, the structure includes the following important files/folders:
    1.``**/scripts**``: .js files for running scripts
    1. ``**/artifacts**``: artifacts produced out of the contract compilation
    1. ``**/test**``: .js files for using testing libraries
    1. ``**hardhat.config.js**``: file with project configurations (very important!!!!)
- Important Hardhat Concepts
- The ``hardhat.config.js`` file is the most important file in your project!
> ⚠️ If you have a bug/issue, this is first file to look at! 👀
- Also, when you compile a contract, its artifacts (the ABI and bytecode) will be stored in a newly created ``/artifacts`` folder
#### AU Suggested Hardhat Flow
- Want to get up and running with a Hardhat project? 🏇 Just follow this flow:
    1. Open a terminal
    1. Run ``cd Desktop``, then create a new folder via ``mkdir au-hardhat-practice``, then move into that newly-created folder by running ``cd au-hardhat-practice``
    1. Once you are in the ``au-hardhat-practice`` folder, in your terminal run ``npm init -y`` to initialize a ``package.json``
    1. Run ``npm i hardhat``
    1. Run ``npm i dotenv``
    1. Run ``touch .env`` in order to create a ``.env`` file at the root-level of your project, then populate it with important data and save
    1. Run ``npx hardhat`` which will initialize a brand new Hardhat project
    1. We recommend the following flow: Choose the current root > ``YES`` to the ``.gitignore`` > ``YES`` to install the sample project's dependencies
    1. Add ``require(‘dotenv’).config()`` at the top of your ``hardhat.config.js`` file
    1. Add ``networks`` flag to ``hardhat.config.js``, add your Alchemy RPC URL under ``url`` and your testnet private key under ``accounts``
    1. Set up your scripts and contracts, then deploy in a flash! ⚡️
#### Conclusion
- Hardhat is one of the ultimate web3 developer tools.
    - It is specifically built to cover the entire smart contract developer flow end-to-end.
        - Master it, and thou shalt become a Web3 Master. 🧙‍♂

---
## Activity: Deploy a Contract with Ethers.js + Hardhat
---
- In this activity, we'll run through deploying a contract to the Göerli test network.
    - We will deploy a live ether faucet on Göerli - you can choose to deploy any contract you'd like or customize the one below however you like!
- It's great to get some practice in with leading web3 development like Hardhat, let's jump in!
> These activities are meant to teach you how to work more on your local. Setting up a local development environment is something that becomes extremely easy with a lot of practice!
### Activity Requirements
- [Apex](https://apexwallet.xyz/): Browser extension wallet that provides key storage and secure account log-in as well as acts as a JSON-RPC gateway.
- [Alchemy](https://www.alchemy.com/): Alchemy is a blockchain development platform from which we will use some APIs to help query the Ethereum blockchain.
- [Hardhat](https://hardhat.org/): Ethereum developer suite full of tools that make the developer experience more efficient.

#### Setup
#### 1. Acquire Göerli ETH
- You can get some testnet ether at https://goerlifaucet.com/

#### Instructions
#### 1. Create Project Structure
1. Open up a generic terminal
1. In your preferred root folder, run ``mkdir au-deployContract && cd au-deployContract``
1. run ``npm init -y``
1. run ``npm install --save-dev hardhat``
1. run ``npm install @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers dotenv``

- As review, the above commands do the following:
    - ``npm init -y``: sets up an empty package.json
    - ``npm install ethers``: installs the ethers.js library
    - ``npm install dotenv``: installs a package that allows us to use sensitive data as environment variables in our project
    - ``npm install hardhat``: plugs in the ``hre`` global access to our project so that we can use Hardhat features throughout it
> If you see a bunch of warnings like npm WARN deprecated appear on your terminal when you are installing dependencies, don't worry about them! They are a common part of npm installs and there is little you can do about them.
#### 2. Add files, .env and run npx hardhat
1. Run ``touch .env`` (this creates a brand new ``.env`` file in your current directory), then open in and add in your **Göerli** private key as a variable
1. **This time, also add your Alchemy ``GOERLI_URL`` as a variable in your ``.env`` file!**
1. Save and close the file
1. Run ``npx hardhat``
1. Select ``Create a JavaScript project`` and select ``y`` to everything!
1. This is labelled below, but remember to add ``require('dotenv').config()`` to the top of your ``hardhat.config.js`` file!
> This will get you set up with all of the hardhat dependencies that you might need! 🏗🦺
![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671125715/alchemyu/Screen_Shot_2022-12-15_at_9.34.39_AM.png)
- You'll now have a basic project structure set up with a contracts and scripts folder and some sample files in them, just like above.
    - Go ahead and delete only the files in them, we won't be needing them - but we do need the folders, so keep those!
- Ok, now that we've got a basic Hardhat project structure set up, let's start implementing a contract and a deployment script! 💥
#### 3. Edit hardhat.config.js
- In the ``hardhat.config.js`` that Hardhat set up for us, we'll want to make some modifications - for now, just delete everything in it and copy-paste the following:
    ```javascript
    require("@nomiclabs/hardhat-waffle");
    require("dotenv").config();

    module.exports = {
    solidity: "0.8.4",
    networks: {
        goerli: {
        url: process.env.GOERLI_URL,
        accounts: [process.env.PRIVATE_KEY]
        },
    }
    };
    ```
    - We are setting a compiler version and enabling hardhat to run commands to the Göerli network!
#### 4. Add A Smart Contract File
- We'll be deploying a generic faucet contract on Göerli - anyone will be able to send and withdraw some ether, just like the typical faucets we use to acquire Göerli. 🚰
    1. cd into your contracts folder and run touch Faucet.sol
    1. Open the Faucet.sol file and copy-paste the following contents:
        ```solidity
        //SPDX-License-Identifier: Unlicense
        pragma solidity ^0.8.0;

        contract Faucet {

        function withdraw(uint _amount) public {
            // users can only withdraw .1 ETH at a time, feel free to change this!
            require(_amount <= 100000000000000000);
            payable(msg.sender).transfer(_amount);
        }

        // fallback function
        receive() external payable {}
        }
        ```
    1. Save the file!
- The Faucet contract is quite simple; it allows anyone to call the withdraw method and specify an amount lower than .1 ETH at a time.
    - The receive fallback function will handle any ETH deposited into the Faucet and add it to the contract balance.
#### 5. Add Scripts
- Now, we need to create a script that will run the methods provided by ethers.js in order to deploy Faucet.sol to the Göerli test network.
- We will need one script:
    - deployment script
- We don't need a whole deployment script anymore! Hardhat does all this work for us now!
    1. In your ``scripts`` directory, run ``touch deploy.js``
    1. Open the newly-created file and copy-paste the following:
    ```js
    const ethers = require('ethers');
    require('dotenv').config();

    async function main() {

    const url = process.env.GOERLI_URL;

    let artifacts = await hre.artifacts.readArtifact("Faucet");

    const provider = new ethers.providers.JsonRpcProvider(url);

    let privateKey = process.env.PRIVATE_KEY;

    let wallet = new ethers.Wallet(privateKey, provider);

    // Create an instance of a Faucet Factory
    let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

    let faucet = await factory.deploy();

    console.log("Faucet address:", faucet.address);

    await faucet.deployed();
    }

    main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
    ```
>  Remember, we are using our Alchemy key as always - but imported from our .env file using process.env
#### 6. Deploy Your Faucet!
- **All systems are go! We should now be ready to run the final commands in order to deploy our own faucet to Göerli.**
- First, compile the ``Faucet.sol`` with Hardhat so that all the necessary artifacts are created...
    1. Run npx hardhat compile
        -You should now see an artifacts folder pop up in your project directory - search through it to spot your contracts abi and bytecode!
    1. To deploy, run npx hardhat run scripts/deploy.js --network goerli
        - Notice we used the --network flag above? This is where our changes in hardhat.config.js come in, we are telling Hardhat to run this command in our predefined network which is Göerli.
    1. You should now see your newly-deployed contract address as terminal output - nice!
    1. Copy-paste that address into https://goerli.etherscan.io/ and check out your contract in live deployment form!
- Can you think of any extra features to add to your faucet?
    - How about some sort of way of keeping track of user addresses that have already used it?
    - Or using timestamps to limit mass withdrawals all at once?
- Did you notice Hardhat make things easier for us as developers? Or maybe harder?

---

## Hardhat Quick Guide: Modifying State Variables

---

- In this guide, we will set up a simple Hardhat project structure, add a contract with a state variable and a function to modify it.
    - We will then write a quick test to make sure the function modifies the state variable as expected - let's get to it!
> Hardhat is one of the ultimate web3 development tools. 🔥 We are creating guides like this in order for you to get some practice using it! Master Hardhat, master web3 development!

#### Step 1: Set Up Project Structure Using Hardhat
1. In a folder of your choice, run ``mkdir modify-contract-state && cd modify-contract-state``
1. Run ``npm init -y``
1. Run ``npm install --save-dev hardhat``
1. Run ``npm install @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers``
1. Run ``npx hardhat`` to initiate the Hardhat development environment - it will bring up some yes/no options, use the arrow keys to toggle the options and select ``Create an empty hardhat.config.js``
![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671126973/alchemyu/Screen_Shot_2022-12-14_at_9.29.17_PM.png)
1. Your project directory should now contain the following: ``node modules``, ``package.json``, ``package-lock.json`` and the empty ``hardhat.config.js`` you just created - rolling on!
1. Open your project's ``hardhat.config.js``, delete all of its contents and copy-paste the following:
    ```solidity
    require("@nomiclabs/hardhat-ethers");

    module.exports = {
    solidity: "0.8.4",
    };
    ```
- **Make sure that the solidity compiler version in your project's ``hardhat-config.js`` is set to ``0.8.4`` so that it matches that of the following contract!**
![image](https://i.imgur.com/L6tSo8C.png)
#### Step 2: Create Smart Contract
1. From your project root directory, run ``mkdir contracts && cd contracts``
1. Run ``touch ModifyVariable.sol`` (creates a new file called ``ModifyVariable.sol`` in the current directory) and open the newly-created contract file
1. Copy-paste the following:
    ```solidity
    //SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    contract ModifyVariable {
        uint public x;

        constructor(uint _x) {
            x = _x;
        }

        function modifyToLeet() public {
            x = 1337;
        }

    }
    ```
    - We've implemented a very simple smart contract that contains one state variable ``x`` and a function ``modifyToLeet`` that, when called, changes the state of the variable to be ``1337``.
1. Go ahead and save your contract - feel free to add more functions!

#### Step 3: Create Test
1. Make sure to go back to your project root directory by running ``cd`` back from the ``contracts`` directory
1. In your project root, run ``mkdir test`` to create a new ``/test`` directory that will contain all your testing files!
1. In the ``/test`` directory, create a file called ``sample-test.js`` and copy-paste the following into it:
    ```js
    // import testing libraries: https://www.chaijs.com/guide/styles/
    const { expect, assert } = require("chai");

    // the `describe` scope encapsulates an entire test called `TestModifyVariable`
    // the `it` says the behavior that should be expected from the test
    describe("TestModifyVariable", function () {
        it("should change x to 1337", async function () {
            // this line creates an ethers ContractFactory abstraction: https://docs.ethers.org/v5/api/contract/contract-factory/
            const ModifyVariable = await ethers.getContractFactory("ModifyVariable");

            // we then use the ContractFactory object to deploy an instance of the contract
            const contract = await ModifyVariable.deploy(10);

            // wait for contract to be deployed and validated!
            await contract.deployed();

            // modify x from 10 to 1337 via this function!
            await contract.modifyToLeet();
            // getter for state variable x
            const newX = await contract.x();
            assert.equal(newX.toNumber(), 1337);
        });
    });
    ```
    - This test, when executed, will deploy a contract instance contract and set x (that instance's state variable) to 10.
        - It then calls the modifyToLeet() function on the instance which prompts a change to the state variable to 1337 and then uses assert.equal() to verify the change was successful.
1. Go ahead and save the file - feel free to play around with the values and add more tests!

#### Step 4: Run the Test
1. In your **project root folder**, run ``npx hardhat test``
> If you are still in /test in your terminal, just type in cd .. and that will push your directory one back! :)
1. Your terminal output should look something like this:
![image](https://i.imgur.com/GS8PwYe.png)
- You have successfully set up a whole project structure! With the help of Hardhat, you were able to test whether your functions modifying your smart contract's state variables were actually modified - nice job!
#### Extra Challenges:
- Create a new type ``string`` state variable and modify it
- Change the constructor argument
- Add a new test
- Create a ``scripts`` directory, deploy your contract and change the contract state

---

## Address Interactions

---

### Calling EOAs
- Let's talk about how to use addresses in Solidity!
- First off, a bit of review.
- What are the two types of accounts in Solidity?
    1. **Externally Owned Accounts** - All transactions originate from an EOA, they are controlled by a private key which signs off on the transaction.
    1. **Smart Contract** - This is code deployed to the blockchain. It is programmed to respond to different inputs sent by EOAs or other contracts.
- OK, great! Let's focus on calling EOAs first.

#### EOAs in a Smart Contract
- Let's imagine we have two authors of a smart contract:
    ```solidity
    contract SpecialNumber {
        address author1;
        address author2;
    }
    ```
- What's something we can do with EOAs?
    - We can pay them! Let's do that.
    - Any time this contract receives ether, let's send half to author1 and half to author2.
    ```solidity
    contract SpecialNumber {
        address author1;
        address author2;

        receive() external payable {
            // msg.value is passed to this contract
            uint totalValue = msg.value;

            // make a call to author1 sending half of the ether
            (bool success1, ) = author1.call{ value: totalValue / 2 }("");
            require(success1);

            // make a call to author2 sending half of the ether
            (bool success2, ) = author2.call{ value: totalValue / 2 }("");
            require(success2);
        }
    }
    ```
- A [payable function](https://docs.alchemy.com/docs/solidity-payable-functions) is one that can receive ether.
    - The ``receive`` function is a special function that will be invoked when a smart contract receives ether.
    - We'll touch on this further later on.
- Let's take a look at that call syntax, specifically:
    ```solidity
    (bool success1, ) = author1.call{ value: totalValue / 2 }("");
    require(success1);
    ```
- What is happening in these two lines? Let's break this syntax up into four parts:
1. The ``.call`` method
1. The curly brace ``{}`` syntax
1. The empty string argument passed in ``("")``
1. The return value ``(bool success1, )``

#### Call
- First let's talk about call.
    - The call method is something you'll find on every address type when you want to send input data or ether to an address.
    - When you do this, you'll be making something called a message call.
    - You'll often hear this terminology used to describe a call to a smart contract.
    - We differentiate this from a transaction, which is object signed by the EOA sent to the blockchain.
>  In Solidity you'll have access to two relevant globals: ``msg`` which refers to the **message** describe above and ``tx`` which refers to the original transaction sent by the EOA. You can see this **msg** being used in the ``receive`` function above to get the total ether value passed in, specifically the ether amount is the ``msg.value``.

#### Curly Braces
- The curly braces which comes after call ``{}`` provides an opportunity to override the ``value`` and ``gas`` parameters on the message call.
    - The ``gas`` parameter will be relevant when we start calling smart contract addresses.
    - When you leave it unspecified it will forward along all the gas remaining that the transaction sender designated (through the gasLimit parameter on the front-end, remember?).

#### The Empty String Argument
- You can see where passing in an empty string here.
    - If you were trying to target a function on a smart contract this is where your calldata would go.
    - The calldata will specify the function you're trying to call as well as the arguments you are sending.
    - In this case, we're just trying to send ether to an EOA, so we pass an ``""`` to indicate there is no calldata.

#### Return Value
- The (bool success1, ) part probably looks a bit confusing! Remember how in the previous lesson we wrote a contract that can return multiple values?
    - The call method returns multiple values.
    - Solidity will warn you if you don't use the first value returned, which indicates if the message call was successful or not.
    - In most cases, we will want the transaction to fail if a message call fails.
    - The code require(success1) will do just that. We'll take about require further very shortly!

### Reverting Transactions
- What does it mean to **revert** a transaction?
- At the lowest level, ``REVERT`` is an opcode in the Ethereum Virtual Machine.
    - This means it's a native feature of the VM which we can use through some of the Solidity keywords ``revert``, ``require`` and ``assert``.
- Let's first talk about what it means to revert a transaction.
    - When you revert a transaction, you essentially make it like the transaction never happened.
    - You halt the execution of the transaction and you remove all state changes.
    - The transaction can still be included in a block, and when it is, the transaction sender will still have to pay for the gas used.
>  Technically, **message calls** can be reverted and caught in the contract making the message call (the ``msg.sender``). You won't see this used too often, but this is what ``try``/``catch`` is for in Solidity (see the [docs here](https://docs.soliditylang.org/en/v0.8.17/control-structures.html?highlight=try%20catch#try-catch)).
#### Real World Example
- Let's take a look at a recently reverted transaction here:
    - [0x6def53bf56c2eb9dc08c6b87eeaadf90c46c0f4a57aab5ce9ca1481e7ff690d5](https://etherscan.io/tx/0x6def53bf56c2eb9dc08c6b87eeaadf90c46c0f4a57aab5ce9ca1481e7ff690d5)
    - If you look at the error message, it is an error that is coming from Uniswap saying ``UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT'``.
        - Often times, when interacting with a decentralized exchange like Uniswap, the conditions will change between when the EOA signs the transaction and when the transaction is included in the block.
        - It's perfectly possible that when the EOA signed this transaction, the conditions of the market would have allowed for this transaction to happen, however at the time when it was included in the block it failed one of Uniswap's checks.
    - You'll notice that there still was an associated gas fee, since this transaction did run in an Ethereum block up until that point of the revert.
        - Since this transaction reverted, the state changes did not go through and no token balances were updated for the user.

### Calling Contract Addresses
- Okay, so we have taken a look at sending ether to externally owned accounts through the call method. What's next?
- Now it's time to send data to smart contracts using the call method.
    - Let's take a look at what this looks like:
    ```solidity
    import "hardhat/console.sol";

    contract A {
        function setValueOnB(address b) external {
            (bool s, ) = b.call(abi.encodeWithSignature("storeValue(uint256)", 22));
            require(s);
        }
    }

    contract B {
        uint x;

        function storeValue(uint256 _x) external {
            x = _x;
            console.log(x); // 22
        }
    }
    ```
    - In the above case we're going to call the contract B with calldata that we manually encoded ourselves with ``abi.encodeWithSignature``.
        - This will create calldata in the same format as the data field we encoded in the transaction through ethers.js.
- This method can be extremely useful when we need to manually encode calldata like this, however it's not always necessary!
    - In this example we could have just used the definition of the contract B to make much cleaner. Let's take a look at an example below:
    ```solidity
    import "hardhat/console.sol";

    contract A {
        function setValueOnB(address b) external {
            B(b).storeValue(22);
        }
    }

    contract B {
        uint x;

        function storeValue(uint256 _x) external {
            x = _x;
            console.log(x); // 22
        }
    }
    ```
- Please compare these first two examples.
    - It's important to recognize that they're doing the same thing!
    - Underneath the hood we are making a message call from contract A to contract B passing along calldata to target the storeValue function.
    - In the case of this second example, all of that is done for us by using the contract definition of B so Solidity knows how to encode the calldata for us! Super helpful.
- Ok here's the last example, and then we'll get to coding!
    - What if you didn't have access to the contract B definition in the previous example?
    - In that case you could use something called an interface.
    - Let's see what that would look like:
    ```solidity
    interface B {
        function storeValue(uint256) external;
    }

    contract A {
        function setValueOnB(address b) external {
            B(b).storeValue(22);
        }
    }
    ```
    - From contract A's perspective, this code functions the exact same way as before.
        - For the definition of an interface, we only need to give Solidity enough information to figure out how to encode the calldata to call the address b.
        - From contract A's perspective, we don't need the full method definition of storeValue, we simply need to describe how we'd like to interface with contract B. Make sense?

---

## Hardhat Guide: How to Unit Test a Smart Contract

---
- In this guide, we'll cover the fundamentals of using [Hardhat](https://hardhat.org/) to unit test a Solidity smart contract.
    - Testing is one of the most important parts of smart contract development, so let's jump right in! 🦅
- We will be setting up some simple tests on a Faucet.sol smart contract while covering some of the different aspects of Solidity testing using JavaScript.


#### Guide Requirements
- [Hardhat](https://hardhat.org/): Hardhat is an Ethereum development platform that provides all the tools needed to build, debug and deploy smart contracts.

#### Useful JS + Solidity Testing Resources
- We will use these resources throughout this guide but bookmark these for any other testing you do!
    - [ChaiJS](https://www.chaijs.com/)
    - [Chai BDD Styled](https://www.chaijs.com/api/bdd/)
    - [Chai Assert](https://www.chaijs.com/api/assert/)
    - [Mocha Hooks](https://mochajs.org/#hooks)
    - [Solidity Chai Matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)

#### Step 1: Hardhat Project Structure Setup
1. In a directory of your choice, run ``npm init -y``
1. Run ``npm install --save-dev hardhat``
1. Run ``npx hardhat`` and you will get the following UI on your terminal:
    ![Hardhat UI](https://res.cloudinary.com/divzjiip8/image/upload/v1671126973/alchemyu/Screen_Shot_2022-12-14_at_9.29.17_PM.png)
1. Select Create a JavaScript project
    - You will then get a few more options such as if you want to create a .gitignore and install some dependencies like in the following image:
    ![Hardhat UI](https://res.cloudinary.com/divzjiip8/image/upload/v1671652663/alchemyu/Screen_Shot_2022-12-21_at_11.57.35_AM.png)
1. **Select YES to all of these options!**
> It might take a minute or two to install everything!
- Your project should now contain the following:
    - **Files**: ``node_modules``, ``package.json``, ``hardhat.config.js``, ``package-lock.json``, ``README.md``
    - **Folders**: ``scripts``, ``contracts``, ``test``
#### Step 2: Add a Faucet.sol Contract File
1. In your ``/contracts`` directory, go ahead and delete the ``Lock.sol`` that Hardhat includes for you by default
> You can do this by running rm -rf Lock.sol in your terminal or just delete it manually via your IDE
2. Run touch Faucet.sol
3. Open the file and copy-paste the following:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity 0.8.17;

    contract Faucet {
        address payable public owner;

        constructor() payable {
            owner = payable(msg.sender);
        }

        function withdraw(uint _amount) payable public {
            // users can only withdraw .1 ETH at a time, feel free to change this!
            require(_amount <= 100000000000000000);
            (bool sent, ) = payable(msg.sender).call{value: _amount}("");
            require(sent, "Failed to send Ether");
        }

        function withdrawAll() onlyOwner public {
            (bool sent, ) = owner.call{value: address(this).balance}("");
            require(sent, "Failed to send Ether");
        }

        function destroyFaucet() onlyOwner public {
            selfdestruct(owner);
        }

        modifier onlyOwner() {
            require(msg.sender == owner);
            _;
        }
    }
    ```
1. Save the file. 💾
1. Check out / audit the contract! 👀 ⬇️
1. **Start thinking about what we could possibly test for!** 🤔 Lots of things right? Let's list out a few:
- **A lot of the logic in the contract depends on the owner being set correctly in the constructor, so we'll want to test that.**
- **We don't want someone instantly draining all of our funds, so we should check that the ``require`` clause in the ``withdraw()`` function works as expected**
- **The ``destroyFaucet()`` function should only be called by the owner, as should the ``withdrawAll`` function.**
- Let's set up some unit tests to test that all of these assumptions are correct!

#### Step 3: Add Test File Structure
- We will build out our unit tests for our ``Faucet.sol``.
    - As we build out the test script, we will cover some of the important parts of Solidity testing.
1. In your ``/test`` folder, rename the sample file included by Hardhat either from ``Lock.js`` to ``faucetTests.js``
1. You are welcome to create your own test file in this folder from scratch. Hardhat already gives us a pre-written scaffold in ``Lock.js`` so better to take advantage of that and just re-name the sample file
1. Woah, this sample file has a TON of stuff! 🤯 Those are just tests relevant to the sample ``Lock.js`` file included by Hardhat, let's clean the file and repurpose for the ``Faucet.sol`` contract
1. Open the ``faucetTests.js`` file and copy-paste the following:
    ```solidity
    const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
    const { expect } = require('chai');

    describe('Faucet', function () {
        // We define a fixture to reuse the same setup in every test.
        // We use loadFixture to run this setup once, snapshot that state,
        // and reset Hardhat Network to that snapshot in every test.
        async function deployContractAndSetVariables() {
            const Faucet = await ethers.getContractFactory('Faucet');
            const faucet = await Faucet.deploy();

            const [owner] = await ethers.getSigners();

            console.log('Signer 1 address: ', owner.address);
            return { faucet, owner };
        }

        it('should deploy and set the owner correctly', async function () {
            const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

            expect(await faucet.owner()).to.equal(owner.address);
        });
    });
    ```
    - Let's first define some of these newer terms like ``describe`` and ``it``... 📖
    - In the code above, we open a ``describe`` function called ``Faucet``. The best way to think of this is just a general function scope that "describes" the suite of test cases enumerated by the "it" functions inside.
    - Inside that ``describe``, we have an ``it`` function. These are your specific unit test targets... just sound it out!: "I want ``it`` to x.", "I want ``it`` to y.", etc.
    - Inside the ``it`` function, we use the ``loadFixture`` functionality we imported in the first line to help bring all the variables we need for each test easily.
    - Inside the ``deployContractAndSetVariables`` function, we use the ``contractFactory`` abstraction provided to us by Ethers.
    - [From the Hardhat testing docs](https://hardhat.org/tutorial/testing-contracts): A ``ContractFactory`` in ethers.js is an abstraction used to deploy new smart contracts, so Faucet here is a factory for instances of our faucet contract.
    - We then ``await`` for the ``faucet`` instance we created from our ``ContractFactory`` to be deployed. This is our basic setup - after all these lines, we now have a deployed contract instance with which we can test! We then return them via ``loadFixture`` so that we can use them super easily via:
        ```solidity
        const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
        ```
    - **The code is ready to test as soon as you save it**. It includes just one simple unit test checking that ``owner`` is set correctly at contract deployment. ✅ It is basically testing the following line in the ``Faucet.sol`` constructor:
        ```solidity
        owner = payable(msg.sender);
        ```
4. Run ``npx hardhat test`` in your terminal - if you successfully set up all of the above, you should see:
    ![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671655084/alchemyu/Screen_Shot_2022-12-21_at_12.36.48_PM.png)
- We've successfully accounted for the first assumption we made above
- **A lot of the logic in the contract depends on the owner being set correctly in the constructor, so we'll want to test that**.

#### Step 4. Add Withdrawal Amount Test
- Let's continue working through each assumption we made above. Next one is:
    - **We don't want someone instantly draining all of our funds, so we should check that the ``require`` clause in the ``withdraw()`` function works as expected**
- Do you think you can do this by yourself? Take a moment and try to think how you would implement this test...
> Hint: It's basically adding a new it() block! 🧑‍💻
- Let's run through adding a new unit test for this assumption...
1. Add a new ``it`` function scope
> Pro-tip: just copy-paste the entire previous it function and replace the contents for the new test! No need to write out the whole syntax again. Like this:
    ![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671657165/alchemyu/Screen_Recording_2022-12-21_at_1.10.58_PM.gif)
2. As shown in the gif above, name it something that denotes we are testing the withdraw functionality of the contract
- For now, we want to test that we can't withdraw more than .1 ETH as denoted by the ``require`` statement in our contract's ``withdraw()`` function.
- **It's time to use expect! again**
- Since we want to use ``expect``, we'll need to import some special functionality more specific to Solidity. We will be using these [Solidity Chai Matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html).
> This import is already in the file!
3. ``ethereum-waffle`` should already be installed, but run ``npm install ethereum-waffle`` just in case
- Cool, we have the necessary imports and installations. 🧩
    - As opposed to the first unit test, we will the [**Revert** Chai Matcher](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#revert) to ``expect`` a transaction to revert. This is how we make sure we cover certain cases that we expect **should revert**.
4. Add the following variable to your ``deployContractAndSetVariables`` function:
    ```solidity
    let withdrawAmount = ethers.utils.parseUnits("1", "ether");
    ```
5. Remember to ``return`` it:
    ```solidity
    return { faucet, owner, withdrawAmount };
    ```
6. Add the following to your newly created ``it`` block:
    ```solidity
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
    ```
    - We are creating ``withdrawAmount`` variable equal to 1 ether, which is way over what the ``require`` statement in the ``withdraw()`` function allows; **so we expect it to revert!** 🚫
    - Go ahead and change the value to be less than .1 ETH and see the terminal get angry when you run ``npx hardhat test``... not reverting! 😱
5. Our test file should look like this so far:
    ```js
    const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
    const { expect } = require('chai');

    describe('Faucet', function () {
        // We define a fixture to reuse the same setup in every test.
        // We use loadFixture to run this setup once, snapshot that state,
        // and reset Hardhat Network to that snapshot in every test.
        async function deployContractAndSetVariables() {
            const Faucet = await ethers.getContractFactory('Faucet');
            const faucet = await Faucet.deploy();

            const [owner] = await ethers.getSigners();

            let withdrawAmount = ethers.utils.parseUnits('1', 'ether');

            return { faucet, owner, withdrawAmount };
        }

        it('should deploy and set the owner correctly', async function () {
            const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

            expect(await faucet.owner()).to.equal(owner.address);
        });

        it('should not allow withdrawals above .1 ETH at a time', async function () {
            const { faucet, withdrawAmount } = await loadFixture(
            deployContractAndSetVariables
            );
            await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
        });
    });
    ```
    - Run ``npx hardhat test``, do your tests pass? 🤨 If so, heck yeahhhhh! 🎉

#### Step 5 - Challenge: Add Critical Function Tests ☢️
- We have just one more initial assumption to test:
    - **The destroyFaucet() function should only be called by the contract owner, as should the withdrawAll function.**
- This last one shouldn't be too bad to test! We just need to make sure the **onlyOwner** modifier is working, similar to the first test.
    - These are some of the most important (in fact, critical!!) functions in our contract so we want to make sure they are indeed only callable by the owner.
- As a challenge, implement these tests! Some good corner cases to test with these two functions:
    - can only the owner call them?
    - does the contract actually self destruct when the ``destroyFaucet()`` is called? (this one is tricky! hint: [``getCode``](https://docs.ethers.io/v5/single-page/#/v5/api/providers/provider/-%23-Provider-getCode))
    - does the ``withdrawAll()`` function successfully return all of the ether held in the smart contract to the caller?
- Use the same testing flow outlined above for efficiency! Here is the suggested flow:
    1. Just copy-paste a current ``it`` block
    1. Replace with whatever new functionality you need specific to your new testing assumption
    1. Remember to update any necessary variables in the ``deployContractAndSetVariables`` function and ``return`` them
    1. Import the variables into your ``it`` block via:
        ```js
        const { faucet, owner, anyVariable } = await loadFixture(deployContractAndSetVariables);
        ```
- There are many more cases that you can test for to create really iron-clad and comprehensive unit tests - and thus create iron-clad smart contracts! 💪 The testing rabbit hole is particularly great for anyone looking to get a solid foundation in smart contract security, lots of testing there for sure! Good luck, smart contract tester! 🫡