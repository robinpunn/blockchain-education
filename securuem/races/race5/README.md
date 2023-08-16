### Race 5

---

#### Q1 _InSecureum_ _balanceOf()_
- [ ] A) May be optimised by caching state variable in local variable 
- [ ] B) May be optimised by changing state mutability from _view_ to _pure_ 
- [ ] C) May be optimised by changing its visibility to _external_ 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
Since the `_balances` state variable is only accessed once and immediately returned, caching doesn't make sense.<br>
State mutability can't be changed to `pure` since the function accesses a state variable, that requires at least `view`.<br>
It can't be changed to `external` because it is currently being called internally by the `balanceOfBatch()` function.
</p>
</details>

#### Q2 In _InSecureum_, array lengths mismatch check is missing in 
- [ ] A) _balanceOfBatch()_ 
- [ ] B) __safeBatchTransferFrom()_ 
- [ ] C) __mintBatch()_ 
- [ ] D) __burnBatch()_
<details>
<summary>Answer</summary>
A,B,C,D
<p>
The public function `balanceOfBatch()` receives a list of `accounts` and a list of `ids`, both of which items get passed on to `balanceOf(accounts[i], ids[i]);`. To ensure that neither array is accessed out-of-bounds, it should be checked whether both lists are of the same length.<br>
Neither the internal function `_safeBatchTransferFrom()` nor its public caller function `safeBatchTransferFrom()` check the length of passed `ids` and `amounts`. Therefore the check is missing.<br>
The internal functions `_mintBatch()` and `_burnBatch()` are currently never called, but a contract extending InSecureum might. It would make sense to check the lengths of passed `ids` and `amounts` in them, so that public functions calling them do not need to remember to do so.
</p>
</details>

#### Q3 The security concern(s) with _InSecureum_ __safeTransferFrom()_ is/are 
- [ ] A) Incorrect visibility 
- [ ] B) Susceptibility to an integer underflow 
- [ ] C) Missing zero-address validation 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
It is prefixed with an underscore, which is usually an indication of an `internal` visibility, and it's also called by a similarly named public `safeTransferFrom()` function that applies more input validation before calling it. This validation ensures that the sender actually has approval for the transfer of funds, which would be bypassed by this function being public. It should instead be `internal` allowing an inheriting contract to internally call it.<br>
The new `fromBalance` is calculated within an `unchecked{}` block, bypassing integer underflow prevention measures of Solidity version 0.8.0^. Since the `fromBalance` isn't checked for whether there's a sufficient balance for a transfer, this effectively allows sending unlimited amounts to the specified recipient.<br>
Neither `safeTransferFrom()` nor `_safeTransferFrom()` are checking whether the `to` address is non-zero, making it possible to accidentally burn tokens.
</p>
</details>

#### Q4 The security concern(s) with _InSecureum_ __safeBatchTransferFrom()_ is/are 
- [ ] A) Missing array lengths mismatch check 
- [ ] B) Susceptibility to an integer underflow 
- [ ] C) Incorrect balance update 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
The fact that the array lengths mismatch check is missing has already been determined in Question #2.<br>
There's no usage of an `unchecked{}` block, therefore an integer underflow cannot happen with this Solidity version.<br>
The new value of `fromBalance` is calculated but it's never actually updated in storage. This effectively allows sending the same tokens unlimited amount of times.
</p>
</details>

#### Q5 The security concern(s) with _InSecureum_ __mintBatch()_ is/are
- [ ] A) Missing array lengths mismatch check 
- [ ] B) Incorrect event emission 
- [ ] C) Allows burning of tokens 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
The fact that the array lengths mismatch check is missing has already been determined in Question #2.<br>
Comparing the emission of the `TransferBatch` event to other occurrences, it appears that `ids` and `amounts` have been accidentally swapped.<br>
The zero-address check incorrectly ensures that the sender is non-zero (which would never be possible anyway) instead of ensuring that the receiving account is non-zero. This effectively allows minting to the zero-address, burning all minted tokens immediately.
</p>
</details>

#### Q6 The security concern(s) with _InSecureum_ __burn()_ is/are 
- [ ] A) Missing zero-address validation 
- [ ] B) Susceptibility to an integer underflow 
- [ ] C) Incorrect balance update 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
The zero-address validation exists and is correctly checking the value of `from`.<br>
There's no usage of an `unchecked{}` block, therefore an integer underflow cannot happen with this Solidity version.<br>
The balance appears to be correctly updated after subtraction.
</p>
</details>
#### Q7 The security concern(s) with _InSecureum_ __doSafeTransferAcceptanceCheck()_ is/are 
- [ ] A) _isContract_ check on incorrect address 
- [ ] B) Incorrect check on return value 
- [ ] C) Call to incorrect _isContract_ implementation 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
The `isContract()` function is correctly called on `to`, which is the receiving address that is potentially a contract that this function is supposed to check support of ERC1155, before tokens are sent to it, since they'd otherwise be stuck in a contract not supporting this standard.<br>
Comparing `_doSafeTransferAcceptanceCheck()` and `_doSafeBatchTransferAcceptanceCheck()` shows a clear discrepancy when checking the return value, with the batch function's implementation correctly checking support for the ERC1155 standard. This function is in fact currently doing the opposite, ensuring that tokens are only sent to contracts that do NOT support it.<br>
The `isContract()` function currently returns `true` if the passed address is in fact NOT a contract (has a code length of 0). It should instead return true only when the address has a code length larger than 0, showing that there's currently a contract residing at `account`.
</p>
</details>

#### Q8 The security concern(s) with InSecureum isContract() implementation is/are
- [ ] A) Incorrect visibility
- [ ] B) Incorrect operator in the comparison
- [ ] C) Unnecessary because Ethereum only has Contract accounts
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
A visibility of `internal` allowing inheriting contracts to use it appears appropriate.<br>
The comparison should indeed be "bigger-than-zero" instead of "equals-zero", for the reasons explained for the previous question.<br>
Ethereum not only has Contract accounts but also EOA (Externally Owned Accounts), which do not have any contract code but an off-chain public-private keypair instead.<br>
</p>
</details>