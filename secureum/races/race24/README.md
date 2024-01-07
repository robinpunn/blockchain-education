### [Race 24](https://docs.google.com/document/d/1PswXg-sc4Hy4YCGuTrwgZnXSEsfNZ_-rkiABw2ggOKc/edit)

#### Q1
>  Is there a possibility to create a contract at some specific deterministically chosen Ethereum address and change its state bytecode after the deployment (hence, have the same address but with different bytecode)?
- [ ]  A. There is none because contract bytecode is immutable
- [ ]  B. selfdestruct call can be considered as bytecode change because it zeroes it out
- [ ]  C. Using a proxy pattern, one can change the bytecode at the deployed address
- [ ]  D. A special constructor allows re-deploying at the same address after self-destructing
<details>
<summary>Answer</summary>
B,D
<p>
one can use metamorphic contracts to deploy different bytecodes to the same address
</p>
</details> 

![Q2 Image](https://lh7-us.googleusercontent.com/wDfW_ro_LPh1_Yn0fYZtuHuNKxbZ1cVQzLNnbmG0EIG2rhTHht1pK4C8jKxDbsqaCJ7l-KXgDFl9E7fzRI_-LnCxA5rK3RlLXlTsfkUH0iHnlFMsWLXyvNnRxppKBlHTsdJ0QnOUYYNQI_c-OSTPU6w "Q2 Image")
#### Q2
> The code shows an example of a vulnerable implementation of the ERC20 permit() function. What are the possible high/critical severity bugs in the code?
- [ ]  A. The digest calculation cannot stop some of the replay attack vectors.
- [ ]  B.  Due to insufficient checks in the code, it allows anyone to drain zero (0x0000000000000000000000000000000000000000) address balance, e.g. in case the ERC20 token’s burn function actually sends the tokens to zero address.
- [ ]  C. The way signature nonce is checked is vulnerable to replay attacks.
- [ ]  D. Not all of the crucial security-essential parameters passed to the function are actually checked by the permit() function.

<details>
<summary>Answer</summary>
A,B,C,D
<p>
the code has all of the bugs mentioned, as per ecrecover() return value was not being checked for 0 address, expiry was not being checked, and also the S value of the signature is malleable (check ECDSA malleability)
</p>
</details>

![Q3 Image](https://lh7-us.googleusercontent.com/b_n14NzFnZvo8n8XTfBMTl2KRUNpTSWcgy4GDMbwjFY5KydBZ4Il7jYwt3ygrL_ztce6xwOKvXRPeXlAJJI2l8NZlQqllBvds-SolAx_PIAre0TV9t6JE2u0-v6n-wKnGSGdNm6qnsskMChN715BXVU "Q3 Image")
#### Q3
> The code shows a snippet of a Liquidity Provider (LP) token staking functionality. The protocol is designed to stake Uniswap V2 Liquidity Provider tokens (LP tokens). The rest of the code should be treated as black-box and without any bugs or other issues. Which of these are correct observations about the code?
- [ ]  A. Given the scope of only the stakeLP function, reentrancy is possible which has a critical impact.
- [ ]  B. Given the scope of only the stakeLP function, reentrancy is technically possible, although with no real impact.
- [ ]  C. The safeTransferFrom() function is not implemented consistently allowing to drain LPs that are not yet created, but will be in future.
- [ ]  D. A malicious LP token can be used by the attacker to drain the balance of other conventional LP tokens.

<details>
<summary>Answer</summary>
B,C
<p>
safeTransferFrom has a check missing that contract has any code, calling this on empty accounts will return true with empty data and pass the required check, thus if one frontruns the LP token creation (on uniswap factory) and calls the stakeLP will be able to stake any amount of money
</p>
</details>

#### Q4
> What’s the minimum time required for the calculation logic inside of the distributeReward() function to return an incorrect value
![Q4 Image](https://lh7-us.googleusercontent.com/r7C9fGMBTl9jMPGiyIWPk4C4ifsV3CnBxT6Us-A7SjTBPR_fR70AydeUqC_WYAkUWutWe1kPUVa4HmZmxT6-lTezy1IMhlr_E4ZCGAa9OvOJF4giZt1P1zFdA3vl6YVxo3DBsfDLKNugTYu6xmkd_WI "Q4 Image")
> Which, if any, of the following statements hold with respect to how a user's balance may change?
- [ ]  A. After a second.
- [ ]  B. After a day.
- [ ]  C. After 3 days.
- [ ]  D. After 5 days.

<details>
<summary>Answer</summary>
B
<p>
this is a rounding bug, 1/2**days will return 0 but will start doing that only after one day has passed, as 2**0 will be equal to 1, and for the first day the calculation will (ironically) work correctly
</p>
</details>

#### Q5
```solidity
pragma solidity >=0.8.0;

contract Multicall{
   function multicall(bytes[] calldata data) external{
       for(uint i=0; i < data.length; i++){
           address(this).delegatecall(data[i]);
       }
   }
}

contract Vault is Multicall{
   mapping(address => uint) balances;
   function deposit() public payable {
       balances[msg.sender] += msg.value;
    }

   function depositFor(address to) public payable {
       balances[to] += msg.value;
    }

    function withdraw(uint amount) public{
       require(amount <= balances[msg.sender]);
       payable(msg.sender).transfer(amount);
       balances[msg.sender] -= amount;
    }

   function withdrawTo(address to, uint amount) public{
       require(amount <= balances[msg.sender]);
       payable(to).transfer(amount);
       balances[msg.sender] -= amount;
    }
}
```
> The code is a snippet of an example Vault contract. The contract allows Ether deposits and withdrawals, and also implements multicall functionality to aggregate multiple calls into one transaction. Which of these observations are correct about the code?
- [ ]  A. Using multicall() in conjunction with withdrawal functions, an attacker can conduct reentrancy attacks draining all of the Ether from the contract.
- [ ]  B. The functions withdraw() and withdrawTo() are prone to profitable reentrancy attacks on their own. 
- [ ]  C. Using multicall() in conjunction with deposit functions, attackers can inflate their balance in order to further withdraw all of Ether from the contract.
- [ ]  D. The delegatecall() can be abused by the attacker to execute arbitrary bytecode in the context of the Vault contract.

<details>
<summary>Answer</summary>
C
<p>
This question had a flaw in the task code (missing “payable” for the multicall function), but this does not make the other 3 answers to be correct. The designed bug was that calling the deposit function in multicall loop will keep the msg.value the same for all the calls, thus amplifying the deposited amount.
</p>
</details>

#### Q6
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {
 address king;
 uint public prize;
 address public owner;

 constructor() payable {
   owner = msg.sender; 
   king = msg.sender;
   prize = msg.value;
 }

 function setKing() external payable {
   require(msg.value >= prize || msg.sender == owner);
   (bool success,) = king.call{value:msg.value}("");
   king = msg.sender;
   prize = msg.value;
 }

 function _king() public view returns (address) {
   return king;
 }
}
```
> In the code we have taken the Ethernaut’s King challenge and changed it so that no one should have the ability to lock him as the king by changing the transfer() call with a low-level call(). Which of these observations are correct about the code?
- [ ]  A.  No one can lock himself as the king as the low-level call() will not automatically revert, even if the king is a smart contract with a reverting fallback function.
- [ ]  B. The transaction can be reverted with OOG in case the king returns a large enough amount of return data.
- [ ]  C. A nonReentrant modifier is missing and as the low-level call is used, the king can reenter the setKing() call to stay as the king.
- [ ]  D. By setting the success variable from the return tuple of low-level call(), the compiler automatically adds a check for it to be true, thus still making it possible for the king to lock himself by reverting the fallback function.

<details>
<summary>Answer</summary>
B
<p>
A trick called return-bomb can be used to prevent anyone from changing “the king”. By returning a big amount of return data the setKing will revert while trying to copy the returned data. Interestingly, despite the code ignores the second return value of the tuple the compiler still adds a code to copy the returned bytes.
</p>
</details>

#### Q7
![Q7 Image](https://lh7-us.googleusercontent.com/4LWvAvZCmAYF3pUrfD-_LmbwnPciwJMqxkZzMqQSwvi4FVkdi_Hik0vANsNQ-eM16YdCxg0uYgae3mDSVgwdSRME8-kNyjErCAdj7Tsd_MQuugmMmBn5xKl7Dy37njNuz45-LRFJhdGTvISoirMutXA "Q7 Image")
> Which are the correct statements about the code shown?
- [ ]  A. This code cannot be compiled because multiple inheritance is not allowed in Solidity.
- [ ]  B. When calling the foo() method of contract C, the event with the value "A" will be emitted.
- [ ]  C. When calling the foo() method of contract C, the event with the value "B" will be emitted.
- [ ]  D. If contract C inherits first from contract B and then from contract A, then the emit event will be "A".
- [ ]  E. If the override construct in the foo() method of contract C swaps contracts A and B, then the value of the event emitted will also change.
- [ ]  F. None of the above

<details>
<summary>Answer</summary>
C,D
<p>
This task revolves around the multiple inheritance challenge in Solidity. To address it successfully, it's essential to understand that Solidity implements inheritance through the C3-linearization algorithm, where the last class from which the original class is inherited becomes the superclass
</p>
</details>

#### Q8
![Q8 Image](https://lh7-us.googleusercontent.com/A9QPY9PmNIQPlGv2qlEXOkoW2XsMPDArruHrgi0nWMyqhGssmQ0OuXkcdqVnXkkqQtpKCqwFlDcBeGwVuHH8aK2v95-GTjbZy7kDYl5a89hxqKE-yjwi2IZ6P-F9NTKs-pTV_AGmhATwi3CuKF1rDZ4 "Q8 Image")
> What is the complexity of the algorithm shown (time complexity and space complexity)?
- [ ]  A. Time complexity = O(Log(n)), Space complexity = O(1)
- [ ]  B. Time complexity = O(3^n), Space complexity = O(1)
- [ ]  C. Time complexity = O(n^3 * Log(n)), Space complexity = O(Log(n))
- [ ]  D. Time complexity = O(n), Space complexity = O(n)

<details>
<summary>Answer</summary>
D
<p>
This problem introduces a recursive algorithm for calculating the nth Tribonacci number with the use of memoization
</p>
</details>