### Solidity Arrays
- Working with arrays in Solidity can be tricky! 
- We'll need to understand the data location, or where the array is stored. 
- We'll also need to understand the memory allocation, whether it is fixed size or it can be dynamically resized. 
- Don't you worry! We'll bring these concepts to light in this coding tutorial. 

---
### Table of Contents
1. [Fixed Sum](#fixed-sum)
    - [Fixed Arrays](#fixed-arrays)
    - [Retrieve Elements](#retrieve-elements)
    - [For Loops](#for-loops)
    - [Data Location](#data-location)
    - [calldata](#calldata)
    - [memory](#memory)
    - [storage](#storage)
    - [Value vs Reference](#value-vs-reference)
    - [Further Reading](#further-reading)
    - [Your Goal: Find the Sum](#your-goal-find-the-sum)
1. [Dynamic Sum](#dynamic-sum)
    - [Dynamically Summed](#dynamically-summed)
    - [Your Goal: Sum Dynamic Array](#your-goal-sum-dynamic-array)
1. [Filter to Storage](#filter-to-storage)
    - [Storage Arrays](#storage-arrays)
    - [Your Goal: Filter Even Numbers](#your-goal-filter-even-numbers)
1. [Filter to Memory](#filter-to-memory)
    - [Memory Arrays](#memory-arrays)
    - [Filter Numbers over 5 in Memory](#filter-numbers-over-5-in-memory)
    - [Your Goal: Filter Even Numbers](#your-goal-filter-even-numbers-1)
1. [Stack Club 1](#stack-club-1)
    - [Stack Club](#stack-club)
    - [Your Goal: Add Members](#your-goal-add-members)
1. [Stack Club 2](#stack-club-2)
    - [Pop](#pop)
    - [Your Goal: Remove Members](#your-goal-remove-members)
    - [Function Security](#function-security)
---
### Fixed Sum
#### Fixed Arrays
- Fixed sized arrays have a set amount of values at compile-time.
- We can declare fixed size arrays in Solidity like so:
    ```solidity
    uint[3] x = [1,2,3];
    address[1] y = [0xc783df8a850f42e7F7e57013759C285caa701eB6];
    bool[4] z = [true, true, false, false];
    ```
    - These arrays have their size determined at compile-time. 
        - They cannot grow or shrink in size.
>  If you store less elements in the array than the fixed size, the rest of the elements will be the default value for the data type (i.e. ``false`` for ``bool`` and ``0`` for ``uint``). If you store more elements in the array than the fixed size, you'll get a compile-time TypeError!
- The above array declarations will work for state variables. 
    - Inside of a function, however, we will need to specify the data location of an array:
    ```solidity
    uint[3] memory numbers = [1, 2, 3];
    ```
    - The data location for this array is ``memory``.
- Memory is temporary, it will only last as long as the transaction. 
    - Other data locations include ``calldata`` for arguments and ``storage`` for persistence.

#### Retrieve Elements
- We can also retrieve elements from our array with numerical indexes:
    ```solidity
    uint[3] memory numbers = [1, 2, 3];

    console.log(numbers[0]); // 1
    console.log(numbers[1]); // 2
    ```
#### For Loops
- For loops in Solidity have similar syntax as JavaScript and other C-family languages:
    ```solidity
    for(uint i = 0; i < 10; i++) {
        // run statement
    }
    ```

#### Data Location
- There are three different locations for data in Solidity: **calldata**, **memory** and **storage**. Quite simply, **calldata** is for external argument data, **memory** is for temporary data, and **storage** is for persistent data. Let's examine them more closely. 

#### calldata
- When we broadcast a transaction from an EOA, we include bytecode for the EVM to run. 
    - This bytecode is the **calldata** which includes an identifier for the function we're targeting and the arguments we're sending.
- When we take an array as a parameter in an external function, it must be labeled as ``calldata``. 
    - It is a read-only reference to the argument data. Other than being read-only, it behaves quite like memory.

#### memory
- Memory is a temporary data location provided for us to keep our local variables in. 
    - These variables will only exist in memory for the length of the transaction.
- When we're working with arrays that should only exist for the length of the transaction, we label them with the memory keyword. 
    - We can read/write to this data location relatively cheaply when compared to storage.

#### storage 
- Storage is the data that actually gets stored on the blockchain. 
    - This is where state variables are stored!
- Every full node client on the Ethereum network stores this data on their machine. 
    - For this reason storage operations are expensive.
> If you recall in earlier lessons we talked about how every account has its own **storage root** which is the root hash of the particia merkle storage trie. This is where the Solidity ``storage`` keyword is referring to.

#### Value vs Reference
- Assigning an array will copy it in some cases and store a reference in other cases.
- Let's consider this example:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        uint[3] numbers = [1,2,3];

        function modify() external {
            uint[3] memory memoryArray = numbers;
            // will modifying memoryArray modify numbers?
            memoryArray[0] = 4;
            // nope! 
            console.log(numbers[0]); // 1
        }
    }
    ```
    - This will **not modify** the ``numbers``. 
        - The values from ``numbers`` are copied into ``memoryArray`` at this assignment and they are otherwise unrelated.
>  In fact, the compiler will warn that this can be labeled as a view. Didn't want to give any spoilers.
```solidity
import "hardhat/console.sol";
contract Contract {
    uint[3] numbers = [1,2,3];

    function modify() external {
        uint[3] storage storageArray = numbers;
        // will modifying storageArray modify numbers?
        storageArray[0] = 4;
        // yup! 
        console.log(numbers[0]); // 4
    }
}
```
- This will modify the ``numbers``. In this case, ``storageArray`` contains a **reference** to ``numbers`` due to its ``storage`` location.
> Equal references point to the same spot in memory. Making a modification updates the memory directly, all the references still point to the same place.

#### Further Reading
- If you want more resources on how smart contract stoage works, check out this guide on [What is Smart Contract Storage Layout?](https://docs.alchemy.com/docs/smart-contract-storage-layout).

#### Your Goal: Find the Sum
1. Create a pure, external function ``sum`` which takes a fixed size array of **five unsigned integers**.
1. Find the sum of the unsigned integers and return it as a ``uint``.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    function sum(uint[5] memory numbers)
        external
        pure
        returns (uint total)
    {
        for (uint i=0; i<numbers.length; i++) {
            total += numbers[i];
        }
    }
}
```
---

### Dynamic Sum
#### Dynamically Summed
- We can also create arrays in Solidity where the size is unknown at compile-time.
    - These arrays are said to have dynamic size.
- For example:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        function logFriends(address[] calldata friends) external view {
            for(uint i = 0; i < friends.length; i++) {
                console.log(friends[i]);
            }
        }
    }
    ```
    - Here we are able to log each address that is sent to the ``logFriends`` function.
- We use the ``length`` member available on the array to determine the number of elements inside the dynamic sized array and then we use number indexes to retrieve the address.
#### Your Goal: Sum Dynamic Array
1. Create a pure, external function ``sum`` which takes a dynamic size array of unsigned integers.
1. Find the sum of the unsigned integers and return it as a ``uint``.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    function sum(uint[] calldata numbers)
        external
        pure
        returns (uint total)
    {
        for(uint i; i<numbers.length;i++) {
            total += numbers[i];
        }
    }
}
```
---

### Filter to Storage
#### Storage Arrays
- With arrays in storage you can use the ``push`` member function to add a new element at the end.
```solidity
import "hardhat/console.sol";
contract Contract {
	uint[] public numbers;

    constructor() {
		numbers.push(3);
		console.log(numbers.length); // 1
		numbers.push(4);
		console.log(numbers.length); // 2
		console.log(numbers[0]); // 3
		console.log(numbers[1]); // 4
    }
}
```
- As you might expect the ``length`` member adjusts when new elements are pushed onto the end of the array.

#### Your Goal: Filter Even Numbers
1. Create a public, dynamic sized array of unsigned integers as a state variable called ``evenNumbers``.
1. Create an external function called ``filterEven`` which takes an dynamic size array of unsigned integers as its only argument. Find all of the even numbers in this array and push them into the ``evenNumbers`` storage array.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    uint[] public evenNumbers;

    function filterEven(uint[] memory numbers) external {
        for (uint i =0; i<numbers.length; i++) {
            if (numbers[i]%2==0) {
                evenNumbers.push(numbers[i]);
            }
        }
    }
}
```
---

### Filter to Memory
#### Memory Arrays
- Unlike storage arrays, memory arrays **do not** have a push member function.
- Memory arrays can have a dynamic size if the size is provided during initialization.
- For example:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        uint x = 5;

        function createArray() view external {
            address[] memory addresses = new address[](x);
            console.log( addresses.length ); // 5
        }
    }
    ```
    - The size is dynamically provided by the variable x.
        - We could potentially change this variable and it would create an array of addresses of that size.
        - Notice the use of the new operator here during initialization!
- After **initialization**, memory arrays **cannot be resized**.
    - This means even in the example above, once the ``addresses`` array is initialized at size ``5``, it will stay that length for the entirety of the transaction.
#### Filter Numbers over 5 in Memory
- Let's say we wanted to filter numbers over 5 in memory:
```solidity
contract Contract {
	function filter(uint[] calldata numbers)
        external
        pure
        returns(uint[] memory)
    {
        // find the number of elements over 5
		uint elements;
		for(uint i = 0; i < numbers.length; i++) {
			if(numbers[i] > 5) {
                elements++;
            }
		}

        // create a new array with this size
		uint[] memory filtered = new uint[](elements);
        // keep an index for the positions we have filled
		uint filledIndex = 0;
		for(uint i = 0; i < numbers.length; i++) {
			if(numbers[i] > 5) {
				filtered[filledIndex] = numbers[i];
				filledIndex++;
			}
		}
		return filtered;
	}
}
```
- This is quite a bit tougher to do without the ``push`` member function.
    - We need to first find the number of elements over 5 in the passed-in array so that we can initialize the return array at that size.

#### Your Goal: Filter Even Numbers
1. Create a pure, external function called ``filterEven`` which takes an dynamic size array of unsigned integers as its only argument.
1. Find all the even numbers and add them to a new array in memory. This array should **contain only** the even numbers.
1. Return this new array.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
    function filterEven(uint[] calldata numbers)
        external
        pure
        returns (uint[] memory filtered)
    {
        uint elements;
        for(uint i =0; i<numbers.length; i++) {

            if (numbers[i]%2==0) {
                elements ++;
            }
        }
        filtered = new uint[](elements);
        uint index = 0;
        for (uint i=0; i<numbers.length;i++) {
            if (numbers[i]%2==0) {
                filtered[index] = numbers[i];
                index ++;
            }
        }
    }
}
```
---

### Stack Club 1
#### Stack Club
- This ``StackClub`` contract will have many members like a **club** or an organization would.
    - We'll track these members by keeping a list of addresses.
- Members will be added by pushing their address to the top of the list.
    - Members will be removed by popping the most recent one off of the list. A Last-In-First-Out structure, just like a **stack**!

#### Your Goal: Add Members
1. Create a dynamic sized array of addresses called ``members``
1. Create an external function ``addMember`` which has a single parameter: an ``address`` for a new member.
1. Create a public view function ``isMember`` that takes an ``address`` and returns a ``bool`` indicating whether the ``address`` is a member or not.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract StackClub {
    address[] members;

    function addMember(address _member) external {
        members.push(_member);
    }

    function isMember(address _member)
        public
        view
        returns (bool find)
    {
        for (uint i=0; i<members.length; i++) {
            if (members[i] == _member) {
                find = true;
            }
        }
    }
}
```
---

 ### Stack Club 2
 #### Pop
 - Storage arrays also have access the pop member variable:
 ```solidity
import "hardhat/console.sol";
contract Contract {
	uint[] public numbers;

    constructor() {
		numbers.push(3);
		numbers.push(4);
		console.log(numbers.length); // 2
		numbers.pop();
		console.log(numbers.length); // 1
        console.log(numbers[0]); // 3
    }
}
```
- As you can see, pop will take the top element off the storage array.

#### Your Goal: Remove Members
1. Create a constructor which will add the deployer address as the first member of the stack club.
1. Create a ``removeLastMember`` function which will remove the last member added to the club.

#### Function Security
1. Ensure that the ``removeLastMember`` function can only be called by an existing member
1. Ensure that ``addMember`` can only be called by an existing member

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract StackClub {
    address[] members;

    constructor() {
        members.push(msg.sender);
    }

    function addMember(address _address) external {
        require(isMember(msg.sender));
        members.push(_address);
    }

    function removeLastMember() external {
        require(isMember(msg.sender));
        members.pop();
    }

    function isMember(address _member)
        public
        view
        returns (bool find)
    {
        for (uint i=0; i<members.length; i++) {
            if (members[i] == _member) {
                find = true;
            }
        }
    }
}
```
---