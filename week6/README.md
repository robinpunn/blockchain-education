## Solidity Core

### Table of Contents
1. [Solidity Challenges](#solidity-challenges)
    - [Solidity Practice](#solidity-practice)
    - [Need Help?](#need-help)
1. [Multi-Signature Contracts](#multi-signature-contracts)
    - [Multi-Sigs Overview](#multi-sigs-overview)
    - [Multi-Sig Utility](#multi-sig-utility)
    - [No Single Point of Failure](#no-single-point-of-failure)
    - [Multi-Sig Contract Wallet Use Cases](#multi-sig-contract-wallet-use-cases)
    - [Gnosis Safe](#gnosis-safe)
    - [Suggested Reading](#suggested-reading)
    - [Conclusion](#conclusion)
1. [Smart Contract Inheritance](#smart-contract-inheritance)
    - [Inheritance Overview](#inheritance-overview)
    - [Inheritance in Computer Science](#inheritance-overview)
    - [Inheritance in Solidity](#inheritance-in-solidity)
    - [Single Inheritance](#single-inheritance)
    - [Multi-Level Inheritance](#multi-level-inheritance)
    - [Hierarchical Inheritance](#hierarchical-inheritance)
    - [Inheritance Use Cases](#inheritance-use-cases)
    - [Ownable](#ownable)
    - [Multiple Inheritance](#multiple-inheritance)
        - [Token](#token)
    - [Solidity Inheritance - Function Syntax](#solidity-inheritance---function-syntax)
        - [``virtual`` Keyword](#virtual-keyword)
        - [``override`` Keyword](#override-keyword)
    - [NFT Use Case](#nft-use-case)
    - [Suggested Reading](#suggested-reading-1)
    - [Conclusion](#conclusion-1)
1. [ERC-20 Tokens](#erc-20-tokens)
    - [ERC-20 Tokens Overview](#erc-20-tokens-overview)
    - [Importance of the ERC-20 Token Standard](#importance-of-the-erc-20-token-standard)
    - [ERC-20 Token Smart Contract](#erc-20-token-smart-contract)
    - [ERC-20 Token Interface](#erc-20-token-interface)
    - [ERC-20 Data Structures](#erc-20-data-structures)
    - [ERC-20 ``transfer``](#erc-20-transfer)
    - [Suggested Reading](#suggested-reading-2)
    - [Conclusion](#conclusion-2)
1. [Send ERC20s to Contracts](#send-erc20s-to-contracts)

### Solidity Challenges
#### Solidity Practice
- We've covered some of the core data types, functions and structs in Solidity. Now it's time to practice and apply these concepts through code challenges!
- These challenges will help you practice:
    - sending and receiving ether in smart contracts via ``payable`` methods and the ``.call`` syntax
    - control flow in Solidity: loops, conditionals and revert statements
    - data structures you just learned: mappings, arrays and structs
    - using timestamps to enable functions after some time has passed
#### Need Help?
- If you get stuck be sure to check out some resources along the way!
- The Solidity Documentation: https://docs.soliditylang.org/en/v0.8.4/
    - **HINT**: *we recommend opening up the Solidity docs in a ***new tab*** so it's always handy! True devs live by documentation* 
- Alchemy Docs: https://docs.alchemy.com/

### Multi-Signature Contracts
#### Multi-Sigs Overview
- A multi-signature contract is a smart contract designed so that multiple signatures from different addresses are needed for a transaction to be executed.
- They are commonly used as wallets.
- Yep, you heard that right... multi-sigs are smart contracts that are used as wallets and this triggers a wide variety of use cases. Let's dig in...

#### Multi-Sig Utility
- A multi-signature contract acts as a "wallet" as it can hold and transfer funds.
- It is called "multi-sig" because it typically needs greater than one signatures to approve any wallet activity such as transferring funds out. S
- Since multi-sigs are powered by multiple keys, they avoid a single point of failure, which makes it significantly harder for funds to be compromised.
    - This design provides a higher degree of security against lost or compromised keys.

#### No Single Point of Failure
- Consider the typical EOA, controlled by an external actor (ie. someone outside the blockchain, typically humans):
    ![EOA](https://res.cloudinary.com/divzjiip8/image/upload/v1672905020/alchemyu/Untitled_15.png)
    - An EOA directly controls an address and any funds associated to it because the external actor has direct ownership over the private key needed to sign and authorize transactions on the Ethereum network.
    - In certain cases, this is considered a single point of failure.
        - Why? Well, the external actor's private key could become compromised by a hacker via phishing or physically stolen!
        - Even as bad, the private key could be lost by the external actor, meaning the direct control over an address's balance no longer exists.
> Taking this opportunity to highlight the importance of good private key security! Make sure you NEVER share your private keys with anyone... ever. Private keys are something that only you should ever see and be in control of. ⚠️ Take some time soon to make sure your key security details are all safe and accounted for!
- Now, let's see what a multi-signature wallet that requires 2-of-3 confirmations in order to send funds looks like:
    ![Multi-Sig](https://res.cloudinary.com/divzjiip8/image/upload/v1672906425/alchemyu/Untitled_17.png)
    - In a multi-sig wallet setup, multiple keys are required to approve a transaction.
        - In the diagram above, the smart contract requires 2-of-3 keys signatures in order to approve and send a transaction to the Ethereum network.
    - With this setup, it doesn’t matter whether one individual loses their key, as there will be other individuals that can approve transactions, kick out the compromised key and re-add the compromised user under a new address. Boom!
    - Splitting responsibility of ownership of an address and its funds between multiple people means the multi-sig wallet is secure against a single key being the single point of failure.
        - Even if there is a malicious party in the multi-sig contract, they would need to corrupt a majority of the holders to compromise the wallet entirely.

#### Multi-Sig Contract Wallet Use Cases
- Here are a few use cases that can be powered by a multi-signature smart contract wallet:
    1. **Families**: Inheritance, Wills, Approved Expenditure of House Expenses
    1. **Businesses/Startups**: Business Expenses, Treasury Management, Embezzlement Protection
    1. **Teams/Organizations**: Team Jerseys, Travel Expenses
    - These are just a few for you to think about and maybe expand upon... thanks to multi-signature contracts, all of these groups are empowered to manage their finances in a more secure and transparent manner.

#### Gnosis Safe
- [Gnosis Safe](https://gnosis-safe.io/) is a multi-signature smart contract instance deployer running on Ethereum that requires a minimum number of people to approve a transaction before it can occur (M-of-N).
> Fun challenge: go down the rabbit hole and research Gnosis Safe! Then, try to deploy you own multi-sig contract to the Göerli testnet... 👀 Make sure to add your AU buddies as co-signers on the contract!

#### Suggested Reading
- [Introduction to Multi-Sig Contracts](https://medium.com/mycrypto/introduction-to-multisig-contracts-33d5b25134b2)
- [What is Gnosis Safe?](https://help.gnosis-safe.io/en/articles/3876456-what-is-gnosis-safe)
- [Getting Started with Gnosis Safe](https://gnosis-safe.io/#getting-started)

#### Conclusion
- It is super important to consider your situation and decide what type of wallet setup is best for you.
    - If you are a group that manages funds, like a startup, a multi-sig might be the way to go - it will not only make your funds safer but increase the transparency and trustlessness of your organization!
- Are you ready for more multi-sigs? We LOVE multi-sigs... which is why the coding tutorial covering them is the longest one in all of AU... good luck!

### Smart Contract Inheritance
#### Inheritance Overview
- As with many object-oriented languages, Solidity includes inheritance as a feature.
- Inheritance means that you can create an object with some values/methods and use it as a base for other objects.
- In Solidity, the objects we're referring to are contracts and interfaces.
    - We can write a contract with state variables and functions.
    - Then we can create contracts that inherit those variables and functions.
    - These derived contracts can then choose to add behavior as necessary.
- Smart contracts can inherit other contract by using the is keyword.
    - More specifically, a contract that inherits is the child and the inheritor is the parent.
    - Using the is keyword in Solidity establishes a smart contract parent-to-child chain.
    - So whenever you think of inheritance, just think of the infamous father-son duo: Draco and Lucius Malfoy!

#### Inheritance in Computer Science
![Inheritance CS](https://res.cloudinary.com/divzjiip8/image/upload/v1672806772/alchemyu/Untitled_7.png)
- **Inheritance** allows programmers to create classes that are built upon existing classes, to specify a new implementation while maintaining the same behaviors.
- As in the illustration above, we start with the parent class called Animal, which contains some data and has some "base" or "default" behaviors such as move() (all or most animals can move!) and eat() (all or most animals eat!).
- Then we have the child class called Dog that "inherits" (symbolized by the arrow pointing downward) the Animal parent class.
    - A dog is-an animal!
    - A dog has all the base behaviors and data that an animal has (because it is an animal).
> Notice the important keyword: ``is``!
- Let's break down all the labels on the illustration:
- **parent class**: ``Animal`` is the parent class of ``Dog`` (relative parent! If there is no ``Dog`` to inherit to, it is simply just a class!)
> Parent classes are often times also referred to as **base classes**.
- **overriden method**: ``move()`` is a method that ``Dog`` inherits but **overwrites**!
    - If a method is overriden, that means the child class implements it different.
    - A dog is an animal so it moves, but it moves different to other animals.
- **inherited method**: ``eat()`` is an inherited method from a non-pictured parent class of ``Animal``. Every living being eats. So the the parent class that ``Animal`` inherits from could be called ``LivingBeing``.
- **child class**: also referred to as a **subclass**, this is simply the class inheriting from a parent. This is the Draco to the Lucius Malfoy.
- **overriding method**: as covered three terms up, this is the method that the ``Dog`` child class inherits but overrides. Dogs move different to all animals!
- Keep these core concepts in mind as we study inheritance in Solidity below.
    - These concepts work the **exact same** in Solidity... but instead of classes, just use contracts!

#### Inheritance in Solidity
- Contracts can **inherit** other contracts by using the ``is`` keyword.
![is](https://res.cloudinary.com/divzjiip8/image/upload/v1672810254/alchemyu/Untitled_8.png)
- Just as illustrated in the diagram above, the syntax to establish inheritance between smart contracts in Solidity is to simply use the ``is`` keyword in the child contract - which creates an explicit pointer to the parent contract:
    ```solidity
    contract A {

    }

    contract B is A {

    }
    ```
- In this case ``Contract A`` is the parent contract, often times referred to as the **base contract** whereas ``Contract B`` is the child contract, often referred to as the **derived contract**. Let's break down the different types of smart contract inheritance in Solidity.
> The term "derives" is one you'll hear a lot! A contract derives another contract if it inherits from it. Just like a child derives features from a parent!

#### Single Inheritance
![single](https://res.cloudinary.com/divzjiip8/image/upload/v1672810254/alchemyu/Untitled_8.png)
- **Single inheritance** helps in inheriting the variables, functions, modifiers, and events of base contracts into the derived contract.
    - This is the exact same diagram as was introduced above.

#### Multi-Level Inheritance
![multi](https://res.cloudinary.com/divzjiip8/image/upload/v1672815060/alchemyu/Untitled_9.png)
- **Multi-level inheritance** is very similar to single inheritance; however, instead of just a single parent-child relationship, there are multiple levels of parent-child relationships.
    - This is what is referred to as a **smart contract inheritance chain**.
    - In this case, ``Contract A`` is the **base contract** as it is the contract all other contracts inherit from.

#### Hierarchical Inheritance
- [Hierarchical](https://res.cloudinary.com/divzjiip8/image/upload/v1672815280/alchemyu/Untitled_10.png)
- **Hierarchical inheritance** is again similar to simple inheritance. Here, however, a single contract acts as a base contract for multiple derived contracts.
    - ``Contract B`` and ``Contract C``, in this case, act as siblings but are not interconnected in any way other than that.

#### Inheritance Use Cases
- Now that we've covered smart contract inheritance at a high level, let's dive into some code-specific use cases.
    - Smart contract inheritance is very useful because it allows us to bring in existing code, variables and functions into any contract we write; all we need to do is use the ``is`` keyword.
> Inheritance is a great way to follow the [DRY (Don't Repeat Yourself) principle of software development!](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 💯

#### Ownable
- Have you heard of [OpenZeppelin](https://www.openzeppelin.com/) before?
    - They are a company that produces industry-standard smart contracts.
    - This means they develop and deploy smart contracts that are so used, audited and stress-tested that they become industry standards.
- One such standard contract is ``Ownable.sol``. Let's take a look at some parts of it:
```solidity
contract Ownable {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
```
> Read the [full documentation on OpenZeppelin Ownable](https://docs.openzeppelin.com/contracts/2.x/api/ownership#Ownable) if you want to explore further into contract access control.
- The above ``Ownable`` contract carries functionality specific to access control of a smart contract. Out of this contract, we get:
    - a variable of type ``address`` called ``owner``
    - a ``constructor`` that declares the owner is equal to whoever deploys the contract
    - a ``modifier`` that can be placed on functions to make sure only whoever is the current ``owner`` can proceed
- ``MyContract`` has some simplistic functionality, like keeping track of a uint state variable:
    ``` solidity
    contract MyContract {
        uint public x = 1337;

        function changeNumber(uint _x) public {
            x = _x;
        }
    }
    ```
- All right easy enough, it's pretty bare though.
    - And it's not very secure.
    - The changeNumber() function is marked public, meaning anyone can change our state.
    - We don't want that.
    - We want to implement access control.
    - But wait... at this point, you know about smart contract inheritance!
    - Why not just inherit the access control functionality from the OpenZeppelin Ownable contract we looked at above?!
    - Like so:
    ```solidity
    contract MyContract is Ownable {
        uint public x = 1337;

        function changeNumber(uint _x) public onlyOwner {
            x = _x;
        }
    }
    ```
    - We successfully inherited from ``Ownable``, meaning we are able to access all the variables (``owner`` of type ``address``, ).
- **All inheritance does is LITERALLY copy-paste the code of the parent contract into the child contract**. That's it!
- Thanks to ``MyContract`` inheriting ``Ownable``, we now have access to the ``onlyOwner`` modifier, without needing to write it from scratch.
> Writing from scratch is not bad! But you should know when to rely on battle-tested code and when to write your own.
- So you don't need to worry about writing access control functionality from the ground up!
    - You can use a fully audited industry-standard contract to abstract that away from you.
    - This gives you more time to build the dApp of the future! 🚀

#### Multiple Inheritance
- Ok, so your MyContract now has the powers of the OpenZeppelin Ownable.
    - Cool! What if you were trying to create your very own token?
##### Token
- Imagine we had a very simple and generic Token contract:
    ```solidity
    contract Token {
        mapping(address => uint) balances;
    }
    ```
    - This Token contract is simple: it just keeps track of the balance of users by an address.
- Let's now use that Token to create our own token:
    ```solidity
    contract MyToken is Token {
        function mint(uint _amount) public {
            balances[msg.sender] += amount;
        }
    }
    ```
    - Token created!
        - What if we want to add access control checks to MyToken?
        - We can do so using also inherit from the same Ownable contract we used above!
- By using **multiple inheritance**, we can power our ``MyToken`` with both the generic ``Token`` AND ``Ownable`` (and any other contract you want to inherit from!).
```solidity
contract MyToken is Token, Ownable {
    function mint(uint _amount) public onlyOwner {
        balances[msg.sender] += amount;
    }
}
```
- Now our ``MyToken`` inherits the ``onlyOwner`` modifier from ``Ownable`` - awesome!
- This is what our current contract architecture looks like, thanks to multiple inheritance:
![multitoken](https://res.cloudinary.com/divzjiip8/image/upload/v1672877672/alchemyu/Untitled_12.png)

#### Solidity Inheritance - Function Syntax
##### ``virtual`` Keyword
- A function that is going to be overriden by a child contract must be declared as **virtual**:
```solidity
function foo() public pure virtual returns (uint) {
    return 10;
}
```

##### ``override`` Keyword
- A function that is going to override a parent function must use the keyword **override**:
```solidity
function foo() public pure override returns (uint) {
    return 15;
}
```

#### NFT Use Case
- Here's a clear example of an NFT base contract that gets extended via inheritance.
    - In order to **override** functions of a base contract in Solidity, you must use two keywords: ``virtual`` and ``override``, like so:
    ```solidity
    contract NFT is Ownable {
        function transfer(address _recipient) virtual public onlyOwner {
            owner = recipient;
        }
    }

    contract TimeLockedNFT is NFT {
        uint lastTransfer;

        function transfer(address _recipient) override public onlyOwner {
            // cannot transfer if last transfer was within 10 days
            require(lastTransfer < block.timestamp - 10 days);
            owner = _recipient;
            lastTransfer = block.timestamp;
        }
    }
    ```
    - Notice the use of ``virtual`` on the base function and ``override`` for the new functionality.

#### Suggested Reading
- [Solidity and OOP](https://medium.com/coinmonks/solidity-and-object-oriented-programming-oop-191f8deb8316)
- [Solidity by Example - Inheritance](https://solidity-by-example.org/inheritance/)
- [Calling ``super`` Class](https://ethereum.stackexchange.com/questions/90243/calling-super-class-external-functions)

#### Conclusion
- The big takeaways for inheritance in Solidity is:
    - following the DRY (Don't Repeat Yourself!) principle of software development
    - you can always use a base functionality of a contract then customize it with your own features using the ``virtual``-``override`` pattern seen above

### ERC-20 Tokens
#### ERC-20 Tokens Overview
- An ERC-20 token is a representation of some sort of asset on the Ethereum network. These could be anything:
    - shares in a company
    - reward system points
    - voting rights
    - cryptocurrency
    - lottery tickets
    - on-chain Chuck E Cheese tokens
    - anything you can think of!
- This is what has made Ethereum a popular choice for many different use cases across industries - anyone can tokenize any asset.

#### Importance of the ERC-20 Token Standard
- A key point to understand here is that ERC-20 is a **technical standard**!
- Can you imagine the chaos it would be if every time someone wanted to create a new token, they would create a new variation, containing different variables and methods, every time?
    - This would be the equivalent of creating a different electrical plug 🔌 every time you created a new consumer appliance (ie. microwaves, toasters, etc).
- The main use of the ERC-20 standard is to increase compatibility of the ecosystem.
    - Exchanges like Uniswap are then able to build incredibly powerful applications because they create infrastructure that supports the ERC-20 interface; this then triggers developers who use the ERC-20 standard to develop, instant compatibility with Uniswap and many other dApps!
    - 🤝 Integration otherwise would be a nightmare.

#### ERC-20 Token Smart Contract
- At the base level, an ERC-20 token smart contract simply uses a ``mapping`` to keep track of **fungible tokens**: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them.
> This makes ERC-20 tokens useful for things like a medium of exchange currency, voting rights, staking, and more...
- In the last section, we also defined a simple ``Token`` contract:
```solidity
contract Token {
    mapping(address => uint) public balances;
}
```
- That's easy enough and as we covered in 5.1 - Mappings, the $DAI smart contract (which follows the ERC-20 standard!) is basically powered by a mapping that looks exactly the same.

#### ERC-20 Token Interface
- As we covered above, ERC-20 defines a common interface so that any application can use them in a standard way.
- This simplifies and eases developers’ tasks, because they can proceed with their work, knowing that each and every new project won’t need to be redone every time a new token is released, as long as the token follows the rules.
> This means you can build an app with full knowledge of the ERC-20 token standard and it immediately becomes compatible with any users and builders that are also using ERC-20!
- The interface consists of a number of functions that must be present in every implementation of the standard, as well as some optional.
- An ERC-20-compliant token contract must provide at least the following:
    - **name**, **symbol**, and **decimals** are all optional fields
    - **totalSupply** defines the current circulating supply of the tokens
    - **balanceOf** will return the balance for a particular user
    - **transfer** which is the bread and butter, transfer from one account to another
    - **approve**, **transferFrom** and **allowance** are methods for other contracts moving your funds
- In solidity, the ERC-20 interface looks like this:
```solidity
pragma solidity 0.8.4;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```
- In Solidity, you can inherit an interface into your own smart contract.
    - Inheriting an interface means you must define all the methods declare on the interface.
    - This means you can create an ERC-20 compatible smart contract in a flash by simply inheriting the interface via the is keyword.
    - ⚡️ Here is an example of a sample contract inheriting the interface displayed above:
    ```solidity
    contract MyContract is IERC20 {
        // BOOM, your contract is ERC-20 compatible!
    }
    ```
#### ERC-20 Data Structures
- There are two important data structures used by the ERC-20 token standard that we should review:
    1. ``balances``: ``mapping`` of token balances, by owner. Each transfer is a deduction from one balance and an addition to another balance.
    1. ``allowances``: ``mapping`` of allowances/delegate spending. This is a nested mapping in which the primary key is the address of the token owner which maps to a spender address and amount delegated to spend.
> The ``allowances`` mapping will be further covered in a later section!

#### ERC-20 ``transfer``
- In ERC-20 compatible smart contracts, there are two ways to change balances:
    1. ``transfer``: A call to the ``transfer`` method is straightforward call to the contract’s transfer function, takes just one simple transaction.
    1. ``approve-transferFrom``: This way of transferring tokens is covered further in the next section!

#### Suggested Reading
- [OpenZeppelin ERC-20 Standard](https://docs.openzeppelin.com/contracts/3.x/erc20)
- [Top Tokens on Etherscan](https://etherscan.io/tokens)
- [Understand the ERC-20 Token Smart Contract](https://ethereum.org/en/developers/tutorials/understand-the-erc-20-token-smart-contract/)
- Leg up on next section: [difference between sending tokens using transfer and approve-transferFrom](https://ethereum.stackexchange.com/questions/46457/send-tokens-using-approve-and-transferfrom-vs-only-transfer)
- [Mastering Ethereum - Chapter 10: Tokens](https://github.com/ethereumbook/ethereumbook/blob/develop/10tokens.asciidoc)

#### Conclusion
- Thanks to standards like ERC-20, the developer ecosystem can build compatibility in a flash.
    - ⚡️ Are you ready to code up the ERC-20 token standard from scratch?
    - Not just that, you'll also be deploying your very own token to the Göerli test network.

