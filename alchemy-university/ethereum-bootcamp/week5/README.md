## Solidity

### Table of Contents
1. [Mappings](#mappings)
    - [Mappings in Solidity](#mappings-in-solidity)
    - [Hash Table Data Structures Are Efficient](#hash-table-data-structures-are-efficient)
    - [Mappings](#mappings-1)
    - [Useful for ``address`` Association](#useful-for-address-association)
    - [Accessing Value Types From A Mapping](#accessing-value-types-from-a-mapping)
    - [Mappings in Production: ERC-20 Tokens](#mappings-in-production-erc-20-tokens)
    - [Other usecases for mappings?](#other-usecases-for-mappings?)
    - [Nested Mappings](#nested-mappings)
    - [Suggested Reading](#suggested-reading)
2. [Events](#events)
    - [Events](#events-1)
    - [Defining Events](#defining-events)
    - [Emitting Events](#emitting-events)
    - [Listening to Events](#listening-to-events)
    - [Finding Events in the Logs of a Transaction Receipt](#finding-events-in-the-logs-of-a-transaction-receipt)
    - [Suggested Reading](#suggested-reading-1)
    - [Questions](#questions)
    - [Conclusion](#conclusion)
3. [Escrow Contract](#escrow-contract)
    - [What is an Escrow](#what-is-an-escrow)
    - [Escrow Smart Contract](#escrow-smart-contract)
4. [Reference Types: Arrays & Structs](#reference-types-arrays-&-structs)
    - [Solidity Reference Types](#solidity-reference-types)
    - [Arrays](#arrays)
        - [What Are Dynamic & Fixed Arrays?](#what-are-dynamic-&-fixed-arrays?)
        - [Storage Arrays](#storage-arrays)
    - [Structs](#structs)
        - [Struct Use Cases: Library Record Keeping](#struct-use-cases-library-record-keeping)
        - [Suggested Reading](#suggested-reading)
        - [Conclusion](#conclusion-1)

### Mappings
- [Hardhat](https://hardhat.org/) arrived at a timely time because we were just learning about the many artifacts produced out of the Solidity compilation process, mainly two that we care about as devs: the ABI and the contract bytecode.
    - Thanks to Hardhat, we are abstracted away from those artifacts to a level where it is much easier to work with them!
- If you don't feel super comfortable with Hardhat yet (as we have many further activities that use it), don't worry BUT this is definitely one we would encourage you to go back and really refresh on.

#### Mappings in Solidity
- Have you ever heard of a [hash table](https://en.wikipedia.org/wiki/Hash_table)?
    - If you've taken one or two computer science courses, chances are you have!
    - If not, don't worry, you're in the right place. Let's jump in... 🛩
- A **hash table** is a data structure that implements an associative array (also referred to as a "dictionary").
    - In an associative array, data is stored as a collection of key-value pairs.
    - The position of the data within the array is determined by applying a hashing algorithm to the key.
    - This can be clearly seen in the diagram below:
        ![image](https://static.javatpoint.com/ds/images/hash-table.png)
        - As seen above, a key represents some data to be stored in the hash table data structure. That key is fed into a hash function which produces a hash value. That hash value dictates the index where the data, pertaining to the key, will be stored in the hash table. 🧩
- Any time you "look up" (hence why hash tables are referred to as "dictionary" data structures!) a value by key, you will get whatever value is stored in the hash table back.
    - Hash functions are deterministic, so you will always get the same value back as long as you provide the same key.
> Oh, you thought this was purely a web3 bootcamp? Nope! We're diving into core computer science concepts because web3 uses so many of them! 🖥🧪 It's also good for you to know them for general software development, web3 or not. 🤝
- As in the diagram above, hash tables are a type of data structure that uses hash functions to store "keys" (ie. data) in a structured and deterministic way.

#### Hash Table Data Structures Are Efficient
- Hash tables enable very efficient searching, in fact, they enable the "holy grail" O(1) search time.
    - Hash tables do not require a brute force search or a for loop to look up a value thanks to the deterministic nature of hash functions!
    - 🐐 You can just say, gimme whatever value is held at this key and the hash table data structure will comply. ⚡️
![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671583428/alchemyu/Screen_Shot_2022-12-20_at_4.43.43_PM.png)
- A cartoonist hit the nail on the head with the above drawing!
    - Hash tables enable the same O(1) search efficiency as these backpacks hung on labelled hooks! 👏

#### Mappings
- In Solidity, hash tables are called mappings. T
    - hey function pretty much the exact same as hash tables. 🤷
- Mappings act as hash tables which consist of key types and corresponding value type pairs.
- They are defined like any other variable type in Solidity:
    ```solidity
    mapping(_KeyType => _ValueType) public mappingName;
    ```
#### Useful for ``address`` Association
- Solidity mappings are particularly useful for address association.
- Thanks to mappings, you can associate an Ethereum address to a specific value. Here's a few examples we could use address association for:
*Keeping track of how many sodas a user has purchased from a vending machine smart contract:*
    ```solidity
    mapping(address => uint) public sodasPurchased;
    ```
- The above code snippet simply says:
```Oy, Solidity! Create a hash table that "maps" an address type to a uint type. This will help me create an organized table view of how many sodas a specific Ethereum address purchases, and I will update this table any time any address calls the purchaseSoda() function. Oy, and make it public because I want anyone in the world to be able to query this mapping!```
> Oof, this is such a fantastic data structure that enables us to do so much cool stuff! Let's keep going... 🏃‍♂️🏃‍♀️

#### Accessing Value Types From A Mapping
- Let's take a look at Solidity snippets that use the ``mapping`` data structure... 🗺
- You can create a specific function ``numSodasPerUser`` and pass in the key to extract the value associated with it (using the same ``sodasPurchased`` mapping declared in the example above):
    ```solidity
    function numSodasPerUser(address _userAddress) public returns (uint) {
        return sodasPurchased[_userAddress];
    }
    ```
    - The above function numSodasPerUser takes one argument of address type.
    - Anyone can call this function because it is public.
    - Simple enough, you feed it any Ethereum address and it will "look up" that address in the sodasPurchased mapping, returning the value held in the mapping for that key.
- If your EOA has purchased ``5`` sodas (by calling the ``purchaseSoda()`` five times!), that record should be held in the ``sodasPurchased`` function. Wondering what that function looks like? Or how updating the mapping works? Wonder no further:
    ```solidity
    function purchaseSoda() public {
        // we can't dispense a soda if there are none left!
        require(numSodas > 1, "Sodas must be in stock!");
        // update the mapping to reflect this msg.sender has purchased another soda
        sodasPurchased[msg.sender] += 1;
        // update the numSodas state variable to reflect there is one less soda in the vending machine smart contract
        numSodas--;
    }
    ```
#### Mappings in Production: [ERC-20 Tokens](https://docs.openzeppelin.com/contracts/3.x/erc20)
- The above examples seem a little silly no?
    - Why would we want to keep track of how many sodas a user has purchased from a vending machine smart contract?!
    - Don't worry, that example is just for learning purposes... let's look at an application of ``mapping`` that is core to the Ethereum ecosystem: [ERC-20 tokens](https://solidity-by-example.org/app/erc20/!
- That's right! ERC-20 tokens that we've all probably used or know of (ie. $USDC, $DAI, $UNI, $AAVE, etc) use a mapping to support core functionality.
    - Can you already guess what use-case mappings help ERC-20 contracts with? 💲
- ERC-20 tokens use a balanceOf mapping to keep track of user balances in an ERC-20 smart contract.
> Just like our simple vending machine smart contract example used a sodasPurchased mapping! 🤯
- Take a look at the [$DAI smart contract on Ethereum mainnet](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#code).
- ``Line 90`` of the $DAI smart contract declares a ``balanceOf`` mapping:
    ```solidity
    mapping (address => uint) public balanceOf;
    ```
#### Other Use Cases For Mappings?
- Yep, tons! Really anything that requires a 1-to-1 tracking based on key-value pairings is up for grabs. Here's a few more written in Solidity:
    ```solidity
    mapping(address => uint) public balanceOf; // ERC-20s
    mapping(address => bool) public hasVoted; // DAOs
    mapping(uint => bool) public isMember; // DAOs
    mapping(string => uint) public userZipCode; // general info tracking
    ```
- Maybe you are writing a smart contract that will power some sort of on-chain video game? 🎮
    - You'd have to keep track of what level a user is to unlock further features inside the game, like this quick high-level diagram:
    ![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671580133/alchemyu/Screen_Shot_2022-12-20_at_3.48.06_PM.png)
- In Solidity, you can just implement a ``mapping`` to keep track of ``userLevel``:
    ```solidity
    mapping(address => uint) public userLevel;
    ```

#### Nested Mappings
- In cases where multiple relationships must be kept track of (shoutout to all you SQL geeks!), Solidity lets you do so via a **nested mapping**, which are declared exactly the same as regular ``mapping`` but nested:
    ```solidity
    mapping(address => mapping(uint => bool)) public votesPerProposal;
    ```
- The above nested mapping is a perfect use case, for one, for DAOs.
    - DAOs must typically keep track of many proposals and whether addresses vote for or against that specific proposal.
- The nested mapping helps us keep track of all that record in one single place! 💯
- Notice it maps an ``address`` (the DAO voter) type to a ``mapping`` that itself maps a ``uint`` (the proposal id #) to a ``bool`` (whether the DAO voter supports that specific proposal).
> Think of a relational database table! A user can link to one table which links to more tables… 🔗

#### Suggested Reading
- [Mappings explained in under 2 minutes](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e)
- [Solidity docs - mapping](https://docs.soliditylang.org/en/v0.8.4/internals/layout_in_storage.html)
- [OpenZeppelin ERC-20 Standard](https://docs.openzeppelin.com/contracts/3.x/erc20)
- [Solidity by Example - Mappings](https://solidity-by-example.org/mapping/)
- [Arrays vs Mappings](https://ethereum.stackexchange.com/questions/2592/store-data-in-mapping-vs-array)
- [Approve-Transfer From Flow Explained - this is specific to ERC-20 tokens!](https://ethereum.stackexchange.com/questions/46457/send-tokens-using-approve-and-transferfrom-vs-only-transfer)

#### Conclusion
- Mappings are super useful data structures in Solidity.
- Developers are able to keep track of records in an organized and efficient manner.
- ``address`` association is particularly powerful, since developers can now code in specific record-keeping around any Ethereum address.


### Events

#### Events
- **Events** are the way Solidity and the EVM provide developers with logging functionality used to write information to a data structure on the blockchain that lives outside of smart contracts' storage variables.
- Events are an abstraction on top of th EVM's low-level logging functionality, opcodes ``LOG0`` to ``LOG4``.
    - The specific opcode used will depend on the number of **topics** the event declares using the ``indexed`` keyword.
    - A topic is just a variable that we want to be included in the event and tells Solidity we want to be able to filter on the variable as well.
- The low-level logs are stored in the transaction receipt of the transcaction under the transaction receipts trie.
- **Logs are written by the smart contract when the contract emits events, but these logs cannot be ready by the smart contract**.
    - The inaccessability of the logs allows developers to store data on-chain that is more searchable and gas efficient than saving data to the smart contract's storage variables.

#### Defining Events
- Events are defined in smart contracts using the ``event`` keyword.
    - Here is the [transfer event from the ERC20 smart contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/IERC20.sol#L16).
    - It is emitted whenever tokens are transferred from 1 account to another.
    ```solidity
    interface IERC20 {
        event Transfer(address indexed from, address indexed to, uint256 value);
    }
    ```
- Here we can see the different components of an event:
    - the event's name ``Transfer``
    - the event's topics ``from`` (sender's address), ``to`` (the receiver's address), ``value`` (the amount transferred)
    - if a variable in the event is not marked as ``indexed`` it will be included when the event is emitted, but code listening on the event will not be ablel to filter on non-indexed varables (aka **topics**).
- Whenever a ``Transfer`` event is emitted, the ``from``, ``to`` and ``value`` data will be contained in the event.

#### Emitting Events
- Once an event has been defined we can emit the event from the smart contract.
    - Continuing on from the ERC20 smart contract let's see where the [``Transfer`` event is emitted](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/ERC20.sol#L226-L248).
    ```solidity
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
      // perform various checks, such as the `from` address has `amount` of tokens

      // do the transfer of tokens
      unchecked {
          _balances[from] = fromBalance - amount;
          _balances[to] += amount;
      }

      // the Transfer event is emitted here
      emit Transfer(from, to, amount);

      // perform various cleanup
    }
    ```

#### Listening to Events
- If you remember the definition of an Event from above, smart contracts can write events, but not read events.
- So how do we listen/read to data that smart contracts cannot read?
- We listen to and read events from code connected to a provider.
- From what we've learned so far in this course we could do this in JS code using an ``ethers`` provider to connect to a contract and listen to transfer events and do something with the event data.
```js
 const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new Contract(erc20TokenAddress, ERC20_ABI, provider);

  contract.on('Transfer', async (from, to, amount, data) => {
    console.log('Transfer event emitted. {from, to, amount, data}');
  });
```
- Here we just simply print out the data of the event.

#### Finding Events in the Logs of a Transaction Receipt
- In the above section we used the higher-level ``ethers`` library to listen to ``Transfer`` events and do something with them when they are emitted.
- Going back to our lessons on Ethereum Nodes and the low-level JSON-RPC endpoints, we could also use ``eth_getLogs`` to get at the same log data.
    - The logs in the screenshot below were reading using [Alchemy's Composer tool](https://dashboard.alchemy.com/composer)
    ![image](https://res.cloudinary.com/divzjiip8/image/upload/v1671696400/Screen_Shot_2022-12-22_at_3.05.20_PM_tubpq2.png)
- By using the lower level ``eth_getLogs`` call you can see that we would need to write the code to loop through all the logs looking for the addresses, and values that we might specifically be interested in.
    - A much less convenient way to do than to use higher-level library like ``ethers``.

#### Suggested Reading
- Solidity docs on [Events and Indexed Topics](https://docs.soliditylang.org/en/v0.8.17/contracts.html#events)
- More details about the [LOG0](https://www.evm.codes/#a0), [LOG1](https://www.evm.codes/#a1), [LOG2](https://www.evm.codes/#a2) and [LOG3](https://www.evm.codes/#a3) opcodes.

#### Questions
**Are events and logs part of the blockchain?**
- Events and logs are stored on the blockchain in transaction receipts
- But they are **not required for blockchain concensus**
- They **are** however verified by the blockchain since transaction receipt hashes are stored inside blocks
**Can you think of any purpose of the LOG0 opcode?**
- LOG0 can be very useful for logging/debugging while building your contracts.

#### Conclusion
- Events are a great way to emit information to the outside world of things happening with the blockchain.
- Emitted events can be found inside the Transaction Receipt of every transaction.

---

### Escrow Contract

---

### Introduction
#### What is an Escrow?
- An [escrow](https://en.wikipedia.org/wiki/Escrow) is a contractual arrangement in which a third party (the stakeholder or escrow agent) receives and disburses money or property for the primary transacting parties, with the disbursement dependent on conditions agreed to by the transacting parties.
- The need for an escrow arises from a buyer/seller relationship:
    - The buyer wants to buy something from the seller, but the seller wants to be paid first.
    - The seller wants to sell something to the buyer, but the buyer wants to be sure that the seller will deliver the item first.
- The escrow agent is a trusted third party that holds the funds until the conditions of the contract are met.
    1. Buyer pays the escrow agent.
    2. Seller delivers the item to the buyer.
    3. Buyer confirms that the item has been received.
    4. Escrow agent releases the funds to the seller.
- This relationship requires a lot of trust placed in the escrow agent.
    - If the escrow agent is malicious they could steal the funds or not release the funds to the seller.
    - The escrow agent can collude with the buyer or seller to steal the funds.
#### Escrow Smart Contract
- An escrow smart contract is a smart contract that holds funds until a certain condition is met replacing the need for a trusted third party.
- The bedrock of a lot of defi protocols are escrow smart contracts.
    - For example, the [Uniswap protocol](https://uniswap.org/) uses an escrow smart contract to hold funds until a trade is completed.
    - The [Maker protocol](https://makerdao.com/en/) uses an escrow smart contract to hold funds until a loan is repaid.
    - [Aave](https://aave.com) uses an escrow smart contract to hold funds until a loan is repaid.
- Centralized finance places trust in corruptible human intermediaries to hold funds.
- Decentralized finance places trust in incorruptible smart contracts to hold funds.
- Escrow contracts are limited by the imagination, and the complexity of the contract is up to the smart contract creator.
    - An indivdual can serve as the escrow.
    - A group of individuals such as a DAO can serve as the escrow.

---

### Reference Types: Arrays & Structs

---

### Solidity Reference Types
- At this point, you are well on your way to becoming a Solidity master. We've looked at the [primitive data types in Solidity](https://solidity-by-example.org/primitives/), such as:
    - ``uint``/``int``
    - ``boolean``
    - ``address``
    - ``enum``
    - ``bytes``
- Primitive data types can also be referred to as "value types".
    - A **value type** stores its data directly in the variable.
- Solidity, like most other object-oriented programming languages, has another type of data for reference-based data types, such as:
    - ``arrays``
    - ``strings``
    - ``structs``
    - ``mappings`` (also reference types, but we've already covered them quite heavily!)
- A ``reference type`` does not store values directly in a variable.
    - Instead, reference types hold a pointer to the address of the data's location.
- If you've ever been in a Java 101 course, you might recognize the above diagram.
    - The primitive types of Java (``int``) hold the data value directly while the reference type (in this case a ``class1`` instance) "point" to the data location, which eventually holds the data value.
- The two main reference types we will cover today are: **arrays** and **structs**. Let's dive in...

### Arrays
- In computer science, an **array** is a data structure consisting of a collection of elements (values or variables), each identified by at least one array index or key.
    - In Solidity, an array can be both of fixed or dynamic size.
> Of course, Solidity arrays function much the same. So from now on, when we say arrays, we mean Solidity arrays!

#### What Are Dynamic & Fixed Arrays?
- The size of **dynamic arrays** are not predefined when they are declared.
    - As elements are systematically added, the size of the dynamic array changes, and during runtime, the actual size of the array will be determined.
- In contrast, **fixed arrays** have a predefined size, and the quantity of elements present in the array should not exceed the size of the array.

#### Storage Arrays
- **Storage arrays** are typically declared as state variables and can be either fixed or dynamic in size.
    - Here's a Solidity code snippet declaring both a fixed and dynamic-sized array in a simple ``MyContract``:
    ```solidity
    contract MyContract {
        // Several ways to initialize an array

        // Dynamic sized array
        uint[] public arr;

        // Fixed sized arrays
        uint[] public arr2 = [1, 2, 3];
        // all elements initialize to 0
        uint[10] public myFixedSizeArr;
    }
    ```
- Both fixed and dynamic sized arrays have access to the ``.length`` array member:
    - ``.length``: returns how many values an array holds per index
- Dynamic storage arrays have the typical array methods available, such as:
    - ``.push()``: used to add an element to the array at the last position
    - ``.pop()``: used to remove an element of the array at the last position
- We won't go super deep into arrays, as they typically follow the same conventions as most other programming languages do.
    - We highlight some key takeaways though:
    1. ⚠️ Be careful with iterating arrays, as that can be costly to your smart contract users!
        - Array iteration is not a recommended pattern for smart contract developers
    2. Review [Solidity by Example](https://solidity-by-example.org/array/) - Arrays for further examples of array members and functionality
- Let's dive into a Solidity-specific data structure, not typically found in other programming languages like arrays are...

### Structs
- Up until now, we've looked at all of the defined data types in Solidity.
    - One super cool feature about Solidity is it allows you to define ***your own custom data type*** 🤯.
- You can define your own custom data type by creating a ``struct``.
    - Struct types are typically used to represent a record, or a grouping of common data.
- The syntax to declare a struct in Solidity resembles an object declaration in JavaScript:
    ```solidity
    struct structName {
        type1 typeName1;
        type2 typeName2;
        type3 typeName3;
    }
    ```
- Super easy! 💯 Let's look at a specific use case for structs to help us further understand the concept..

#### Struct Use Cases: Library Record Keeping
- What if we wanted to have an immutable record of all the library books we cared about?
    - 🤔 Keeping our book records on a centralized server somewhere might not be ideal, since it might be taken down or corrupted by the server admin.
    - In come smart contracts!
- We can create a smart contract called Library and equip it with all the functionality we'd need to perform detailed record keeping for books.
    - For now, we can just work off of a single assumption / user story:
        - For each book record I add to my Library smart contract, I want to keep track of its title, author and some sort of id for internal record-keeping
- The above assumption would mean lines and lines of code... if we didn't have Solidity structs.
- So, let's define a smart contract called Library and define a struct called Book inside its scope.
    - The Book struct should keep track of all the properties we listed in the assumption above:
    ```solidity
    contract Library {

        struct Book {
            string title;
            string author;
            uint bookId;
        }

    }
    ```
- Great! We've got the base setup done.
    - Any further functionality will be structured around this same ``Book`` struct and its properties.
- A ``Book`` struct is specific to one book... so we need a way to keep track of many of the same type... anything ring a bell here?
    - That's right, we can use an array.
    - Let's add it to our ``Library``:
    ```solidity
    contract Library {

        struct Book {
            string title;
            string author;
            uint bookId;
        }

        Book[] public books;
    }
    ```
- Sweet! An array here will make it super easy to keep indexed track of each ``Book`` struct, along with each book's specific properties.
- What if we want to add a book? We can do so with a function ``addBook()``:
    ```solidity
    contract Library {

        struct Book {
            string title;
            string author;
            uint bookId;
        }

        Book[] public books;

        function addBook(string memory _title, string memory _author) public {
            books.push(Book(_title, _author, books.length));
        }
    }
    ```
- Ok, let's break down the ``addBook()`` function real quick:
    - The ``string`` parameters use ``memory``.
        - This is a requirement of Solidity whenever you use reference types as a parameter, you must precede the parameter with either ``memory`` or ``calldata``.
        - This is just telling the Solidity compiler where the data being passed in lives.
        - Since this is an ephemeral call, we are passing in the value from ``memory``.
    - We use ``books.push()`` in order to push a brand new Book struct
    - We initialize the struct by calling it exactly like you would a function: ``Book(_param1, param2, ...)`` - that is the easiest one but you can also initialize structs like so:
        ```solidity
        //kay value mapping
        todos.push(Todo({text: _text, completed: false}));

        // initialize an empty struct in local memory and then update it
        Todo memory todo;
        todo.text = _text;
        ```
- Ok great! We can now add new books to our library and push em to the books array for record-keeping.
    - What if we want to retrieve a book from this record?
    - We can add a simple getter and retrieve based on the bookId:
        ```soldity
        contract Library {

            struct Book {
                string title;
                string author;
                uint bookId;
            }

            Book[] public books;

            function addBook(string memory _title, string memory _author) public {
                books.push(Book(_title, _author, books.length));
            }

            function get(uint _bookId) public view returns (string memory _title, string memory _author) {
                return(books[_bookId].title, books[_bookId].author);
            }
        }
        ```
        - Awesome! Now anyone can pass in a book id and the smart contract will return that book id's title and author!
- One final function to add before we wrap up the awesomeness of structs is ``update()``, that way we can update a book title or author for any reason (mainly for an easy example, since we probably wouldn't want to update such a record after it's been sealed!).
- **One more thing**... notice how all of our functions are ``public``?
    - This means anyone could mess with our cool library and we don't want that!
- Let's make it so that each ``Book`` holds an ``address`` property, and ONLY that specific address can perform certain changes in the contract:
> Be careful! Since we are adding a new property to the Book struct, we will have to change any previous calls to Book to also account for it!
```solidity
contract Library {

    struct Book {
        string title;
        string author;
        uint bookId;
        address registrant;
    }

    Book[] public books;

    function addBook(string memory _title, string memory _author) public {
        // whoever adds a book is the registrant
        books.push(Book(_title, _author, books.length, msg.sender));
    }

    function get(uint _bookId) public views returns (string memory _title, string memory _author) {
        return(books[_bookId].title, books[_bookId].author)
    }

    function update(uint _bookId, string memory _newTitle, string memory _newAuthor) public {
        // protect book records by making function available only to registrant
        require(msg.sender == books[_bookId].registrant, 'You must have one that added the book if you want to change the record');
        books[_bookId].title = _newTitle;
        books[_bookId].author = _newAuthor;
    }
}
```
- Amazing. We've just coded a whole contract that has soooo much functionality in so few lines!
    - Plus, it protects our records by checking the msg.sender in the update() function!
#### Suggested Reading
- [Solidity by Example - Structs](https://solidity-by-example.org/structs/)
- [Open Source Project By AU Student](https://github.com/chiranz/rps_game/blob/main/contracts/RPSGame.sol)

#### Conclusion
- Structs are super useful in Solidity.
    - They are a custom data type... so they are fitting for any custom record-keeping needs you might think of!
    - Another example would be a ``Player`` struct that keeps track of that player's ``address``, ``level``, etc...
> Want to see a 15-minute run-through of Structs using the same Library example as above? [Here's Al covering Structs at DevConnect 2022 Amsterdam](https://youtu.be/NuGF1wsYxQA?t=9849)