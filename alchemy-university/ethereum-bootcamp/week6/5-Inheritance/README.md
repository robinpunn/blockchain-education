## Inheritance

---
### Table of Contents
1. [Inherit](#inherit)
    - [Inheritance](#inheritance-1)
    - [Your Goal: Make Superheroes](#your-goal-make-superheroes)
1. [Constructor Args](#constructor-args)
    - [Constructor Inheritance](#constructor-inheritance)
    - [Your Goal: Specific Health](#your-goal-specific-health)
1. [Virtual Override](#virtual-override)
    - [Virtual & Override](#virtual--override)
    - [Abstract Contracts](#abstract-contracts)
    - [The Nitty Gritty](#the-nitty-gritty)
    - [Your Goal: SuperHero Attacks](#your-goal-superhero-attacks)
1. [Super](#super)
    - [Super Call](#super-call)
    - [Your Goal: Add the Super!](#your-goal-add-the-super)
1. [Ownable](#ownable)
    - [Base Utility Contracts](#base-utility-contracts)
    - [Your Goal: Only Owner](#your-goal-only-owner)

### Inherit
#### Inheritance
- Traditionally, inheritance is when one class **copies** (or inherits) functionality from another class.
> Throughout this lesson you'll see the terms **base** and **derived**. Simply put, the **derived** class inherits from the **base** class.
- For Solidity, we'll be talking about inheritance for Contracts instead of Classes. However, the concept is the same!
- It's quite easy to inherit contracts in Solidity. Let's see an example:
    ```solidity
    contract Base {
        uint public value = 10;

        function changeValue(uint _value) external {
            value = _value;
        }
    }

    contract Derived is Base {
        // inherits everything from base contract!
    }
    ```
    - In this example the Derived inherits both the value state variable as well as the changeValue function!
- To setup the inheritance, all we need is the ``is`` keyword in the contract declaration, which specifies which contract to inherit from.
> The body of the ``changeValue`` function is actually copied into the ``Derived`` functions bytecode, when inherited. Then we can deploy ``Derived`` as a standalone contract with all of its inherited functionality baked in.

#### Your Goal: Make SuperHeroes
- You'll notice that the ``SuperHeroes.sol`` file imports the ``Hero.sol`` read-only file. 
    - Your goal is to create two new contracts that inherit from the base ``Hero`` contract.
1. Create two new contracts ``Mage`` and ``Warrior`` which inherit both the function and the state variable from the ``Hero`` contract.
---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Hero {
	uint public health = 100;

	function takeDamage(uint damage) external {
		health -= damage;
	}
}

// SuperHeroes.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Hero.sol";

// TODO: create Mage/Warrior Heroes
contract Mage is Hero {

}

contract Warrior is Hero {
    
}
```

### Constructor Args
#### Constructor Inheritance
- In the previous example, the Base contract had a state variable with an initial value and a function to modify it.
- What if the Base contract had an initial value that was set in a constructor?
```solidity
contract Base {
	uint public value;

    constructor(uint _value) {
        value = _value;
    }
}
```
- Can we pass that initial value into the Base constructor when we're inheriting it?
- Sure can!
- Same syntax as invoking a function:
```solidity
contract Derived is Base(10) {
    // inherits everything from base contract!
}
```
- See how we passed 10 into the Base contract? This is provided as a constructor argument!
> It is possible to send multiple arguments to the constructor as well. This is also function syntax, comma-separated arguments within the parenthesis.

#### Your Goal: Specific Health
- You'll notice that the ``Hero.sol`` file has changed on this stage! Now it has a ``constructor`` which takes a ``health`` argument.
1. Let's modify our SuperHeroes so that ``Warrior`` has an initial health of ``200`` while the ``Mage`` has an initial health of ``50``.
---
**SOLUTION**
```solidity
//Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Hero {
	uint public health;
	constructor(uint _health) {
		health = _health;
	}

	function takeDamage(uint damage) external {
		health -= damage;
	}
}

//SuperHeroes.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Hero.sol";

// TODO: create Mage/Warrior Heroes
contract Mage is Hero(50) {

}

contract Warrior is Hero(200) {

}
```

### Virtual Override
#### Virtual & Override
- It's time to introduce two new function keywords: **virtual** and **override**.
- Sometimes we'll want to leave a function on a base contract open to re-implementation by its derived class.
    - That's where these two new keywords come in.
    - The **virtual** keyword allows us to specify a function on a contract that can be overridden using the **override** keyword.
    ```soldity
    contract Base {
        uint public value = 5;
        // this method can be overridden
        function increaseValue() virtual external {
            value += 10;
        }
    }

    contract Derived is Base {
        // this method overrides the virtual method
        function increaseValue() override external {
            value *= 2;
        }
    }
    ```
    - In this case, both ``Derived`` and ``Base`` have different function bodies for ``increaseValue``.
- The ``Derived`` contract will use its own implementation of ``increaseValue``, which overrides the virtual function implemented in ``Base``.
> The overriding function must have the same visibility as the virtual function. If not the compiler will throw a TypeError: "Overriding function visibility differs". Keep en eye out for that one!
- We can also specify **abstract** contracts where virtual functions do not require an implementation.
    - However, these functions must be implemented at some point by a derived contract.

#### Abstract Contracts
- Abstract Contracts can serve as templates for other contracts.
- They serve a similar purpose to interfaces. Let's compare the them:
    - In an interface, none of the functions are implemented.
        - There are simply the function signatures with no function body.
    - In an abstract contract, some functions may be implemented while others may not be.
        - You can pick and choose which functions to implement.
> Implicitly, all interface methods are **virtual**. Abstract contracts must mark their methods as **virtual** if they wish to allow them to be overridden.
- Other than this, abstract contracts are just like regular contracts.
    - They can inherit from other contracts, they can have state variables and a constructor.
- Contracts can inherit interfaces.
    - However, interfaces can only inherit other interfaces.
    - They cannot have state variables or a constructor.

#### The Nitty Gritty
- When an abstract declares a virtual function without a function body, that function must be implemented by some non-abstract contract inheriting from it.
> It may be confusing here mentioning the **non-abstract contract**. Technically, an abstract contract can inherit from an abstract contract which can inherit from another abstract contract… None of these abstract contracts can be deployed, only the one that implements all of the functions.
- An abstract contract with unimplemented functions cannot be deployed.
    - They must be inherited by a function which implements those functions.
    - The derived contract which implements all the functions can be deployed.
- Let's take this code stage for example.
    - For the ``Hero`` contract on the ``Hero.sol`` tab we don't know what an attack from a plain hero would look like, so it is left unimplemented.
    - However, we want to ensure that **every derived hero** implements the attack function.
    - This way, we can guarantee that every ``Hero`` has an implemented attack function.
    - Each one will be special based on the derived contract's implementation.

#### Your Goal: SuperHero Attacks
- You'll notice the Hero.sol tab has changed once again! This time there's three important things to notice:
    1. The ``Hero`` contract is an abstract contract.
        - It has a ``virtual`` function called ``attack`` which we'll need to override in both Warrior and Mage.
    1. An ``enum`` called ``AttackTypes`` has been added to the Hero contract to differentiate between the different types of attacks our heroes can do.
    1. An interface for an ``Enemy`` has been added which we import to invoke the ``takeAttack`` function on an enemy contract address.
- Your job is to implement the ``attack`` function on the Warrior and Mage contracts:
    1. Add an ``override`` function called ``attack`` to both the Warrior and Mage contracts.
        - This function should take an ``address`` parameter which will be the address for an Enemy contract (note: you'll need to instantiate the enemy contract)
    1. Use the Enemy interface to invoke the ``takeAttack`` function on the enemy contract at this address.
    1. For the Warrior, invoke the enemy's ``takeAttack`` with the ``Brawl`` attack type.
    1. For the Mage, invoke the enemy's ``takeAttack`` with the ``Spell`` attack type.
---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface Enemy {
	function takeAttack(Hero.AttackTypes attackType) external;
}

abstract contract Hero {
	uint public health;
	constructor(uint _health) {
		health = _health;
	}

	function takeDamage(uint damage) external {
		health -= damage;
	}

	enum AttackTypes { Brawl, Spell }
	function attack(address enemy) public virtual;
}

// SuperHeroes.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Hero.sol";

// TODO: create Mage/Warrior Heroes
contract Mage is Hero(50) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(Hero.AttackTypes.Spell);
    }
}

contract Warrior is Hero(200) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(Hero.AttackTypes.Brawl);
    }
}
```

### Super
#### Super Call
- In the last stage we wrote an override function for an unimplemented function on the base contract.
- In other cases, the base contract will have functionality in its virtual functions that we want to share with our derived contracts.
    - That's when it's time to use super.
    ```solidity
    contract Base {
        uint public value = 10;

        function modify() virtual external {
            value *= 2;
        }
    }

    contract Derived is Base {
        function modify() virtual override external {
            value += 20;
            super.modify(); // results in value = 60
            // Base.modify() would also work!
        }
    }
    ```
    - You can see in our ``Derived`` contract we are modifying the value and then calling ``super.modify`` to invoke the function on the base contract as well.
    - This will first perform ``value += 20`` from the ``override`` function, then perform ``value *= 2`` from the super function, resulting in ``value=60``.
- With arguments this works like any other function: we would pass through arguments to ``super.modify()``.

#### Your Goal: Add the Super!
- The ``attack`` function is now implemented by the ``Hero`` base contract.
    - It will decrement ``energy`` from our hero after every attack.
- Let's invoke this base contract function from within the ``attack`` function for both (derived) hero contracts: Mage and Warrior.
---
**SOLUTION**
```solidity
// Hero.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface Enemy {
	function takeAttack(Hero.AttackTypes attackType) external;
}

contract Hero {
	uint public health;
	uint public energy = 10;
	constructor(uint _health) {
		health = _health;
	}

	enum AttackTypes { Brawl, Spell }
	function attack(address) public virtual {
		energy--;
	}
}

// SuperHeroes.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./Hero.sol";

// TODO: create Mage/Warrior Heroes
contract Mage is Hero(50) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(Hero.AttackTypes.Spell);
        super.attack(_enemy);
    }
}

contract Warrior is Hero(200) {
    function attack(address _enemy) public override {
        Enemy enemy = Enemy(_enemy);
        enemy.takeAttack(Hero.AttackTypes.Brawl);
        super.attack(_enemy);
    }
}
```

### Ownable
#### Base Utility Contracts
- It is often quite useful for a base contract to provide utility functions and modifiers.
- Let's see an example:
    ```solidity
    contract Depositable {
        modifier requiresDeposit {
            require(msg.value >= 1 ether);
            _;
        }
    }

    contract Escrow is Depositable {
        address owner;
        constructor() requiresDeposit {
            owner = msg.sender;
        }
    }
    ```
    - Here the ``Escrow`` contract requires a deposit of at least 1 ether in order to deploy.
        - Otherwise the transaction will revert.
- This requirement comes from the base contract ``Depositable`` and is used through the inherited ``requiresDeposit`` modifier.

#### Your Goal: Only Owner
- On the ``Collectible.sol`` tab you'll see that ``Collectible`` contract inherits from the ``Ownable`` contract.
    1. Your goal is to fill out the ``Ownable`` base contract, which will be used by the ``Collectible`` contract!
    1. The ``owner`` should be defined in the ``Ownable`` base contract
    1. Ensure that ``markPrice`` can only be called by the ``owner`` (the deployer of the collectible)
> **HINT**: The ``markPrice`` function uses an ``onlyOwner`` modifier which is currently not implemented anywhere!
---
**SOLUTION**
```solidity
// BaseContracts.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Ownable {
    address owner;
    constructor(){
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

// Collectible.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseContracts.sol";

contract Collectible is Ownable {
	uint public price;

	function markPrice(uint _price) external onlyOwner {
		price = _price;
	}
}
```

### Multiple Inheritance
- It's possible to inherit from **multiple contracts**.
- The derived contract will inherit state variables and functions from each base contract:
    ```solidity
    contract Base1 {
        uint a = 5;
    }
    contract Base2  {
        uint b = 10;
    }
    contract Derived is Base1, Base2 {
        // has access to both b and a!
    }
    ```
    - You can see we specify the contracts to inherit from in a comma-separated list.
        - The ``Derived`` contract is inheriting from both ``Base1`` and ``Base2``.
- When it comes to multiple inheritance, **order matters**! Let's take a closer look.

#### Multiple Inheritance Order
- When inheriting from contracts, the most base contract should be furthest left in the comma-separated list.
- For example:
    ```solidity
    contract Base {

    }

    contract Middle is Base {

    }

    contract Top is Base, Middle {

    }
    ```
    - The important part here is that ``Top`` inherits from ``Base`` and ``Middle``, in that order.
    - Since ``Middle`` inherits from ``Base``, this will not resolve if this order were reversed.
- In this code stage, we can see that ``Collectible`` is inheriting from both ``Ownable`` and ``Transferable`` in this order.
    - Based on the order, ``Transferable`` can inherit from ``Ownable``, but not vice-versa.
- In this code stage, it makes sense for Transferable to inherit from Ownable which is why these contracts were specified in this order.
>  You are more than welcome to test this out! If you try making Ownable inherit from Transferable, the compiler will complain with a pretty scary looking error: “Linearization of inheritance graph impossible”. You can see more details on this in the [Solidity Docs](https://solidity.readthedocs.io/en/v0.7.5/contracts.html#multi-inheritance).

#### Your Goal: Collectible Transferable
- The ``Collectible`` contract now also inherits from ``Transferable``, a contract which has not been created yet!
1. Your goal is to create a new contract ``Transferable`` that will allow the ``Collectible`` to transfer its ownership to another address.
1. In the ``Transferable`` contract, create a function called ``transfer`` which takes an ``address`` for the new owner.
1. Have this function transfer ownership from the current owner to the new owner passed in.
1. Ensure that this function **can only be called by the current owner**.
---
**SOLUTION**
```solidity
// BaseContracts.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Ownable {
    address owner;
    constructor(){
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Transferable is Ownable {
    function transfer(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }
}

// Collectible.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseContracts.sol";

contract Collectible is Ownable, Transferable {
	uint public price;

	function markPrice(uint _price) external onlyOwner {
		price = _price;
	}
}
```