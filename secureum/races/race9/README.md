### [Race 9](https://ventral.digital/posts/2022/8/29/secureum-bootcamp-epoch-august-race-9)

---

##### Q1 The function signature is the first 4 bytes of the keccak hash which
- [ ] A) Includes the function name 
- [ ] B) Includes a comma separated list of parameter types 
- [ ] C) Includes a comma separated list of return value types 
- [ ] D) Is generated only for public and external functions
<details>
<summary>Answer</summary>
A,B,D
<p>
A function's signature is created by hashing its name and a comma separated list (no spaces) of the types of all its parameters. For example: _add(uint256,uint256)_.<br>
The fact that the return value type isn't part of the signature is basically given away by the fact that the creation of the _counter()_ function's signature doesn't mention _int256_.<br>
Since it's used for calling external and public functions of a contract, only these functions need a signature to be called by. Internal and private functions can only be directly JUMPed to within the bytecode of the contract that contains them.
</p>
</details> 

##### Q2 The Proxy contract is most similar to a
- [ ] A): UUPS Proxy 
- [ ] B) Beacon Proxy 
- [ ] C) Transparent Proxy 
- [ ] D) Metamorphic Proxy
<details>
<summary>Answer</summary>
C
<p>
A UUPS (or Universal Upgradeable Proxy Standard) would have it's upgradeability logic within the implementation which ensures there won't be function signature clashes. This is not the case here with the _setImplementationForSelector()_ function being part of the Proxy.<br>
A Beacon Proxy would ask another contract where it can find the implementation, this isn't the case here since the implementation address is managed and stored in the Proxy contract itself.<br>
This makes it most similar to a Transparent Proxy.<br>
A "Metamorphic" Proxy isn't really a thing. Contracts referred to being metamorphic usually achieve upgradeability not thanks to a proxy, but due to the fact that they can be re-deployed to the same address via CREATE2.
</p>
</details> 

##### Q3 Gas will be saved with the following changes
- [ ] A) Skipping initialization of _counter_ variable 
- [ ] B) Making _increase()_ function external to avoid copying from calldata to memory 
- [ ] C) Packing multiple implementation addresses into the same storage slot 
- [ ] D) Moving the calculation of the _counter()_ function's signature hash to a constant
<details>
<summary>Answer</summary>
C
<p>
Avoiding initialization of state variables to zero can indeed save gas and are usually not necessary when deploying contracts to fresh addresses where all state variables will be zero-initialized by default.<br>
If initialization in the Mastercopy contract would attempt setting a value different from 0 it wouldn't even have any effect, since it's not setting this value in the Proxy's state - this would be considered a bug.<br>
The _increase()_ function does not have any function parameters that are being copied from calldata to memory. Introducing this change would have no effect.<br>
Addresses are too large (20 bytes) for multiple of them to be packed into a single storage slot (32 bytes).<br>
Constants are basically placeholders in the bytecode for expressions that are filled during compile time. It would not make a difference whether the compiler fills them or whether we've already "filled" them by hand. It might however improve readability to do so.
</p>
</details> 

##### Q4 Calling the _increase()_ function on the Proxy contract
- [ ] A) Will revert since the Proxy contract has no _increase()_ function 
- [ ] B) Will revert for any other caller than the one that deployed the Proxy 
- [ ] C) Increases the integer value in the Proxy's storage slot located at index 1 
- [ ] D) Delegate-calls to the zero-address
<details>
<summary>Answer</summary>
B,C
<p>
When the Proxy is called with the function signature for _increase()_, Solidity will call the _fallback()_ function since the Proxy contract itself does not have a function with a matching signature.<br>
The _fallback()_ function will determine that, for this signature, it has stored the mastercontract's address as an implementation and will delegate-call it.<br>
The Mastercontract's code will be execute in the context of the Proxy contract, meaning that the state being manipulated by the Mastercontract's code is that of the Proxy.<br>
The function-selection logic of the Mastercontract will find that it indeed has a matching function signature belonging to _increase()_ and will execute it.<br>
The _increase()_ function will increment the value of the counter state variable by one, who's index is at 1 because the first index is already reserved by Ownable's owner state variable.<br>
This means that whatever value is currently located at the Proxy contract's storage slot with index 1 will be increased by one even if there's no variable called counter in the Proxy itself.
</p>
</details> 

##### Q5 Calling the _decrease()_ function on the Proxy contract
- [ ] A) Will revert because it was not correctly registered on the proxy 
- [ ] B) Will succeed and return the value of counter after it was decreased 
- [ ] C) Will succeed and return the value of counter before it was decreased 
- [ ] D) Will succeed and return nothing
<details>
<summary>Answer</summary>
D
<p>
When checking for the implementation address of the decrease() function's signature, the Proxy contract won't find one since it wasn't registered in the constructor like the increase() function was.<br>
But that doesn't mean it'll revert, it'll instead get the default state value: The zero address.<br>
Since no check is made to prevent _calls_ when no matching signature is found in the _implementations_ mapping, a delegate-call will be made to the zero address, and like all calls that are made to addresses that do not have runtime bytecode, this call will succeed without returning anything.<br>
The EVM implicitly assumes that all bytecode ends with the STOP opcode, even if the STOP opcode isn't explicitly mentioned in the bytecode itself. So to the EVM an empty bytecode actually always contains one opcode: STOP - the opcode for stopping execution without errors.
</p>
</details> 

##### Q6 Due to a storage clash between the Proxy and the Mastercopy contracts
- [ ] A) Proxy's _implementations_ would be overwritten by 0 during initialization of the Mastercopy 
- [ ] B) Proxy's _implementations_ would be overwritten when the _counter_ variable changes 
- [ ] C) Proxy's _implementations_ variable's storage slot being overwritten causes a DoS 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
Mappings leave their assigned storage slot unused. The actual values of a mapping are stored at location's determined by hashing the mapping slot's index with the key.<br>
That means that, even though the Proxy's _implementations_ and the Mastercopy's _counter_ variables make use of the same slot, they actually do not interfere with each other and nothing will happen when _counter_'s value changes.
</p>
</details> 

##### Q7 The Proxy contract
- [ ] A) Won't be able to receive any ether when _calldatasize_ is 0 due to a missing _receive()_ 
- [ ] B) Will be the owner of the Mastercopy contract 
- [ ] C) Has a storage clash in slot 0 which will cause issues with the current Mastercopy 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
Thanks to its payable _fallback()_ function it'll still be able to receive ether without issues.<br>
Ownable always initializes the owner with the msg.sender. When the Proxy deploys the Mastercopy contract, the Proxy will be the msg.sender and therefore become the owner of the mastercopy contract.<br>
Both the Proxy contract and the Mastercopy contract first inherit from Ownable ensuring that the storage slot at index 0 will be used in the same manner on both contracts preventing any issues.
</p>
</details> 

##### Q8 The _fallback()_ function's assembly block
- [ ] A) Can be marked as "_memory-safe_" for gas optimizations 
- [ ] B) Has the result of the delegate-call overwrite the the call parameters in memory 
- [ ] C) Interferes with the Slot-Hash calculation for the implementations-mapping by overwriting the scratch space 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
The assembly block doesn't respect Solidity's memory management and can't be considered to be _"memory-safe"_. And even if it did, this Solidity version does not have the option to mark assembly blocks as such yet, this was introduced with version 0.8.13.<br>
The use of the _CALLDATACOPY_ opcode will copy the full _CALLDATASIZE_ to memory starting at offset 0. Then, after the delegate-call was finished, the use of the _RETURNDATACOPY_ opcode will copy the full _RETURNDATASIZE_ to memory, also starting at offset 0. This effectively means that the output will overwrite the input of the delegate-call.<br>
The slot-hash calculation has already finished when the assembly block begins, therefore there should not be any interference by overwriting the sratch space that was used for it.
</p>
</details> 