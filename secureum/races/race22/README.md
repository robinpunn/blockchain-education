### [Race 22](https://ventral.digital/posts/2023/10/3/race-22-of-the-secureum-bootcamp-epoch-infinity)

#### Q1
```solidity
contract CannotReceiveETH {
    receive() external payable {
      revert();
    }

    function hasETH() external view returns (bool) {
      return address(this).balance > 0;
    }
}
```
>“Select the true statement(s) about the above contract:”
- [ ]  A. It's impossible for the _hasETH_ function to ever return _true_
- [ ]  B. The contract's ETH balance may increase if the deployer sends ETH during the deployment
- [ ]  C. The contract's ETH balance can increase if it's the target of a _SELFDESTRUCT_ opcode
- [ ]  D. The contract's ETH balance can increase if it's the target of a beacon chain withdrawal
<details>
<summary>Answer</summary>
C,D
<p>
B: Solidity contracts require a payable constructor in order to be able to receive ETH during deployment. Attempting to send anything will revert.

C: It's always possible to inject ETH balance into a deployed contract by specifying it as the receiver address when self-destructing another contract as this won't invoke the receiver's bytecode and doesn't give it a chance to reject.

D: [Beacon chain withdrawals](https://eth2book.info/capella/part2/deposits-withdrawals/withdrawal-processing/#performing-withdrawals) happen at protocol level outside of the EVM. They are gas-free and will not invoke the contract's bytecode.

A: As it's possible for the contract to receive ETH after all, the _hasETH_ function may return _true_ under the mentioned circumstances.
</p>
</details> 

#### Q2
```solidity
contract Example {
    event FallbackExecuted(bytes data, uint256 value);
    event ReceiveExecuted(uint256 value);

    fallback() external payable {
        emit FallbackExecuted(msg.data, msg.value);
    }

    receive() external payable {
        emit ReceiveExecuted(msg.value);
    }
}
```
> “Select the true statement(s) about the above contract:”

- [ ]  A. The _ReceiveExecuted_ event is emitted when ETH is sent in a call, regardless of the length of the call’s calldata
- [ ]  B. The _FallbackExecuted_ event is emitted when ETH is sent in a call and the call’s calldata is not empty
- [ ]  C. The _FallbackExecuted_ event is emitted when no ETH is sent in a call and the call’s calldata is empty
- [ ]  D. The _ReceiveExecuted_ event is emitted when ETH is sent in a call and the call’s calldata starts with _0xa3e76c0f_ (the function signature of _receive()_)
- [ ]  E. The _receive_ function only has 2300 gas available, regardless of how much the caller has sent
<details>
<summary>Answer</summary>
B
<p>
A: If the calldata isn't empty, [_receive_ is not executed](https://docs.soliditylang.org/en/v0.8.19/contracts.html#receive-ether-function).

B: The _fallback_ is executed as a last resort function when none of the others match. In this case, the _receive_ function is not executed because the calldata is not empty, so execution goes to the _fallback_.

C: In this case the _receive_ function is executed.

D: If the calldata is not empty, the _receive_ is not executed. Also note that both _fallback_ and _receive_ are not like external/public functions. They have no function signature.

E: Is false because _receive_ doesn't limit the amount of gas available. Gas may be limited when the contract was called via _transfer()_ though, for example.
</p>
</details>

#### Q3
```solidity
contract Example {
    function foo(uint8 data, uint64 length) external {
         // ...
    }
}
```
> “In the above contract, what are some safety checks automatically included by the Solidity compiler?”

- [ ]  A. Panic if the call has value greater than zero
- [ ]  B. Panic if the calldata's size is not larger than 4 bytes
- [ ]  C. Panic if the calldata's size is larger than 68 bytes
- [ ]  D. Panic if the first parameter cannot be ABI-decoded to a _uint8_ type
- [ ]  E. Panic if the second parameter cannot be ABI-decoded to a _uint64_ type
<details>
<summary>Answer</summary>
A,B,D,E
<p>
A: To functions that are not marked as _payable_, Solidity adds bytecode for ensuring that the _msg.value_ sent is indeed zero.

B: If the calldata's size is exactly 4 bytes, it may contain the _foo_ function's correct signature but it would error since the calldata is not of sufficient length to attempt decoding the function's parameters from. If the calldata sent does not map to an existing function, or is shorter than 4 bytes, it would error too since there's no _fallback_ or _receive_ functions to handle such a case.

C: Solidity's ABI decoder will ignore any additional data sent that it doesn't need. If the _foo_ function was being called, it would not error if the calldata size is larger than the function's signature and its expected parameter data.

D/E: Solidity will indeed revert if parameter values are sent that do not fit within the mentioned types (ie. overflow while down-casting).

To verify these, you can compile the contract (_solc --ir Example.sol_), read the Yul output, and see the actual checks included by the compiler. [Here's the Yul output](https://gist.github.com/tinchoabbate/6693719df90150bbe3f2aac66ee30ec0). Tincho has marked the relevant lines with the comment _//QUIZZ_ so you can find them.
</p>
</details>

#### Q4
```solidity
contract Example {
    uint8[] public someArray = new uint8[](300);

    function foo(uint32 a, uint32 b, uint32 index) external {
        unchecked {
            someArray[index] = uint8(a / b);
        }
    }
}
```
> “Which of the statement(s) is/are true about the above contract?”

- [ ]  A. Due to the use of _unchecked_, out-of-bound access protections are disabled. So when the _index_ parameter is greater than 300, execution does not revert
- [ ]  B. Due to the use of _unchecked_, when _b_ is 0, _a / b_ does not revert and results in 0
- [ ]  C. The use of _unchecked_ eliminates the compiler’s automatic overflow check when casting the result of _a / b_ to _uint8_
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
D
<p>
A: Unchecked-blocks do not disable out-of-bound access checks in Solidity. You can verify this by copying the contract in Remix, calling the function with an index of 299 and checking that the tx doesn't revert. Then do the same, but with an index of 300, and the tx reverts.

B: Unchecked-blocks do not cause division-through-zero occurrences to be ignored. Easy to verify in Remix too.

C: Unsafe downcasting will indeed not revert, but not because of the use of unchecked, but because the down-cast is made explicitly. If you remove the unchecked block, and the result of a/b is greater than 255, execution still succeeds (silently overflowing the result). Again, you can check this in Remix.
</p>
</details>

#### Q5
```solidity
contract Example {
    function callAndRevert(address target, bytes calldata payload) external {
            assembly (“memory-safe”) {
                call(gas(), target, callvalue(), add(payload, 32), payload, 0, 0)
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
    }
}
```

> “Which of the statement(s) is/are true about the above contract when trying to compile using solc 0.8.17 without optimizations?”
- [ ]  A. Compilation fails because _callvalue()_ is used but the function is not payable
- [ ]  B. Compilation fails because the assembly block is marked _“memory safe”_ but memory can potentially be read and written
- [ ]  C. Compilation succeeds, although the compiler emits a warning due to the unused return value of _call_
- [ ]  D. Compilation succeeds without any warnings
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
E
<p>
A: A function not being payable simply means that there's no check whether value was sent when the function is called. But checking _callvalue_/msg.value is still allowed.

B: The [“memory safe” flag](https://docs.soliditylang.org/en/latest/assembly.html#memory-safety) merely tells the compiler that it may rely on the assembly block respecting Solidity's memory layout and therefore being able to apply certain optimizations. Compilation won't fail from the assembly-block reading or writing memory in any way.

C/D: Doesn't compile because the _payload_ variable is a data element and can't be accessed like that. Instead one has to use its _.offset_ or _.length_ attributes. A second compilation error is that call returns a value which is not used, and it needs to be either assigned or discarded.
</p>
</details>

#### Q6
```solidity
contract Example {
    function callAndRevert(address target, bytes memory payload) external payable {
        assembly (“memory-safe”) {
            let result := call(gas(), target, callvalue(), add(payload, 32), payload, 0, 0)
            returndatacopy(0, 0, returndatasize())
            revert(0, returndatasize())
        }
    }
}
```
> “A developer does some minor changes on the previous contract, resulting in the above contract. Which of the statement(s) is/are true when calling _callAndRevert_?”

- [ ]  A. The transaction reverts before the external call if the bytes in the _payload_ parameter are not properly ABI-encoded
- [ ]  B. The transaction reverts before the final _revert_ operation when _target_ is an account without code
- [ ]  C. The transaction reverts before the final _revert_ operation when execution in the _target_ account reverts
- [ ]  D. The transaction reverts before the final _revert_ operation when the callee runs out of gas
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
E
<p>
A: The _payloads_ contents are not checked for their ABI-compatibility before the call is made as it may be non-ABI encoded contents that the target is expecting. It's simply that _bytes_ could be anything, it may be something ABI-encoded, it may be something completely different, like the binary data of an image.

B: No, _CALL_ing a contract without any code directly will always succeed. This assembly-block skips the check contract-size check that Solidity would do before attempting to call the target.

C: If the execution in the _target_ account reverts, this won't revert the entire transaction but only the actions done within the context of that _CALL_. Whether a revert happened can be known by checking the boolean value returned by executing the _CALL_ opcode. The revert is not bubbled-up to the caller context, so execution continues.

D: If the callee runs out of gas, the revert is again not bubbled-up. Furthermore, one 64th of gas is always put aside for the caller. Even if the callee uses up all of the gas they had available, the caller should still have some gas left to execute a few more operations and it may be enough to finish the transaction without reverting.
</p>
</details>

#### Q7
```solidity
 contract Example {
    function callAndRevert(address target, bytes memory payload) external payable {
        assembly (“memory-safe”) {
            let result := call(gas(), target, callvalue(), add(payload, 32), payload, 0, 0)
            returndatacopy(0, 0, returndatasize())
            revert(0, returndatasize())
        }
    }
}
```

> “Continuing with the same contract, what are the consequences of annotating the assembly block as “memory-safe” ?”

- [ ]  A. It’s a good practice to help auditors, and never affects the compiler’s behavior
- [ ]  B. The bytes in _payload_ are checked to be ABI-encoded before storing them in memory
- [ ]  C. _returndatacopy_ will revert if _returndatasize_ is greater than zero, due to writing to Solidity’s reserved memory space
- [ ]  D. Return bomb attacks are prevented due to safety checks introduced by the compiler on the size of the returned data copied to memory
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
E
<p>
A: No, it's a flag telling communicating to the compiler that the assembly-block respect's Solidity's memory layout and it affects the compiler's use of optimizations.

B: No, since bytes are allowed to be any sort of value and are not necessarily always ABI-encoded. They are simply copied into memory without checks until an attempt to actually decode them is made.

C: No, writing into Solidity's reserved memory space will not cause a revert. There's no code checking this and the EVM is unaware of Solidity's expectations around memory. There's nothing preventing this.

D: Solidity does not add any safety checks to assembly-blocks. The responsibility lies with the author.
</p>
</details>

#### Q8
> “Alice and Bob have the exact same Solidity contract. Each one compiles the contract in their machines with the same compiler version and settings (e.g., running solc Example.sol —bin) . Then they compare the resulting outputs. Which of the following statement(s) is/are true?”

- [ ]  A. The output is the same, because the contract and compiler version and settings are exactly the same
- [ ]  B. The output is different, because Mercury and Venus are not aligned at the moment of compilation
- [ ]  C. The output is different, because by default the bytecode includes extra non-executable bytes that depend on each one’s compilation environment
- [ ]  D. The output is different, but they could use a compiler flag that would make solc produce the same outputs everywhere

<details>
<summary>Answer</summary>
C,D
<p>
By default, solc includes the metadata hash as part of the output bytecode. This hash is dependent on the compilation environment (for example, path and filename). Therefore the output will be different between Alice and Bob. The compiler flag that would solve the issue is _--metadata-hash none_, which removes the hash from the output.

You can verify this with two equal contracts in the same directory with different filenames. Compile them as usual, and compare the bytecode, noting that it's different. Then compile again but with the flag, and you'll see the output now is the same.

Lesson: Solidity is weird.
</p>
</details>