## Data Types

---
### Table of Contents
1. [Basic Solidity Data Types](#basic-solidity-data-types)
1. [Booleans](#booleans)
    - [State Variables](#state-varaibles)
    - [ABI Validations](#abi-validations)
    - [Your Goal: Add two boolean variables](#your-goal-add-two-boolean-variables)
1. [Unsigned Integers](#unsigned-integers)
    - [Integer Overflow / Underflow](#integer-overflow--underflow)
    - [Your Goal: Create Unsigned Integers!](#your-goal-create-unsigned-integers)
1. [Signed Integers](#signed-integers)
    - [Your Goal: Create Signed Integers!](#your-goal-create-signed-integers)
1. [String Literals](#string-literals)
    - [Your Goal: Hello World](#your-goal-hello-world)
1. [Enum Type](#enum-type)
    - [Your Goal: Make Some Food!](#your-goal-make-some-food)
---

### Basic Solidity Data Types
- We'll use state variables to store them in the contract's persistent data storage:
    ```solidity
    contract Contract {
        bool public value = true;
        int public a = 10;
        string public msg = "Hello World";
    }
    ```
- Some of these variables should look familiar to you from JavaScript! There appears to be a boolean, a number and a string.
- In Solidity we're going to have to look at each of these data types in closer detail.
- Since Smart Contracts deal primarily with digital value, it's important to understand everything that is happening on a granular level. 
- Any mistake could have dire consequences! It's also important to do things efficiently since all storage and computation on the blockchain will cost money.

### Booleans
#### State Varaibles
- Let's get started by writing some state variables! 
    - State Variables are stored in the contract's persistent memory.
    - Modifying a state variable in one transaction will change its value for anyone who tries to read the variable afterwards.
- In Solidity, declaring a state variable is as simple as declaring the variable inside of the contract:
    ```solidity
    contract Contract {
        bool myVariable;
    }
    ```
    - The Contract now has a boolean state variable called myVariable! Sweet.
-  What is the value of myVariable at this point? 
- Data Types in Solidity have default values, for booleans it is false. 
    - So, after deploying this contract, myVariable would be false.
- Now we're going to do two things to our variable: make it public and give it an initial value of true:
    ```solidity
    contract Contract {
        bool public myVariable = true;
    }
    ```
- See how we added the keyword public here? This automatically creates a **getter** function for the variable.
- Now we can access the value in ``myVariable`` by calling a function on the contract with that very name: ``myVariable()``.

#### ABI Validations
- On some Solidity stages we'll provide a Validations tab. 
- This tab is intended to help you quickly debug issues with misspellings or unexpected data types.
- The validations use the Solidity ABI, which stands for Application Binary Interface. 
- This interface is an output from solidity compiler which provides information about the Smart Contract to an external observer.
- For example, the contract on the task tab:
    ```solidity
    contract Contract {
        bool public myVariable = true;
    }
    ```
    - This contract would have a pretty simple ABI. It would just tell us about the getter function generated for ``myVariable``.
    - Here is the ABI generated for this contract in JSON:
    ```json
    [
        {
            "inputs": [],
            "name": "myVariable",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    ```
        -  Essentially this tells us that there is a **function** called ``myVariable`` that expects **no inputs** and will return **one output**: a **bool**.
        - That's a pretty good description of the contract to an outside observer!
- For the **Goal** on the task tab you'll need to create two variables: ``a`` and ``b``. We're expecting your ABI will look like this:
    ```json
    [
        {
            "inputs": [],
            "name": "a",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "b",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    ```
- The ABI Validations tab will automatically compile your solidity contract and check to see if it matches what we expect. 
- This can help you diagnose compile-time issues quickly before you run the tests.

#### Your Goal: Add two boolean variables
1. Create two public boolean state variables on the contract: ``a`` and ``b``.
1. Store ``true`` in the variable ``a`` and ``false`` in the value ``b``.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    bool public a = true;
    bool public b = false;
}
```
---

### Unsigned Integers
- First, let's go over integers.
    - Integers include all positive and negative numbers without fractions.
    - The numbers ``-2``,``-1``,``0``,``1``,``2`` are all integers.
    - This range continues in both the positive and negative direction as far as you can count!
- To determine if the number is above or below zero we use the **sign**: ``+`` or ``-``. An **unsigned integer** is an integer that has **no sign**.
- Solidity has a specific data type for unsigned integers called ``uint``.
- A ``uint`` can be suffixed with the number of bits reserved for it.
    - For instance ``uint8`` means that there are **eight bits** provided for the value of the variable.
- What is the range of unsigned integers in **eight bits**?
    - Eight bits can range from 00000000 to 11111111.
    - This range can represent 256 unique values.
- Since the range of unsigned integer values does not include negative numbers, it is simply ``0`` to ``255``.
    - In decimal, the unsigned value of ``00000000`` is ``0`` and the value of ``11111111`` is ``255``.
> Wondering what happens if we add two uint8 values together whose sum will exceed 255? Let's take a look at this in details.

#### Integer Overflow / Underflow
- Before Solidity v0.8.4, our current compiler version, integer overflow was something you would need to beware of.
- It was possible to get a result that went over its allocated memory range and that could potentially cause unwanted behavior.
> This could happen when, for example, you would add two ``uint8`` values, whose range is ``0`` to ``255``, and the sum exceeds ``255`` - an overflow of the ``uint8`` data type's range.
- Now, with the recent v0.8.4 updates, any smart contract call that has integer overflow will revert (transaction will fail) and you will get a Runtime Exception.
>  In a very similar fashion, an integer could also **underflow** and flip to the top side of its range. But no need to worry about this too much now!

#### Your Goal: Create Unsigned Integers!
- Let's create three public state unsigned integers in our Contract: a, b, and sum.
1. Define the variable ``a`` as an ``uint8`` with an initial value between ``0`` and ``255``.
> If you declare the variable ``a`` as a ``uint8`` you will actually be unable to store a value outside the range ``0`` to ``255``. If you try this directly in your program, you'll get a comrpile-time error!
2. Define the variable ``b`` as an ``uint16`` with a value of at least ``256``. The range for a ``uint16`` is ``0`` to ``65535``.
1. The variable sum should be a ``uint256`` with the sum of the values stored in ``a`` and ``b``.


---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint8 public a = 255;
    uint16 public b = 6000;
    uint256 public sum = a + b;
}
```
---

### Signed Integers
- Now that we know what an **unsigned** integer is, let's take a look at a **signed** integer.
- A signed integer can be declared with the keyword ``int``. Just like ``uint``, the keyword ``int`` is short for a data type that will store 256 bits of memory, ``int256``.
- Since a integer is signed, the range covers **both negative and positive numbers**. Let's compare the range of a ``uint8`` to an ``int8``:
- ``uint8``: Ranges from ``0`` to ``255``
- ``int8``: Ranges from ``-128`` to ``127``
- Notice that both ranges cover a total of 256 values, which is the total number of possible values that can be expressed with 8 bits.

#### Your Goal: Create Signed Integers!
1. Create three public state integers ``a``, ``b``, and ``difference``.
2. Declare the variables ``a`` and ``b`` as ``int8``. One of the values must be **positive**, the other must be **negative**.
3. Declare the variable ``difference`` as a ``int16`` which is the **absolute** difference between ``a`` and ``b``.
> You can get the absolute difference simply by subtracting the negative number from the positive number. For instance, for the values ``10`` and ``-15``, the absolute difference would be ``25`` which is ``10`` ``-`` ``-15``.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    int8 public a = 8;
    int8 public b = -8;
    int16 public difference = a - b;
}
```
---

### String Literals
- We can create strings of characters using double quotes just like in JavaScript: the **string literal** ``"Hello World"`` is perfectly valid in Solidity.
> You'll often see fixed values described as a literal. The value "Hello World" can be described as a string literal which differentiates it from the string data type. Any fixed value could be a literal, "Hello World", 42, or true.
- A string literal can be stored in both the bytes and string types:
    ```solidity
    bytes msg1 = "Hello World";
    string msg2 = "Hello World";
    ```
-  For a **long** human-readable message it is recommended to use ``string`` since it will be easier to read the values from the blockchain storage from the outside (like for a front-end application).
- If the string is **shorter than 32 bytes**, it is more efficient to store it in a fixed-size byte array like ``bytes32``.
- This simplifies the computation since the memory is allocated ahead of time.
- On the other hand, both ``string`` and ``bytes`` will allocate their memory dynamically depending on the size of the string.
- How many characters can be stored in ``bytes32``?
- Well this is actually depends on the characters themselves!
- Many characters in UTF-8 encoding can be represented with 1 byte while others are represented with several bytes.
    - For instance ``c`` is encoded by ``0x63``, while ``ć`` is encoded by ``0xc487``.
- So the maximum values would be:
    ```solidity
    bytes32 msg1 = "cccccccccccccccccccccccccccccccc";
    bytes32 msg2 = "ćććććććććććććććć";
    ```
-  Adding a character to either string will result in a compile-time error since the string literal would no longer fit into 32 bytes.
> Quite often **long strings** are stored seperately on other distributed services like [IPFS](https://ipfs.io/), with a hash representation stored on the blockchain (since storage on a blockchain is expensive!). For example, you could write a legal document and hash the contents along with digital signatures to prove that it was signed. As long as the original document is preserved it can be easily proven that it was signed by rehashing the contents.

#### Your Goal: Hello World
- It's time to do **Hello World** in Solidity!
1. Create a ``public bytes32`` state variable ``msg1`` which stores a string literal containing "Hello World".
> Feel free to change the casing and add any other characters into ``msg1`` as long as it still contains the message "hello world"
2. Create a ``public string`` state variable ``msg2`` which stores a string literal that requires over 32 bytes to store.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	 bytes32 public msg1 = "Hello World";
	 string public msg2 = "Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello";
}
```
---

### Enum Type
- The Enum Type helps us write clean code!
- Consider this example:
    ```js
    if(player.movement == 0) {
    // player is moving up
    }
    else if(player.movement == 1) {
        // player is moving left
    }
    ```
-  Those comments are helpful, but they aren't exactly a **foolproof** plan! The ``movement`` number is being generated somewhere else in the code.
    - If that ever changed, it would break our code!
    - Plus, without the comments, there would be no way to tell which direction is which!
- An ``enum`` can clean this up! Let's see:
    ```js
    enum Directions = { Up, Left, Down, Right }
    if(player.movement == Directions.Up) {

    }
    else if(player.movement == Directions.Left) {

    }
    ```
- Not only are the numbers replaced with clear directions, we also have a structure for defining all our directions.
    - We can share this structure, Directions, with other contracts to ensure that if the numbers change they won't break the rest of the code!
> Underneath the hood, enum values are stored as unsigned integers. If there are less than 256 values, it will be stored as a ``uint8``. If you have more than 256 values it will use a ``uint16`` and will grow from there as needed (although I'm not sure how many contracts will ever need more than **65536** values in their enum...). The way this data is stored will become more important when we look to parse our smart contracts from the outside world through the ABI.

#### Your Goal: Make Some Food!
- In the enum provided you'll see there are four types of Foods!
- Take the values and store them in food1, food2, food3, and food4!
> Feel free to pick your own favorite foods and add them to the list and food values as well!

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    enum Foods { Apple, Pizza, Bagel, Banana }

	Foods public food1 = Foods.Apple;
	Foods public food2 = Foods.Pizza;
	Foods public food3 = Foods.Bagel;
	Foods public food4 = Foods.Banana;
}
```
---