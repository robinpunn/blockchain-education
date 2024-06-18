### [Race 28](https://ventral.digital/posts/2024/4/2/race-28-of-the-secureum-bootcamp-epoch-infinity/)

#### Q1
> Is it possible for an attacker to drain this vault contract?
- [ ]  A. Yes, due to integer underflow in `withdrawal`
- [ ]  B. Yes, because `mint` function is reentrant
- [ ]  C. Yes, due to the wrong rounding direction
- [ ]  D. No, it is not possible

<details>

<summary>Answer</summary>

B,C

<p>
There’s no integer overflow in the `withdrawal()` function since the contract is written in Solidity 0.8. There is reentrancy in `mint()` if the underlying asset is an ERC777 token as the Check-Effects-Interactions pattern is not followed. `previewWithdraw()`, which calculates the number of shares a user has to supply to receive a given number of the underlying tokens, rounds down instead of rounding up which might lead to the loss of funds.
</p>
<p>
I'd add that even a contract written with Solidity 0.8.x can have integer overflows, but that would require the use of `unchecked` or `assembly` blocks - neither of which are used in the `withdrawal()` function.
</p>
<p>
As the info-box above the code mentioned, we are to "assume that the underlying (asset) token contract can be any token following an ERC-20 compatible standard". <a href="https://eips.ethereum.org/EIPS/eip-777">ERC777</a> tokens are an ERC-20 backward-compatible standard that implements "hooks" which are functions that get called when tokens are sent (`tokensToSend`) or received (`tokensReceived`). That means that the sender (ie. owner of tokens being sent) or recipient can take over the execution flow and exploit contract state that hasn't been fully updated yet (representing an exploitable reentrancy vector).
</p>
<p>
Rounding should always happen in favor of the protocol to prevent profitable attacks. That means that, when withdrawing a specified amount of assets, the shares to redeem in exchange should be rounded up. When redeeming a specific amount of shares, the amount of returned assets should be rounded down. When depositing a certain amount of assets, the number of shares should be rounded down. When minting a specified amount of shares, the number of assets to be deposited should be rounded up.
</p>
<p>
The `previewWithdraw()` function returns the number of shares that need to be burned in order to return the specified amount of assets. As such, the number of shares should be rounded up instead of down.
</p>

</details>

#### Q2
> Which is true about the rounding directions according to the standard?
- [ ]  A. `withdraw` should round up, `redeem` should round down
- [ ]  B. `withdraw` should round down, `redeem` should round up
- [ ]  C. `withdraw` and `redeem` should round down
- [ ]  D. None of the above, all computations must be exact

<details>

<summary>Answer</summary>

A

<p>
_According to the <a href="https://eips.ethereum.org/EIPS/eip-4626">EIP</a>, `withdraw` should round up, while `redeem` should round down, thereby ensuring that rounding favors the protocol rather than the user._
</p>

</details>

#### Q3
> What is the EIP conformant slippage protection for minting shares in ERC4626Vault?
- [ ]  A. ERC4626Vault is not vulnerable to slippage by design
- [ ]  B. Make `mint` internal
- [ ]  C. `mint` should have an extra parameter `minShares` to be compared with the actual amount of minted shares, e.g., `require(assets > minShares);`
- [ ]  D. Slippage protection could be added to a router-like contract that is interacting with ERC4626Vault instead


<details>

<summary>Answer</summary>

D

<p>
Slippage is one of the major security concerns related to the ERC4626 standard. Making `mint` internal would prevent users from calling it, thereby restricting them from using basic ERC4626 functionality, instead of addressing the slippage issue. According to the <a href="https://eips.ethereum.org/EIPS/eip-4626">EIP</a>, `mint` function should have an interface that does not include the additional `minShares` parameter, making option C non-compliant to the standard. The correct answer is, therefore, D, as implemented in the <a href="https://github.com/ERC4626-Alliance/ERC4626-Contracts/blob/main/README.md#erc4626router-and-base">ERC4626Router</a>.
</p>

</details>


#### Q4
> According to the standard, `deposit(uint256 assets, address receiver)` mints -Vault `shares` to `receiver` by depositing exactly `assets` of underlying tokens. Assume that the exchange rate between the underlying ERC20 asset and a Vault share, as returned by `previewDeposit` and `convertToShares`, is 2:1. How many Vault shares will the user get when calling `deposit(64, msg.sender)` in ERC4626Vault?
- [ ]  A. 32
- [ ]  B. 64
- [ ]  C. 128
- [ ]  D. 160

<details>

<summary>Answer</summary>

B

<p>
Even though the asset and share should be trading 2:1, there is a typo, which causes `_mint` function in `deposit` to mint `assets` instead of `shares`. The user depositing 64 assets will therefore get 64 shares in return.
</p>

</details>


#### Q5
> Which of the following invariants hold in the ERC4626Vault contract?
- [ ]  A. The amount of user shares does not decrease unless the user calls `withdraw` or `redeem`
- [ ]  B. Sum of all user shares is equal to the underlying token balance of the vault
- [ ]  C. Number of shares in circulation equals the total of shares minted minus the total of shares burned
- [ ]  D. Sum of all user shares is equal to the total supply of shares


<details>

<summary>Answer</summary>

C,D

<p>
A is incorrect because the user can transfer shares to another account using the `transfer` function that is also present in ERC4626 contracts. Sum of all user shares is equal to the total number of shares minted, i.e., total supply of shares, so D is correct and B isn’t. The number of shares that is in circulation is the difference between the number of shares that got minted minus the number of shares that were redeemed.
</p>

</details>


#### Q6
> Which statements are true about `redeem` and `withdraw` functions in the ERC4626Vault contract?
- [ ]  A. `redeem` and `withdraw` differ in rounding direction
- [ ]  B. `withdraw` sends the exact amount of assets to `receiver`
- [ ]  C. `withdraw` and `redeem` only differ in visibility
- [ ]  D. `redeem` burns the exact amount of shares from `owner`

<details>

<summary>Answer</summary>

B,D

<p>
`redeem` and `withdraw` are supposed to differ in rounding direction, since `redeem` should round down and `withdraw` should round up, however, due to a bug in this contract, they both round down. `withdraw` does send the exact amount of assets to `receiver` and `redeem` burns the exact number of shares from `owner` according to both the standard and this implementation, hence, B and D are correct. `withdraw` and `redeem` don’t differ in visibility, but do differ in functionality, making C incorrect.
</p>

</details>


#### Q7
> When there are no virtual shares and assets, inflation attacks on ERC4626 vaults are possible because of:
- [ ]  A. Rounding up when converting shares to assets
- [ ]  B. Rounding down when converting assets to shares
- [ ]  C. Share tokens of the vault increasing in price
- [ ]  D. Donation of assets to the vault to manipulate the exchange rate between assets and shares


<details>

<summary>Answer</summary>

B,D

<p>
Inflation attack allows an exploiter to profit at the expense of other users. It is possible since the calculation of users' shares being minted are rounded down, so the attacker can dilute other users' shares by manipulating the exchange rate between assets and shares. One of the ways to skew the exchange rate in the attacker's favor is by donating (not depositing) a large amount of assets into the vault: this increases the total assets in the vault without affecting the amount of shares in circulation, leading to a much smaller amount of shares being minted for the next user. Source: <a href="https://blog.openzeppelin.com/a-novel-defense-against-erc4626-inflation-attacks">Inflation Attacks</a>
</p>

</details>

#### Q8
> What are the issues with the underlying ERC20 token integration in the ERC4626Vault contract?
- [ ]  A. If ERC4626Vault uses fewer than or the same number of decimals as the underlying ERC20 asset token, precision loss can occur during conversions between assets and shares
- [ ]  B. In `withdraw`, `transfer` should be used instead of `safeTransfer` to transfer assets to the `receiver`
- [ ]  C. Tokens taking fee on transfer might break accounting
- [ ]  D. None of the above, there are no issues with the integration


<details>

<summary>Answer</summary>

A,C

<p>
In the constructor, ERC4626Vault invokes parent’s ERC20 constructor providing `18` as the value of decimals, which allows for discrepancy between the underlying asset’s decimals and those of ERC4626Vault. Precision loss during conversions between assets and shares can occur due to rounding and is more pronounced if the Vault has fewer decimals than the underlying ERC20. `safeTransfer` is a safer alternative to `transfer` that checks the possible Boolean return value of a call, so it is used correctly in the contract. `deposit` and `mint` functions do not account for the possibility that assets might change a fee on transfer — in this case, (`assets - fee`) would get deposited in the contract, while the shares calculation accounts for `assets` being deposited. A safer alternative is to use the actual difference between the contract’s balance before and after the transfer in the calculation of shares the user is entitled to.
</p>

</details>