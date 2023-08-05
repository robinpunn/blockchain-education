## Slot 5 Security Pitfalls and Best Practices 201

---

### Table of Contents

1. [Block 1](#block-1)
    102. [ERC20 Transfers](#102-erc20-transfers)
    103. [ERC20 Optional](#103-erc20-optional)
    104. [ERC20 Decimals](#104-erc20-decimals)
    105. [ERC20 Approve](#105-erc20-approve)
    106. [ERC777 Hooks](#106-erc777-hooks)
    107. [Token Deflation](#107-token-deflation)
    108. [Token Inflation](#108-token-inflation)
    109. [Token Complexity](#109-token-complexity)
    110. [Token Functions](#110-token-functions)
    111. [Token Address](#111-token-address)
    112. [Token Upgradeable](#112-token-upgradeable)
    113. [Token Mint](#113-token-mint)
    114. [Token Pause](#114-token-pause)
    115. [Token Blacklist](#115-token-blacklist)
    116. [Token Team](#116-token-team)
    117. [Token Ownership](#117-token-ownership)
    118. [Token Supply](#118-token-supply)
    119. [Token Listing](#119-token-listing)
    120. [Token Balance](#120-token-balance)

---

### [Block 1](https://www.youtube.com/watch?v=WGM1SF8twmw)

#### 102. ERC20 Transfers

- Related to the `transfer()` and `transferFrom()` functions between addresses
- Should return a boolean.
- Several tokens do not return a boolean on these functions.
- As a result, their calls in the contract might fail.

#### 103. ERC20 Optional

- Name, decimals, and symbol functions are present if used.
- These functions are optional in the ERC20 standard and might not be present.
- Do not make an assumption that these primitives will always be implemented.

#### 104. ERC20 Decimals

- They are typically 18 digits in precision and there for the token standard
  specified using a uint8.
- Several tokens incorrectly return a uint256.
- If this is the case, ensure the value returned is below 255.

#### 105. ERC20 approve()

- The ERC20 standard has a known ERC20 race condition that must be mitigated to
  prevent attackers from stealing tokens.
  - A token owner can give an allowance of 100 to a spender and later decrease
    that allowance to 50.
  - The spender may be able to observe the decrease operation and before it
    happens can front run to first spend the 100 and then also get the 50
- The best practice is to not use the `approve()` function but instead use
  `increaseAllowance()` or `decreaseAllowance()` functions that do not have this
  risk

#### 106. ERC777 Hooks

- ERC777 tokens have the concept of a hook function that is called before any
  calls to send, transfer, operatorSend, minting and burning.
- While these hooks enable a lot of interesting use cases, care should be taken
  to make sure they do not make external calls because that can lead to
  reentrancies.

#### 107. Token Deflation

- Some tokens may take a fee when one tokens are being transferred form one
  address to another.
  - Because of this fee, the number of tokens across all the user addresses will
    decrease over time
- Transfer and transferFrom should not take a fee.
- Deflationary tokens can lead to unexpected behavior.

#### 108. Token Inflation

- Potential interest earned from the token should be taken into account.
- Some tokens distribute interest to token holders.
- This interest might be trapped in the contract if not taken into account.

#### 109. Token Complexity

- Token contract avoids unneeded complexity.
- The token should be a simple contract; a token with complex code requires a
  higher standard of review.

#### 110. Token Functions

- In computer science there is the notion of separation of concerns
  - There should be different sections each of which address a very specific
    concern
  - This should also apply to smart contracts that work with ERC20 token
    contracts
- Token contract has only a few non–token-related functions.
- Non–token-related functions increase the likelihood of an issue in the
  contract.

#### 111. Token Address

- ERC20 contracts should be working with a single token address.
  - Tokens with multiple entry points for balance updates can break internal
    bookkeeping based on the address
    (e.g. `balances[token_address][msg.sender]` might not reflect the actual
    balance).

#### 112. Token Upgradeable

- Upgrading is interesting in smart contract applications, but when it comes to
  ERC20 token contracts, upgradability is a concern.
- Upgradeable contracts might change their rules over time.
  - This is detrimental to the trust users place in these contracts

#### 113. Token Mint

- In the context of token contracts, minting refers to the act of incrementing
  the account balances of addresses to which those new tokens are credited
- Token owner should have limited minting capabilities.
- Malicious or compromised owners can abuse minting capabilities.

#### 114. Token Pause

- The ability to pause certain functionality is part of a guarded launch
- However, pausing is a risk with ERC20 tokens.
- Malicious or compromised owners can trap contracts relying on pausable tokens.

#### 115. Token Blacklist

- Token owner should not be able to blacklist the contract.
- Malicious or compromised owners can trap contracts relying on tokens with a
  blacklist.

#### 116. Token Team

- Token development team should be known so they can be held responsible for
  abuse.
- Contracts with anonymous development teams, or that reside in legal shelters
  should require a higher standard of review.

#### 117. Token Ownership

- No token user should own most of the supply.
- If a few users own most of the tokens, they can influence operations based on
  the token's repartition.

#### 118. Token Supply

- Token supply refers to the number of ERC20 tokens that is supported by the
  contract.
  - The supply can be low or high
- Token total supply has to be sufficient.
- Tokens with a low total supply can be easily manipulated.
  - Ownership can be concentrated to a few owners.

#### 119. Token Listing

- ERC20 tokens can be listed in various placed to allow trading between users.
  - They can be listed on a CEX or a DEX
- Tokens should be located in more than a few exchanges.
  - If all the tokens are in one exchange, a compromise of the exchange can
    compromise the contract relying on the token.

#### 120. Token Balance

- Assumptions on taken balances pose a security risk.
  - Logic that assumes a balance is always below a certain threshold stand a
    risk of those assumptions breaking if the balance exceeds those thresholds.
  - This may be triggered by flash loans or whales
- A flash loan is a capability where a user is allowed to borrow a significant
  number of tokens without providing any collateral but the loan has to be
  repaid within the same transaction
- Users understand the associated risks of large funds or flash loans.
- Contracts relying on the token balance must carefully take in consideration
  attackers with large funds or attacks through flash loans.
