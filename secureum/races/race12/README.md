### [Race 12](https://ventral.digital/posts/2022/12/6/race-12-of-the-secureum-bootcamp-epoch)

##### Q1 Sensible gas optimization(s) would be
- [ ] A) Making `MIGRATOR_ROLE` state variable constant 
- [ ] B) Making `UNDERLYING` state variable constant 
- [ ] C) Making `MIGRATOR_ROLE` state variable immutable 
- [ ] D) Making `UNDERLYING` state variable immutable
<details>
<summary>Answer</summary>
A,D
<p>
While MIGRATOR_ROLE can be made both constant or immutable, using constant makes the most sense since the value is known during compile time.<br>
UNDERLYING on the other hand can only be immutable since the value is passed in during the contract's construction.
</p>
</details> 
##### Q2 What would a caller with `MIGRATOR_ROLE` permission be capable of? 
- [ ] A) Manipulating TokenV1's storage 
- [ ] B) Deleting TokenV1's stored bytecode 
- [ ] C) Changing TokenV1's stored bytecode to something different 
- [ ] D) With the current code it's not possible for anyone to have `MIGRATOR_ROLE` permission
<details>
<summary>Answer</summary>
A,B
<p>
A contract that was given the MIGRATOR_ROLE will be capable of triggering TokenV1's fallback function which will delegate-call them back. During this delegate-call, the contract will be capable of manipulating storage as well as self-destructing TokenV1.<br>
Replacing the bytecode would only be possible if TokenV1 was deployed via CREATE2, allowing for a redeployment at the same address with a different bytecode.<br>
The public grantRole() function is inherited from AccessControl and allows callers with DEFAULT_ADMIN_ROLE to grant the MIGRATOR_ROLE to any address.
</p>
</details> 
##### Q3 Vault initialized with TokenV1 as underlying
- [ ] A) Can be drained by re-entering during withdrawal 
- [ ] B) Can be drained during withdrawal due to an integer underflow 
- [ ] C) Allows stealing approved tokens due to a phantom (i.e. missing) function 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
C
<p>
A Vault initialized with TokenV1 offers no opportunity to re-enter although the Checks-Effects-Interactions pattern is not being followed. For this to be exploitable the underlying token itself must either be malicious or implement something akin to receive-hooks like ERC-777.<br>
The fact that a Solidity version >0.8.0 is used without any unchecked blocks should prevent any integer over or underflows from happening.<br>
The depositWithPermit() function is relying on the call to TokenV1's permit() method to revert if it's not implemented or the provided signature is invalid. However, TokenV1's fallback() function will make any calls to permit() succeed, making permit() a "phantom function". With any calls succeeding an attacker would be able to make deposits using the allowances of other users without the need for a valid signature.
</p>
</details> 
##### Q4 If Vault were to use `safeTransferFrom` instead of transferFrom then
- [ ] A) It would be able to safely support tokens that don't revert on error 
- [ ] B) It would ensure that tokens are only sent to contracts that support handling them 
- [ ] C) It would introduce a re-entrancy vulnerability due to receive hooks 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
The way Vault is currently implemented, its deployer needs to be careful to not use a token as underlying that returns success booleans instead of reverting on error. Using the SafeERC20 library would add the saveTranserFrom() function and allow both kinds of token implementations to be used.<br>
Answers B and C talk about the "save" methods of NFT standards such as ERC721. These would check whether a receiving contract declares supporting them and would also offer an opportunity for re-entrancy via the onERC721Received() hook.
</p>
</details> 
##### Q5 Who would need the `MIGRATOR_ROLE` for TokenV2 to function as intended?
- [ ] A) The deployer of the TokenV2 contract 
- [ ] B) The TokenV1 contract 
- [ ] C) The TokenV2 contract 
- [ ] D) The PermitModule contract
<details>
<summary>Answer</summary>
C
<p>
The deployer of TokenV2 would need DEFAULT_ADMIN_ROLE for granting it the MIGRATOR_ROLE.<br>
TokenV2 is the only contract that requires the role since it needs to (ab)use TokenV1's fallback function trigger a delegate-call to the PermitModule's contract.
</p>
</details> 
##### Q6 With TokenV2 deployed, a Vault initialized with TokenV1 as underlying
- [ ] A) Is no longer vulnerable in the `depositWithPermit()` function 
- [ ] B) Becomes more vulnerable due to a Double-Entry-Point 
- [ ] C) Stops functioning because TokenV1 has been replaced 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
A Vault initialized with TokenV1 will always be vulnerable in the depositWithPermit() function. A new Vault would need to start using TokenV2 for the depositWithPermit() function to no longer be vulnerable to the permit()-phantom.<br>
TokenV2 now acts as a Double-Entry-Point for TokenV1 (and vice versa). This can be exploited via the sweep() function which allows rescuing any stuck tokens as long as they are not the underlying token. Sweeping TokenV2 on a Vault using TokenV1 would effectively drain the Vault.
</p>
</details> 
##### Q7 Vault initialized with TokenV2 as underlying
- [ ] A) Can be drained by re-entering during withdrawal 
- [ ] B) Can be drained during withdrawal due to a integer underflow 
- [ ] C) Is not vulnerable in the `depositWithPermit()` function 
- [ ] D) Is vulnerable due to a Double-Entry-Point
<details>
<summary>Answer</summary>
C,D
<p>
Answers A and B haven't changed from Question 3 with the introduction of TokenV2.<br>
In TokenV2 calling the permit() function will no longer call the fallback but its actual implementation from ERC20Permit. Therefore a Vault with TokenV2 will no longer be vulnerable to the permit()-phantom.<br>
TokenV1 acts as a Double-Entry-Point for TokenV2 (and vice versa). This can be exploited via the sweep() function which allows rescuing any stuck tokens as long as they are not the underlying token. Sweeping TokenV1 on a Vault using TokenV2 would effectively drain the Vault.<br>
</p>
</details> 
##### Q8 The PermitModule contract
- [ ] A) Acts as a proxy 
- [ ] B) Acts as an implementation 
- [ ] C) Allows anyone to manipulate TokenV2's balances 
- [ ] D) Can be self-destructed by anyone
<details>
<summary>Answer</summary>
B,D
<p>
TokenV2 will forward delegate-calls made from TokenV2 to the PermitModule contract. Effectively TokenV2 abuses the migration logic in TokenV1 turning it into a proxy while PermitModule acts like the implementation.<br>
The way that Context's _msgSender() function has been overridden, it allows any caller to arbitrarily set what is expected to be the msg.sender. By crafting a call with TokenV1's address appended they will gain the DEFAULT_ADMIN_ROLE. With that, they can grant themselves the MIGRATOR_ROLE and make PermitModule delegate-call back. Since all token balances are stored at TokenV1's address this will not allow for a manipulation of any real balances. But it would allow delegate-calling to a contract that'll execute a self-destruct.<br>
</p>
</details> 