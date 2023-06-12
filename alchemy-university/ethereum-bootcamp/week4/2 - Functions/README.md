## Functions

---
### Table of Conents
1. [Solidity Functions](#solidity-functions)
1. [Arguments](#arguments)
    - [Solidity Arguments](#solidity-arguments)
    - [Variable Shadowing](#variable-shadowing)
    - [JavaScript](#javascript)
    - [Solidity](#solidity)
    - [Your Goal: Unsigned Int Constructor](#your-goal-unsigned-int-constructor)
1. [Increment](#increment)
    - [Contract Functions](#contract-functions)
    - [Transactions](#transactions)
    - [Queries](#queries)
    - [Your Goal: Increment x](#your-goal-increment-x)
1. [View Addition](#view-addition)
    - [Returning Values](#returning-values)
    - [Returning Values](#returning-values-1)
    - [What about Transactions?](#what-about-transactions)
    - [Your Goal: Add Uint](#your-goal-add-uint)
1. [Pure Double](#pure-double)
    - [Pure Functions](#pure-functions)
    - [Your Goal: Double Uint](#your-goal-double-uint)
1. [Double Overload](#double-overload)
    - [Overloading Functions](#overloading-functions)
    - [Your Goal: Overload Double](#your-goal-overload-double)
---

### Solidity Functions
- We've learned about how to store values inside of our smart contracts. 
    - Now it's time to learn how to read and modify those values! 
    - We accomplish this by adding functions to our contract code.
- Technically we already created functions in the previous lesson on **data types**! 
    - By setting our state variables to **public**, the compiler was creating a getter function under the hood:
    ```Solidity
    contract Contract {
        uint public x = 3;
    }
    ```
    - We can query the value in ``x`` externally using a generated function called ``x()``.
    - What if we wanted to modify ``x``? 
    ```Solidity
    contract Contract {
        uint public x = 3;

        function changeX() external {
            x = 5;
        }
    }
    ```

### Arguments
#### Solidity Arguments
- The first function we'll talk about is the **constructor**:
    ```Solidity
    bool public isOpen;

    constructor() {
        isOpen = true;
    }
    ```
    - Here we are setting the value of a state variable upon the contract's deployment.
- The **constructor** for Solidity contracts is quite similar to the constructor in classes of many object-oriented languages. 
    - The **constructor** function is invoked **only once** during the contract's deployment and never again. 
    - It is generally used for setting up initial contract values.
- What if we wanted to let the deployer of the contract decide the value of ``isOpen``? 
- We can **pass an argument** to our constructor! Let's see that in action:
    ```solidity
    bool public isOpen;

    constructor(bool _isOpen) {
        isOpen = _isOpen;
    }
    ```
    - Check it out! Now the contract deployer can decide the value of ``isOpen``.
> Notice how the parameter name (``_isOpen``) has an underscore in front of it? This prevents the variable from having the same name as the state variable. When the names collide it is referred to as ``variable shadowing``. It can happen in Solidity quite often since we can refer to state variables without using ``this``.

#### Variable Shadowing
- We're quite early in our Solidity lessons and we're already discussing Variable Shadowing. 
    - Yet this didn't come up in the JavaScript lessons. 
    - Was it still an issue? Let's think back.

#### JavaScript
- In JavaScript we talked about variable **scope**.
- For example we know that ``let`` scopes a variable a block ``{}``. 
    - If we tried to access that variable outside of the scope, we'd be out of luck!
- Let's see an example in JavaScript:
    ```js
    if(true) {
        let a = "Hello World!";
    }

    console.log(a); // ReferenceError: a is not defined
    ```
    - Here, the JavaScript engine will throw a **ReferenceError** because ``a`` is restricted to the block scope after the if statement.
- So that's an example of **variable scope**. 
    - What about **variable shadowing in JavaScript**? 
- Let's see another example:
    ```js
    let a = "Hello World";

    if(true) {
        let a = "Hello World 2";
        console.log(a); // Hello World 2
    }
    ```
-  Here is a case where the outer ``a`` is shadowed by the inner ``a`` variable. 
    - At the ``console.log`` line we don't have access to the outer ``a`` variable.
- Kind of a silly example, to be honest! 
    - Shadowing just doesn't come up that often in JavaScript naturally.
- Let's consider the ``class`` keyword:
    ```js
    class Food {
        constructor() {
            this.name = "pizza"; 
        }
        changeName(name) {
            // not shadowed! 
            this.name = name;
        }
    }
    ```
    - ``this`` is the **big difference**.
- In JavaScript we use the ``this`` keyword to refer to member variables within the class. 
    - Even if we use the same parameter name it won't shadow it since we need to preface our member variable with ``this``.

#### Solidity
- Now back to Solidity! 
    - In Solidity we are much more likely to see variable shadowing:
    ```solidity
    string public name;

    constructor(string name) {
        // name is shadowed!
    }
    ```
    - In this case the state variable ``name`` is shadowed by the parameter ``name``!
> The compiler will warn us when we do something like this. The compiler will say: "Warning: This declaration shadows an existing declaration." showing us both the shadowing variable and the existing declaration. Compiler warnings can be very helpful for debugging and avoiding common mistakes.
- Technically there is a way around this:
    ```solidity
   contract MyContract {
        string public name;

        constructor(string name) {
            MyContract.name = name;
        }
    }
    ```
    - Now we're using the reference to ``MyContract`` to update the state variable. 
        - This is not the typical approach. 
        - In general you'll see the undescore parameter (i.e. ``_variableName``) over anything else.

#### Your Goal: Unsigned Int Constructor
1. Create a constructor which will take a ``uint`` as an argument.
1. Store this ``uint`` value inside a public state variable called ``x``.
---
**SOLUTIONS**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint public x;
    constructor(uint _x) {
        x = _x;
    }
}
```
---

### Increment
#### Contract Functions
- Besides the constructor, contracts can define other functions which can be invoked by **transactions** or as **queries**.
- The function syntax for Solidity looks quite familiar, coming from JavaScript! Let's see an example:
    ```solidity
    function myFunction() external {
        // do something!
    }
    ```
    - Without the external visibility specifier here, this could be JavaScript code! 
        - The Solidity function syntax looks much the same aside from the keywords defining the function.
> **External** visibility is quite similar to the **public** visibility for functions. External is better than public if you know that you are only calling the function externally (outside the EVM). Public visibility requires more gas because it can be called externally and internally, which complicates the assembly code.

#### Transactions
- **Transactions** originate from an Externally Owned Account. 
    - The purpose of a transaction is to modify some state on the blockchain. 
    - Transactions incur a cost depending on how much gas is used, which, of course, depends on the computation and storage usage. 
- We have been talking about transactions for quite some time now! 
    - Recall from the **JSON-RPC** and **Ethers.js** lessons, we were creating and broadcasting **signed transactions**. 
    - They were signed because they included the ``v``, ``r``, ``s`` components of a digital signature that correspond to a public address.
- Another important property included in every ethereum transaction is ``data``. 
    - For the transactions we made in ``JSON-RPC`` and ``Ethers.js`` lessons we were simply sending ether from one account to another. 
    - We weren't actually interacting with the EVM in any way. 
    - For that reason, ``data`` was left blank. 
    - For transactions that interact with the EVM we will fill in ``data`` to target specific functions and pass arguments to those functions.
- The important take-aways for transactions: they are **digitially signed**, **modify blockchain state** and **cost gas**.

#### Queries
- **Queries**, on the other hand, do **not incur any gas cost** as they **do not modify state** and will **only be run by the single node** responding to the query.
- We can explicitly define whether a function will modify state within the **Smart Contract itself**! 
    - When a function is marked as ``view`` or ``pure`` by Solidity it **cannot modify state**.
- We have already generated some ``view`` functions using ``public`` state variables:
    ```solidity
    contract Contract {
        uint public myNum;
    }
    ```
    - When using ``public`` on a state variable a **getter** is automatically created for us with a function of the same name.
- The ABI for this particular contract would be:
    ```json
    [
        {
            "inputs": [],
            "name": "myNum",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    ```
    - See that ``stateMutability`` is listed as ``"view"``? This ABI describes a public view function that returns a ``uint256`` called ``myNum``
- This would be roughly the same as creating our own getter function:
    ```solidity
    contract Contract {
        uint _myNum;
        
        function myNum() public view returns(uint) {
            return _myNum;
        }
    }
    ```
    - In fact, the ABI would be the same as the public state variable example!

#### Your Goal: Increment x
- Let's build on your code from the previous stage!
1. Create an external function called ``increment`` that will add ``1`` to the state variable ``x``.
> Many of the shorthand operators we've become accustomed to in languages like JavaScript will also available in Solidity: ``-=``, ``*=``, ``/=``, ``%=``, ``|=``, ``&=``, ``^=``, ``++`` and ``--``.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint public x;

    constructor(uint _x) {
        x = _x;
    }

    function increment() external {
        x++;
    }
}
```
---

### View Addition
#### Returning Values
- It's time to learn how to ``return`` values from Solidity functions!
> Returning values in Soldiity is only useful for internal functions and blockchain queries.
- Let's see an example:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity 0.7.5;

    contract Contract {
        bool _isRunning = true;

        function isRunning() external view returns(bool) {
            // return the state variable
            return _isRunning;
        }
    }
    ```
    - The ``isRunning()`` function indicates it is returning a boolean data type within the function signature: ``returns(bool)``.
        - Once declared, we can use the ``return`` keyword to return a boolean value within this function.
>  The ``returns`` declaration not only helps the compiler check for compile-time errors in our code, it also is how it generates the ABI. This helps external programs communicate with our Solidity contract!
- Adding the **view** keyword to the ``isRunning`` function signature guarantees it **will not modify** state variables. You can think of view functions as **read-only**; they can read the state of the contract but they cannot modify it.

#### Returning Values
- There are two cases where returning values are useful: queries and communicating between contract accounts.
- For queries, we can call a function directly over **JSON-RPC** with ``eth_call`` to get a direct response of the state of a smart contract.
- For contract communication, returning values can be crucial.
    - For instance, it may be necessary to return a boolean value indicating success.
    - Or as another example, a contract may need to know the most recent pricing information in a decentralized exchange.

#### What about Transactions?
- You may have noticed we did not include **transactions**.
    - This is because we don't know when or even if a transaction will be executed.
- When a **transaction** is broadcasted to Ethereum miners, the miners will add it to their local memory pool of transactions.
    - They can pick from this memory pool when they are creating a new block of transactions.
    - They will generally do so based on the ``gasPrice`` of the transaction.
    - Since the miner is rewarded with transaction fees, the higher the ``gasPrice``, the more incentive they have to include the transaction in the block.
- All this to say that transactions occur **asynchronously** in some unpredictable timeframe.
    - Conversely, the return value is ephemeral result of the EVM's computation and is not stored to the blockchain.
    - For looking up values after a transaction has occurred, there is a logging mechanism in the EVM which is available through Solidity ``events``.
    - We will cover events in a future lesson.

#### Your Goal: Add Uint
1. Create an external view function ``add`` which takes a ``uint`` parameter and returns the sum of the parameter plus the state variable ``x``.
> This function should **not modify state**. In fact, if it's labeled as a **view** it **cannot** modify state.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    uint public x;

    constructor(uint _x) {
        x = _x;
    }

    function increment() external {
        x++;
    }

    function add(uint num)
        external
        view
        returns(uint)
    {
        return x + num;
    }
}
```
---

### Pure Double
#### Pure Functions
- Occasionally there is the necessity for Solidity functions that neither read from nor write to state.
    - These functions can be labeled as ``pure``.
- Let's say we wanted to add together two ``uint`` values:
    ```solidity
    function double(uint x, uint y) external pure returns(uint) {
        return x + y;
    }
    ```
    - This function is just performing simple arithmetic without reading/writing state so we can label it **pure**.
> If we tried attempted to modify state in a pure function the compiler would throw an error along the lines of **"Function declared as pure, but this expression (potentially) modifies the state"**.
- There's also an alternative syntax for returning values in Solidity:
    ```solidity
    function double(uint x, uint y) external pure returns(uint sum) {
        sum = x + y;
    }
    ```
    - In the ``returns`` keyword we specified the name of the returned parameter ``sum``.
        - Then we assigned the ``x + y`` to ``sum`` inside our function body. The value of ``sum`` is implicitly returned.
>  A bit of a change-up from what we're used to from JavaScript! This return style is perfectly valid Solidity and quite often used

#### Your Goal: Double Uint
1. Create an external, pure function called ``double`` which takes a ``uint`` parameter and doubles it. It should return this doubled ``uint`` value.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    function double(uint x)
        external
        pure
        returns (uint doubled)
    {
        doubled = x*2;
    }
}
```
---

### Double Overload
#### Overloading Functions
- In Solidity it is perfectly valid to declare two functions with the same name if they have different parameters:
    ```solidity
    function add(uint x, uint y) external pure returns(uint) {
        return x + y;
    }
    function add(uint x, uint y, uint z) external pure returns(uint) {
        return x + y + z;
    }
    ```
    - Solidity will call the function signatures that matches the arguments provided.
    - For example, add(2,4) will invoke the first funciton while add(2,3,4) will invoke the second function.
- Also, Solidity can return multiple values from functions:
    ```solidity
    function addTwo(uint x, uint y) external pure returns(uint, uint) {
        return (x + 2, y + 2);
    }
    ```
    - Notice that the ``returns`` keyword specifies two return values.
        - Also we are wrapping the values in a parenthesis in order to return multiple values.
        - This is referred to as a **tuple**.
    > **Tuples** are not a formal type in Solidity. They are a list of values that can be used as a temporary structure to return values or do assignment destructuring. The data types in tuples can be mixed.
    - We can also use tuples in assignment destructuring. Let's invoke the function ``addTwo`` which we just defined above:
    ```solidity
    (uint x, uint y) = addTwo(4, 8);
    console.log(x); // 6
    console.log(y); // 10
    ```
#### Your Goal: Overload Double
1. Create another pure external/public function ``double`` which takes two ``uint`` parameters.
1. Double both of the arguments and return both of them in the same order they were passed into the function.
> For this solution, it is possible to use the ``double`` function from the previous stage in this solution. You may need to change the visibility from ``external`` to ``public`` so that you can call it internally as well.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {

    function double(uint x)
        public
        pure
        returns (uint doubled)
    {
        doubled = x*2;
    }

    function double(uint x, uint y)
        external
        pure
        returns (uint doubled, uint doubled2)
    {
        doubled = double(x);
        doubled2 = double(y);
    }
}

//OR

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    function double(uint x) external pure returns(uint sum){
        sum = x*2;
    }
    function double(uint x, uint y) external pure returns(uint,uint){
        return(x*2,y*2);
    }
}
```