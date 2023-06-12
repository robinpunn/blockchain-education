## Mappings
- Mappings are an important data type in Solidity. With a mapping we can take values of one data type and map them to values of another data type.
- Let's consider an example. Say you wanted to track balances of a bunch of addresses:
<table>
    <tr>
        <th>Address</th>
        <th>Balance</th>
    </tr>
    <tr>
        <td>0xc783df8a850f42e7F7e57013759C285caa701eB6</td>
        <td>500</td>
    </tr>
    <tr>
        <td>0xeAD9C93b79Ae7C1591b1FB5323BD777E86e150d4</td>
        <td>100</td>
    </tr>
    <tr>
        <td>0xE5904695748fe4A84b40b3fc79De2277660BD1D3</td>
        <td>20</td>
    </tr>
</table>

- Based on what we have learned so far you might be thinking of creating an array of structs:
    ```solidity
    struct Account {
        address addr;
        uint balance;
    }

    Account[] accounts;
    ```
    - This works, certainly.
    - When we need to find an address balance we can iterate through the accounts to find the address we're looking for and retrieve the balance.
- **However**, there's a better way! We can use a mapping:
    ```solidity
    mapping(address => uint) balances;
    ```
    - With a mapping each address is mapped to a unique place in memory where it stores the ``uint`` balance.
    - Looking up the balance is as simple as providing the address to the mapping: ``balances[addr]``.
> Under the hood, the storage location is found by hashing the ``balances`` variable location with the address passed in. It's a simple lookup! Much more efficient than iteration. Generally it's better to try to use a mapping **first** and only use an array when you realize you need to iterate.

---
### Table of Contents
1. [Add a Member](#add-a-member)
    - [Mapping](#mapping)
    - [Your Goal: Members Mapping](#your-goal-members-mapping)
1. [Is Member](#is-member)
    - [Mapping Retrieval](#mapping-retrieval)
    - [Mapping Storage](#mapping-storage)
    - [Your Goal: Is Member](#your-goal-is-member)
1. [Remove Member](#remove-member)
    - [Mapping Removal](#mapping-removal)
    - [Your Goal: Remove Member](#your-goal-remove-member)
1. [Map Structs](#map-structs)
    - [Mapping to Struct](#mapping-to-struct)
    - [Your Goal: User Mapping Tokens](#your-goal-user-mapping-tokens)
    - [Contract Security](#contract-security)
1. [Map Structs 2](#map-structs-2)
    - [Types of Balances](#types-of-balances)
    - [Your Goal: Transfer Amount](#your-goal-transfer-amount)
    - [Contract Securty](#contract-security-1)
1. [Nested Maps](#nested-maps)
    - [Nested Mappings](#nested-mappings)
    - [Your Goal: Make Connections](#your-goal-make-connections)
---

### Add a Member
#### Mapping
- Mappings allow you to store and retrieve elements quickly with a **key**.
    - The key points to a location in memory where the **   ** is stored.
- The **key** can be any **value data type** in Solidity. It cannot be a **reference data type** like a struct or an array.
- The **value**, on the other hand, can be any Solidity type.
    - It can be a struct, an array or *even another mapping*!
- Let's see an example of a mapping:
    ```solidity
    import "hardhat/console.sol";
    contract Contract {
        // create a score state variable
        // maps an address (key) to a uint (value)
        mapping(address => uint) public score;

        function addPoint() external {
            // we're using msg.sender as the key
            // to look up the score in memory
            console.log(score[msg.sender]); // 0

            // we can also update that location in memory
            score[msg.sender]++;
            console.log(score[msg.sender]); // 1
        }
    }
    ```
    - The variable ``score`` takes an ``address`` and maps it to a ``uint``.
        - Each address will be mapped to its own unique ``uint`` value that it can retrieve and modify.
    - The ``addPoint`` function uses the ``msg.sender`` as the key to update a location in memory.
        - This location in memory for a value is **initialized at zero**.
        - We can add to it using the ``msg.sender`` as the key, as shown above.
>  The ``score`` mapping is ``public`` which means that there will be a getter function created automatically. We can make a request to an Ethereum node invoking this getter function with an ``address`` and get a ``uint`` back.

#### Your Goal: Members Mapping
1. Create a public mapping called ``members`` which maps an ``address`` to a ``bool``. The ``bool`` will indicate whether or not the address is currently a member!
2. Create an external function called ``addMember`` which takes an ``address`` and adds it as a member. You can do this by storing true in the data location corresponding to the ``address`` in the members mapping.

---
**SOLUTION**
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    mapping(address => bool) public members;

    function addMember(address _member) external {
        members[_member] = true;
    }
}
```
---

### Is Member
#### Mapping Retrieval
- Compared to arrays retrieving a value from a mapping is quite simple!
- Consider:
    ```solidity
    mapping(address => bool) students;

    function isStudent(address addr) external view returns(bool) {
        return students[addr];
    }
    ```
- Versus:
    ```solidity
    address[] students;

    function isStudent(address addr) external view returns(bool) {
        for(uint i = 0; i < students.length; i++) {
            if(students[i] === addr) {
                return true;
            }
        }
        return false;
    }
    ```
    -  To find if the student address is an array we have to **iterate** over the array.
    - For the mapping we can simply plug in the address.
>  Choosing the right data structure is half the battle. It can help keep the code clean and use less gas!

#### Mapping Storage
- The location of a **value** inside a mapping depends on two things:
1. The variable position inside of the contract
1. The mapping key to find the value
- The variable position is determined by where in the contract the mapping is defined:
    ```solidity
    contract Contract {
        mapping(address => uint) balances;
    }
    ```
    - In this example ``balances`` would be in storage slot ``0`` since it's the first variable.
    - If there were a ``uint`` declared above it, it would be in storage slot ``1``.
- The mapping key will be the ``address`` for the balance we're trying to find.
- We can take the variable position and the mapping key and hash them together:
    ```solidity
    keccak256(mappingKey + variablePosition);
    ```
    - This will result in a hash we can use to find the value stored by the mapping key.
    - We can use the ``eth_getStorageAt`` method on the Ethereum JSON-RPC api to get the memory at this location for a contract, retrieving the balance.
>  We can query this storage position whether ``balances`` is public or not! It always serves as a good reminder that just because the value isn't ``public`` doesn't mean we can't access the value. Other **contracts** will be unable to access the value at runtime (enforced by the EVM rules). However, we can scan the storage of any contract by communicating with an ethereum node.

#### Your Goal: Is Member
- Create an external, view function called ``isMember`` which takes an ``address`` and returns a ``bool`` indicating whether or not the address is a member.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    mapping(address => bool) public members;

    function addMember(address _member) external {
        members[_member] = true;
    }

    function isMember(address _member)
        external
        view
        returns (bool)
        {
            return members[_member] == true;
        }
}
```
---

### Remove Member
#### Mapping Removal
- For arrays, removing elements can be an expensive operation, especially if you don't want to leave any gaps!
- Let's say you had an array containing the unsigned integer values ``[1,2,3]``.
- Removing the first element ``1`` would mean you would have to shift the values ``2`` and ``3`` down one position each.
- For a bigger array, this could mean many storage operations. Super expensive!
> In this case you *could* use a **Linked List** where you can "stitch" the previous node to the next node instead of having to shift elements.
- For mappings, removal is quite simple.
- For example, in this students mapping:
    ```solidity
    mapping(address => bool) students;

    function removeStudent(address addr) external {
        students[addr] = false;
    }
    ```
- Simple code! We provide the address to find the memory location and set it to ``false``.

#### Your Goal: Remove Member
- Create an external function called ``removeMember`` that will take an ``address`` and set its corresponding value in the ``members`` mapping to ``false``.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    mapping(address => bool) public members;

    function addMember(address _member) external {
        members[_member] = true;
    }

    function isMember(address _member)
        external
        view
        returns (bool)
        {
            return members[_member] == true;
        }

    function removeMember(address _member) external {
        members[_member] = false;
    }
}
```
---

### Map Structs
#### Mapping to Struct
- Here's where mappings get interesting! We can map to many different types. Let's start with structs:
    ```solidity
    contract Market {
        // create the Collectible struct
        struct Collectible {
            address owner;
            bool forSale;
            uint price;
        }

        // map a uint ID to a Collectible struct
        mapping(uint => Collectible) idToCollectible;

        function purchase(uint _id) external payable {
            // find the collectible by the id passed in
            Collectible storage collectible = idToCollectible[_id];
            // purchase the collectible
            require(msg.value >= collectible.price);
            collectible.owner = msg.sender;
            collectible.forSale = false;
        }
    }
    ```
    - We are able to lookup the collectible using the ``uint`` id passed into ``purchase``. Then we have access to the struct to sell it to its new owner.

#### Your Goal: User Mapping Tokens
- Let's create a new token where every new user will receive 100 tokens!
1. Create a public mapping called ``users`` that will map an ``address`` to a ``User`` struct.
1. Create an external function called ``createUser``. This function should create a new user and associate it to the ``msg.sender`` address in the ``users`` mapping.
1. The ``balance`` of the new user should be set to ``100`` and the ``isActive`` boolean should be set to ``true``.
#### Contract Security
- Ensure that the ``createUser`` function is called with an address that is not associated with an active user. Otherwise, revert the transaction.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	struct User {
		uint balance;
		bool isActive;
	}

	mapping(address => User) public users;

	function createUser() external {
		User storage user = users[msg.sender];
		require(!user.isActive);
		user.balance = 100;
		user.isActive = true;
	}

}
```
**GIVEN SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	struct User {
		uint balance;
		bool isActive;
	}

	mapping(address => User) public users;

	function createUser() external {
		require(!users[msg.sender].isActive);
		users[msg.sender] = User(100, true);
	}
}
```
---

### Map Structs 2
#### Types of Balances
- Smart Contracts will often store balances for two different reasons:
    1. **Ether Balance** - Keep track of the ether deposited by each user
    1. **Token Balance** - Keep track of the amount of tokens held by each user

- For ether, we use the native ``value`` on the message and the transaction.
    - Sending ``value`` will update the user's account balance in the ethereum global state.
- For tokens, we update a ``balances`` mapping.
- The smart contract is solely responsible for maintaining the user's balance.
- In the smart contract you are building, you are maintaining your own balances in the ``User`` struct that has no relation to ether.
    - To transfer balances from one user to another, you can just update the struct value! There is no need to send ``value`` over message call (i.e. using ``<address>.call``).
####  Your Goal: Transfer Amount
1. Create an external function called ``transfer`` which takes two parameters: an ``address`` for the recipient and a ``uint`` for the amount.
1. In this function, transfer the ``amount`` specified from the balance of the ``msg.sender`` to the balance of the recipient ``address``.
#### Contract Security
1. Ensure that both addresses used in the ``transfer`` function have active users.
1. Ensure that the ``msg.sender`` has enough in their ``balance`` to make the transfer without going into a negative balance.
1. If either of these conditions aren't satisfied, revert the transaction.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	struct User {
		uint balance;
		bool isActive;
	}

	mapping(address => User) public users;

	function createUser() external {
		User storage user = users[msg.sender];
		require(!user.isActive);
		user.balance = 100;
		user.isActive = true;
	}

	function transfer(address recipient, uint amount) external {
		require(users[msg.sender].balance >= amount);
		require(users[msg.sender].isActive && users[recipient].isActive);
		users[msg.sender].balance -= amount;
		users[recipient].balance += amount;
	}
}
```

### Nested Maps
#### Nested Mappings
- As shown in the previous stage, we can provide more complex types in our mapping values.
- Last stage we showed it with structs, now let's try it with **other mappings**!
```solidity
mapping(uint => mapping(address => bool)) voteToAddressChoice;

function getVote(uint _id, address _addr)
    external
    view
    returns(bool)
{
    return voteToAddressChoice[_id][_addr];
}
```
    - In this scenario each **vote id** points to a **mapping of addresses to bool votes**.
    - This allows each address to register a different vote with each vote id.
- As a voter we might call a function with an id to register our choice:
    ```solidity
    function registerVote(uint _id, bool _choice) external {
        voteToAddressChoice[_id][msg.sender] = _choice;
    }
    ```
- Let's say there were 3 votes with the ids: ``212``, ``72`` and ``409``
- We could for make the following transactions from an EOA:
    ```js
    // for true for vote id 212
    registerVote(212, true);
    // for false for vote id 72
    registerVote(72, false);
    // for true for vote id 409
    registerVote(409, true);
    ```
    - This would register a ``true`` for the ids ``212`` and ``409`` at our address. For ``72`` it would register false.
> Of course, the default value for a ``bool`` is ``false``, so this second vote may be pointless unless we were to add in some other way to provide an non-existent vote.

#### Your Goal: Make Connections
1. Create a public mapping called ``connections`` which will map an ``address`` to a mapping of an ``address`` to a ``ConnectionTypes`` enum value.
1. In the ``connectWith`` function, create a connection from the ``msg.sender`` to the ``other`` address.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
	enum ConnectionTypes {
		Unacquainted,
		Friend,
		Family
	}

	// TODO: create a public nested mapping `connections`
	mapping(address => mapping(address => ConnectionTypes)) public connections;

	function connectWith(address other, ConnectionTypes connectionType) external {
        // TODO: make the connection from msg.sender => other => connectionType
		connections[msg.sender][other] = connectionType;

	}
}
```