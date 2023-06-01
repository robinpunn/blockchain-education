### Structs
- Structs provide Solidity Developers with a way to build **custom data types**. 
    - These data types can have multiple fields of data types we already have previously discussed.
- For example:
    ```solidity
    struct Account {
        uint balance;
        bool isActive;
    }
    ```
    - This struct is composed of a ``uint`` and a ``bool``. 
    - If this struct were defined outside of a contract, it can be shared across multiple contracts like so:
    ```solidity
    struct Account {
        uint balance
        bool isActive;
    }

    contract A {
        Account owner;
        Account recipient;
    }

    contract B {
        mapping (address => Account) accounts;
    }
    ```
---
### Table of Contents
1. [Vote Storage](#vote-storage)
    - [Structs](#structs-1)
    - [Alternate Struct Initialization](#alternate-struct-initialization)
    - [Your Goal: Create a Vote](#your-goal-create-a-vote)
1. [Vote Memory](#vote-memory)
    - [Structs in Calldata and Memory](#structs-in-calldata-and-memory)
    - [Structs in ABI](#structs-in-abi)
    - [Your Goal: Return Memory Vote](#your-goal-return-memory-vote)
1. [Vote Array](#vote-array)
    - [Struct Arrays](#struct-arrays)
    - [Your Goal: Vote Array](#your-goal-vote-array)
1. [Choice Lookup](#choice-lookup)
    - [DRY Code](#dry-code)
    - [Your Goal: Find Vote](#your-goal-find-vote)
1. [Single Vote](#single-vote)
    - [Your Goal: Vote Once](#your-goal-vote-once)
---

### Vote Storage
#### Structs
- With structs we can create custom types in Solidity that are essentially groupings of variables.
- For instance:
    ```solidity
    enum Directions { Up, Down, Left, Right }

    struct Hero {
        Directions facing;
        uint health;
        bool inAir;
    }
    ```
    - With this struct we can create new heroes which contain just these three properties.
- We can create a new Hero by invoking the struct with parenthesis:
    ```solidity
    Hero hero = Hero(Directions.Up, 100, true);
    ```
- Then we can use the ``.`` operator to retrieve values from the hero:
```javascript
console.log(hero.facing == Directions.Up); // true
console.log(health); // 100
console.log(inAir); // true
```

#### Alternate Struct Initialization
- Let's use the Hero example again!
```javascript
enum Directions { Up, Down, Left, Right }

struct Hero {
    Directions facing;
    uint health;
    bool inAir;
}
```
- As noted, we can create a Hero by providing the values in the same order they are provided in the struct:
```javascript
Hero hero = Hero(Directions.Up, 100, true);
```
- However, if the ordering of the struct variables ever changed, we would need to update all of these initializations.
    - Also, it's not obvious from the initialization of the hero what those values even mean!
- Let's see the alternate approach:
    ```javascript
    Hero hero = Hero({
        facing: Directions.Up,
        health: 100,
        inAir: true
    });
    ```
    - Now the variable names help self-document the initiailization and changing the order of the hero struct variables will not break it.
- Of course, if you changed the names of the struct variables, that will only break this second initialization.
    - So, you know, there's tradeoffs.
- It's really a matter of code style.
    - It may be smart to use the first approach with smaller structs:
    ```javascript
    Person person = Person(name, age);
    ```
    - This might be pretty clear. Whereas:
    ```solidity
    Transaction tx = Transaction(
        msg.sender,
        address1,
        address2,
        msg.value,
        false
    );
    ```
    - Perhaps this would be a different story!
        - Code readability should be a major factor here.
        - Your fellow developers (and your future self) will thank you for keeping your code clear!

#### Your Goal: Create a Vote
1. Create a new struct called ``Vote`` that contains two properties: a ``Choices choice`` and an ``address voter``.
1. Then create a public state variable called ``vote`` which is of the ``Vote`` type.
1. Finally, in the ``createVote`` function create a new instance of ``Vote`` and store it in the state variable ``vote``. Use the ``choice`` passed in as an argument and the ``msg.sender`` for the vote properties.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}

	Vote public vote;

	function createVote(Choices choice) external {
		vote = Vote(choice, msg.sender);
	}
}
```
---

### Vote Memory
#### Structs in Calldata and Memory
- Traditionally structs were not handled by the ABI.
    - More recently, the ABIEncoderV2 has been added which will allow us to pass structs as calldata and return them in external functions!
- To use the ABIEncoderV2 we need to use a new pragma statement:
    ```solidity
    pragma experimental ABIEncoderV2;
    ```
    - With this pragma statement at the top of our code, we can use tuples in our ABI to describe structs.
> Recall that tuples are temporary groupings of potentially dissimilar data types used for destructuring and returning multiple function parameters.
> Despite the **experimental** keyword, the ABIEncoverV2 is no longer considered experimental by the Solidity team as of **Solidity v0.6.0**. In other words, it is now considered safe for production use.
- This encoder will allow us to take struct arguments and return structs externally:
    ```solidity
    struct Hero { uint health }

    function postHero(Hero hero) external {
        // take a Hero type as an external argument
        console.log(hero.health); // 100
    }

    function getHero() external view returns (Hero memory) {
        // return Hero in an external function
        return Hero(100);
    }
    ```

#### Structs in ABI
- To parse structs, ABI map them to tuple values. For instance, for our Hero example:
    ```solidity
    pragma experimental ABIEncoderV2;
    contract Contract {
        enum Directions = { Up, Down, Left, Right }

        struct Hero {
            Directions facing;
            uint health;
            bool inAir;
        }

        function getHero() external pure returns(Hero memory) {
            return Hero(Directions.Up, 100, true);
        }
    }
    ```
- The ABI would look like this:
    ```json
    [
        {
            "inputs": [],
            "name": "getHero",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "enum Contract.Directions",
                            "name": "facing",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "health",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "inAir",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Contract.Hero",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        }
    ]
    ```
    - See how the type of the hero output is a tuple?
- This tuple is a collection of three components: a ``uint8`` (for enums with less than 255 values), a ``uint256`` and ``bool``.
- This is how an ABI sees a struct, a collection of dissimilar components.
    - These tuples can even contain **nested tuples**.
    - So one of the tuple's components can be a tuple which itself contains tuples.
- From the Solidity side, nested structs looks like this:
    ```solidity
    struct Person {
        Sport favoriteSport;
        string name;
    }

    struct Sport {
        string name;
        bool isProfessional;
    }
    ```
- The output for a function returning person would look like this:
    ```json
    {
        "components": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "isProfessional",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Contract.Sport",
                "name": "favoriteSport",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "internalType": "struct Contract.Person",
        "name": "",
        "type": "tuple"
    }
    ```
    -  The first set of components belongs to the ``struct Contract.Person``, which contains a ``Sport`` and a ``string``.
    - Then we have the nested set of components for the Sport which contains a ``string`` and a ``bool``.

#### Your Goal: Return Memory Vote
1. Create an external, view function called ``createVote`` which takes ``Choices`` value as a parameter and returns an instance of type ``Vote``.
1. This function should use the ``Choices`` value and the ``msg.sender`` as the values to create the vote.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

contract Contract {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}

	function createVote(Choices choice)
		external
		view
		returns (Vote memory)
	{
		return Vote(choice, msg.sender);
	}
}
```
---

### Vote Array
#### Struct Arrays
- We can create an array of struct types, just like we would with any other data type!
```solidity
// a dynamic size list of uints
uint[] numbers;

struct Account {
    uint id;
    uint balance;
}
// a dynamic size list of Accounts
Account[] accounts;
```
- We can also push and retrieve accounts like any other storage array:
    ```solidity
    accounts.push(Account(0, 100));

    console.log(accounts[0].id); // 0
    console.log(accounts[0].balance); // 100
    ```
    - Of course, push only works on storage arrays, as we learned in the lesson on arrays!
#### Your Goal: Vote Array
1. Create a public state array of the Vote data type called votes.
1. In the createVote function use the choice parameter and the msg.sender to create a new vote and push it onto the array of votes.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}

	Vote[] public votes;

	function createVote(Choices choice) external {
		votes.push(Vote(choice, msg.sender));
	}
}
```
---

### Choice Lookup
#### DRY Code
- It's good to share code amongst functions, especially when they both require some similar functionality.
- We have two functions on this stage: ``hasVoted`` and ``findChoice``.
    - In both of these functions we'll need to take an address and find a vote.
- We're going to need to **loop over** all the votes in both cases!
    - Is it possible to create one function to do this looping?
- Let's think about the function we'd like to have:
    ```solidity
    Vote vote = findVote(voterAddress);
    ```
- This ``findVote`` function would have a signature like this:
    ```solidity
    function findVote(address voter)
        internal
        view
        returns(Vote memory /* or storage */);
    ```
    - This function could either return a vote in memory or reference a vote in the storage array.
- The trouble is, what do we do when a vote isn't found? What do we return in that case?
- One solution that many smart contracts opt for is to create a struct with the default values:
    ```solidity
    Vote none = Vote(Choices(0), address(0));
    ```
    - This vote contains the first value in ``Choices`` and the zero address for the voter.
    - We can return a struct like this from ``findVote`` in the case where one is not found.
- We can check if the vote returned by the function is the zero address:
    ```solidity
    Vote vote = findVote(voterAddress);
    // two ways to check if a vote was found:
    // 1. ensure the voter address is not the zero address
    bool voteFound = vote.voter != address(0);
    // 2. ensure the voter address is the same
    bool voteFound2 = vote.voter == voterAddress;
    ```
#### Your Goal: Find Vote
1. Create an external, view function ``hasVoted`` which takes an ``address`` and returns a ``bool`` indicating if the address has cast a vote or not.
1. Create an external, view function ``findChoice`` which takes an ``address`` and returns a ``Choices`` value indicating the choice on the vote cast by the address. For this function there is no need to worry about the case where a vote was not cast.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}

	Vote none = Vote(Choices(0), address(0));

	Vote[] public votes;

	function createVote(Choices choice) external {
		votes.push(Vote(choice, msg.sender));
	}

	function findVote(address voter)
		internal
		view
		returns(Vote storage)
	{
		for (uint i=0; i<votes.length; i++) {
			if (votes[i].voter == voter) {
				return votes[i];
			}
		}
		return none;
	}

	function hasVoted(address voted)
		external
		view
		returns (bool cast)
	{
		cast = findVote(voted).voter == voted;
	}

	function findChoice(address voted)
		external
		view
		returns (Choices)
	{
		return findVote(voted).choice;
	}
}
```
---

### Single Vote
#### Your Goal: Vote Once
1. Each address should only be allowed to call ``createVote`` once.
1. If they try again, the transaction should be reverted.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Contract {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}

	Vote none = Vote(Choices(0), address(0));

	Vote[] public votes;

	function createVote(Choices choice) external {
		require(findVote(msg.sender).voter != msg.sender); //or require(!hasVoted(msg.sender))
		votes.push(Vote(choice, msg.sender));
	}

	function findVote(address voter)
		internal
		view
		returns(Vote storage)
	{
		for (uint i=0; i<votes.length; i++) {
			if (votes[i].voter == voter) {
				return votes[i];
			}
		}
		return none;
	}

	function hasVoted(address voted)
		external
		view
		returns (bool cast)
	{
		cast = findVote(voted).voter == voted;
	}

	function findChoice(address voted)
		external
		view
		returns (Choices)
	{
		return findVote(voted).choice;
	}
}
```
---