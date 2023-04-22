## ERC20

---
### Table of Contents
1. [ERC-20 Token](#erc-20-token)
    - [ERC-20 Token Standar](#erc-20-token-standard)
    - [This Tutorial](#this-tutorial)
1. [Total Supply](#total-supply)
    - [ERC20 Tokens](#erc20-tokens)

### ERC-20 Token
#### ERC-20 Token Standard
- The first major application of the Ethereum blockchain mentioned in the white paper was token systems. 
    - With the EVM and access to a compatible high-level language building a new token can be done in a few lines of code! 
- When Ethereum launched it was quickly realized that a standard contract interface for tokens would be tremendously beneficial. 
    - In that way, systems could interact with any token in the same way. 
    - They wouldn't have to worry about if one token contract had a function send and the other function called it transfer (or the even deeper discrepancies that could occur).
> The term **interface** here could refer to the actual interface object, or more generally, it can refer to any set of public facing functions, like an API! These are the functions you can access from the outside. In web applications the CSS/HTML is generally referred to as the **User Interface** because it is what the user sees and interacts with.
- The ERC-20 token standard was proposed as the template for all tokens. 
    - It was accepted in EIP-20 and quickly adopted across the industry! 
    - Most famously, this token standard was used for Initial Coin Offerings or ICOs. 
    - ICOs are essentially public fundraisers for companies to raise money and issue ERC20 tokens in return.
> You may see this contract referred to by both names **EIP20** and **ERC20**. An ERC refers to an application-level standard and generally asks for community input, it stands for **Ethereum Request for Comments**. Once an ERC is refined by the community it is standardized in an EIP which stands for an **Ethereum Improvement Proposal**. See [EIP-1](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md) for further clarification.

#### This Tutorial
- In this tutorial you will build your an ERC20 smart contract! 
    - You will implement a core portion of the functionality compliant with the standard.
> Even after passing the test cases in this lesson **you should not use it for storing real value on the mainnet**. Standard industry practice is to have your smart contracts **audited by professionals**. There are audited contracts available that you can use for your own purposes. For example Open Zeppelin provides many [contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) including [ERC20 Compliant Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v3.0.0-beta.0/contracts/token/ERC20)!

### Total Supply
#### ERC20 Tokens
- In this lesson, you will create a smart contract called a Token smart contract.
    - You can think of tokens like dollars (or any other type of asset).
    - Tokens can be given to other people, they can be lent to other people via allowances, and you can see how many tokens someone owns.
- Each ERC20 token has its own supply which is the total number of the tokens that are in circulation.
    - Tokens can be minted to addresses in any number of creative ways.
    - The majority of the time they are minted to a single address and transferred to a crowdsale contract.
> The term mint here is used to describe the creation of a new token. It was traditionally used to describe the creation of new coins. The origins of this word are quite old, [according to Wikipedia](https://en.wikipedia.org/wiki/Mint_(facility)), it is originally attributed to 269 BC!

#### Your Goal: Token Supply
- Let's create a supply for our token!
1. Create a new public ``uint`` state variable called ``totalSupply``.
1. Leave its value as the default ``uint`` value for now, ``0``, we will change this later!

---

**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
}
```

---

### Configuration
#### Token Configuration
- When you look at a list of ERC20 tokens, like on Etherscan, you'll see each ERC20 token has its own name and symbol associated with it.
- The name is generally its primary identifier, while the symbol is in parentheses.
    - Maker (MKR), for instance, has the name Maker and symbol MKR.
- Each of these tokens will also generally have its own decimals value, indicating the number of places we need to move the decimal to get to the user representation of the token.
- You may notice that some of the tokens listed on Etherscan have similar market capitalizations with wildy different prices.
    - Why is this so?
- Market Capitalization, or market cap for short, is simply the current price for the token multiplied by its total supply.
    - Since many of these tokens have very different totalSupply values, their prices wind up quite different!
> It's interesting to note that while these values are on most ERC20 tokens, they are, in fact, **optional**. An ERC20 token does not need to specify its **name**, **symbol** or **decimals** to adhere to the standard. These values are purely for added usability.

#### Decimals
- Splitting money has always been a problem.
    - Take dollars for instance: one dollar can be split up into one-hundred cents.
    - After cents, there isn't really a way to split dollars physically, so only banks, gas companies, etc. use extra precision because they actually need it.
- In the world of cryptocurrency, splitting money becomes an even bigger problem because the currencies are expected to change dramatically in value.
    - Think about if the dollar exploded in value, and in 5 years, 1 dollar is worth 100 of today's dollars.
    - In that world (provided that our currency isn't changed), one cent would represent 1 dollar, and that would be the smallest quantity that dollars could represent.
    - This is the situation that cryptocurrencies are faced with.
- To account for these issues, ERC20 tokens can have an extra field called **decimals**.
    - This field holds an integer (an 8-bit unsigned integer, to be precise), and it represents the number of decimal places that are tracked by the currency.
- As an example:
    - **$1.03**
    - represents 1 dollar and 3 cents.
    - This is the maximum accuracy that our physical currency (dollars and cents) can represent.
    - After the decimal point, there are only 2 digits, so if the dollar was an ERC20 token, its decimals field would be equal to 2.
- Bitcoin can be tracked out to 8 decimal places like so:
    - **B 2.01020401**
    - It would have a decimals value of 8.
        - The smallest unit of measurement is called a Satoshi which is 0.00000001 bitcoin.
- Ethereum tracks even more decimals and would have a decimals value of 18.
    - The smallest uint of measurement is called Wei which is 0.000000000000000001 ether.
- Most ERC20 tokens follow Ethereum's convention and use a decimals field of 18.

#### Your Goal: Configuration
- Create three public state variables:
    - A ``string name`` - Create any name you'd like with at least 1 character
    - A ``string symbol`` - Create any symbol you'd like with 3 characters
    - A ``uint8 decimals`` - Store 18 in this variable
> Most ERC20 tokens follow the ether standard of having 18 decimals.

---

**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "moonCoin";
    string public symbol = "mnc";
    uint8 public decimals = 18;
}
```

---

### Balances
#### Token Balances
- It's essential for users to be able to see how many tokens they have in our **Token** contract, so that they know how much they can spend.
    - At the moment, there isn't a way for users to see how many tokens they have.

#### Your Goal: Balances
1. Create a mapping which maps an ``address`` to a ``uint256`` value.
    - This will give each address its own balance.
1. Create an external, view function ``balanceOf`` which takes an address and returns the ``uint`` balance corresponding to the address in the mapping.

---

**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "moonCoin";
    string public symbol = "mnc";
    uint8 public decimals = 18;

    mapping(address => uint) balances;

    function balanceOf(address _address)
        external
        view
        returns (uint)
    {
        return balances[_address];
    }
}
```

---

### Minting
- It's time to create our tokens and do the initial distribution!
#### Setting the Supply
- We can set the initial supply based on the number of tokens we want available.
    - This will be the number of whole tokens multiplied by ``10 ** 18`` for the ``18`` decimals we supplied.
- If we only wanted 5 total tokens in circulation it would be ``5 * (10 ** 18)`` or ``5000000000000000000``.
    - We could distribute these 5 tokens with 18 decimal places of precision.
#### Set the Balance
- Depending on the circumstance, tokens can be distributed in different ways:
    - For instance, tokens can be minted as needed, which is useful for an uncapped distribution.
        - This could work for a timed crowdsale or perhaps through a game that requires participation to receive tokens.
- Tokens can also be distributed upfront to a single address.
    - This address is then the sole owner of all the tokens and they can choose how to distribute the tokens as necessary.
    - They can move it all into a crowdfunding contract or they can distribute it manually.
- We're going to go with the latter of the two above approaches!
#### Your Goal: Supply
- Create a constructor which will do two things:
    1. Set the ``totalSupply`` to **1000 tokens**
    1. Set the balance of the contract deployer to be the ``totalSupply``

---

**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "moonCoin";
    string public symbol = "mnc";
    uint8 public decimals = 18;

    mapping(address => uint) balances;

    constructor() {
        totalSupply = 1000 * (10**uint(decimals));
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _address)
        external
        view
        returns (uint)
    {
        return balances[_address];
    }
}
```

---

### Transfer
#### Token Transfer
- Both the balances mapping and the **balanceOf** function can be used to get the balance of a given Ethereum address in the token contract.
- To transfer tokens, the sender's balance should be descreased by the transfer amount.
    - Then, the balance of the recipient of the transfer should be increased by the same amount.
- The balance of the sender can be decreased as follows:
```solidity
contract Token {
    mapping (address => uint256) balances;

    function decreaseBalance(uint256 _value) public {
        balances[msg.sender] -= _value;
    }
}
```
- This function will decrease the balance of the ``msg.sender`` by the specified ``_value``.
#### Your Goal: Transfer
- Create a public function transfer which takes an address for the recipient and a uint for the amount to be transferred.
- Transfer the amount from the function caller to the recipient.
- Return true after a successful transfer.
**Contract Security**
- Ensure that ``msg.sender`` has enough in their balance to send this amount.
    - Otherwise, revert the transaction.

---

**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "moonCoin";
    string public symbol = "mnc";
    uint8 public decimals = 18;

    mapping(address => uint) balances;

    constructor() {
        totalSupply = 1000 * (10**uint(decimals));
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _address)
        external
        view
        returns (uint)
    {
        return balances[_address];
    }

    function transfer(address _recipient, uint _amount)
        public
        returns(bool)
    {
        require(balances[msg.sender]>_amount);
        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        return true;
    }
}
```

---

### Transfer Event
#### Events
- Events give external applications a way to "listen-in" on the happenings inside of the EVM.
    - Events can essentially act as hooks for an application to perform some action.
- An example of a UI listening for changes to our ERC20 Token might be a Decentralized Exchange.
    - It's waiting to see when a transfer has account to or from your account to update your balance.
    - It could subscribe to events on an Ethereum node and then broadcast any changes to the web interface where you balance is displayed.
> To understand **transfer events** on a deeper level check out [Alchemy's Transfers API](https://docs.alchemy.com/reference/transfers-api-quickstart)

#### Your Goal: Transfer Event
- Create an event called ``Transfer`` which takes three arguments in the following order:
    1. The ``address`` that sent the token
    1. The ``address`` that received the token
    1. The ``uint256`` value amount of the token sent
- Then, ``emit`` the event from inside the transfer function with all the appropriate arguments.

---

**SOLUTION**
```solidity
// Tokan.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    uint public totalSupply;
    string public name = "moonCoin";
    string public symbol = "mnc";
    uint8 public decimals = 18;

    mapping(address => uint) balances;

    constructor() {
        totalSupply = 1000 * (10**uint(decimals));
        balances[msg.sender] = totalSupply;
    }

    event Transfer(address _sender, address _reciever, uint256 _value);

    function balanceOf(address _address)
        external
        view
        returns (uint)
    {
        return balances[_address];
    }

    function transfer(address _recipient, uint _amount)
        public
        returns(bool)
    {
        require(balances[msg.sender]>_amount);
        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;
        emit Transfer(msg.sender, _recipient,_amount);
        return true;
    }
}
```

---