### [Race 25](https://ventral.digital/posts/2024/1/1/race-25-of-the-secureum-bootcamp-epoch-infinity/)

#### Q1
> Which accounts am I able to set the magic number for?bytecode after the deployment (hence, have the same address but with different bytecode)?
- [ ]  A. Any EOA that I have the private key for
- [ ]  B. Any contracts that I own
- [ ]  C. Some EOAs that I don’t have the private keys for
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
A,C
<p>
A magic number is set via the `set()` function which requires a signature (`uint8 _v, bytes32 _r, bytes32 _s`) to be passed in which signs for the specified `user` address for whom the magic number is being set.

With that in mind, you'll be able to sign with EOA accounts that you have the private key for, but you won't be able to sign with contracts since those don't have a private key.

There's one exception here: The zero-address (`address(0x0)`). The `ecrecover()` function which is used to recover the signer's address from the passed signature returns the zero-address in case of errors. This code does not handle this case, instead, by passing in an invalid signature that will cause `ecrecover()` to error, it'll allow anyone to set magic numbers for 0x0 - although nobody has the private key for this address.
</p>
</details> 

#### Q2
> In what situations could a signature be replayed?severity bugs in the code?
- [ ]  A. Someone could use the same signature to set the same number and add to the prize
- [ ]  B. Someone could use the same signature to change the magic number
- [ ]  C. Someone could use the signature from another chain
- [ ]  D. None of the above

<details>
<summary>Answer</summary>
A,C
<p>
The `messageHash` currently only contains two things: The magic `number` passed and the contract's own address (`address(this)`). It doesn't keep track of which signatures have already been used and it's therefore possible to use the same signature multiple times.

Since the `number` is part of the signed message, it's not possible to change the magic number with the same signature, but there's nothing stopping you from adding more value to the prize by replaying it.

Additionally to a `nonce`, the signature is also missing a `chainId` within the message it's signing. Due to that, it's possible to replay them across chains. That means one would be able to use a signature from one chain, where the legitimate player has set a prize, on another chain where the player hasn't even played yet.
</p>
</details>

#### Q3
> Which EIP(s) should be used to create a more secure message hash?
- [ ]  A. EIP 1559
- [ ]  B. EIP 712
- [ ]  C. EIP 4626
- [ ]  D. EIP 4337

<details>
<summary>Answer</summary>
B
<p>
- EIP 1559: Changed Ethereum's fee market mechanism, adding a base-fee.
- EIP 712: Defined a procedure on how data should be structured for hashing and signing.
- EIP 4626: Extends ERC-20 to provide a standard for tokenized Vaults.
- EIP 4337: Added Account Abstracting using an alternative Mempool.
</p>
</details>

#### Q4
> Is there a reentrancy risk in this contract?
- [ ]  A. No, it’s safe because a low level call is used to transfer ETH
- [ ]  B. No, it’s safe because checks-effects-interactions is used
- [ ]  C. Somewhat, reentrancy is possible but the `noStealing` modifier eliminates the risk
- [ ]  D. Yes, there is a reentrancy risk that can be used to steal all funds

<details>
<summary>Answer</summary>
D
<p>
First we have to understand what this contract is all about: Players can use `set()` to set a magic number which can be reached by a certain pre-image (ie. another number can be converted into a magic number, commonly through hashing). These users also set a certain ether prize that is given to another player guessing the correct pre-image. Guesses can be submitted via the `solve()` function, if the caller guesses right, they will receive the ether prize.

But the `solve()` function makes use of the `noStealing()` modifier, which wants to ensure that at the end of the `solve()` function's execution, the winner did not take more funds from the contract than the prize set by the user who came up with the magic number. It does so by comparing the contract's before and after balance. The issue with this is that an attacker merely has to make sure that this condition is satisfied at the end of the `solve()` function's execution. To do so, the attacker can call the function using a contract with a `fallback()` which will be triggered when the ether prize is sent to it.

For example, the attacker could double the prize by having the `fallback()` function, when first receiving the prize, call `solve()` once more. Since the `prizes[user]` had not been updated to 0 yet, they can claim the same prize again. When receiving this second ether value through the `fallback()`, they can use `set()` to put it back into the contract under their own name. This will make the `noStealing` modifier's checks pass and allows the attacker to later obtain this balance that is now double-accounted for within the contract.
</p>
</details>

#### Q5
> In what situations could `_safeETHTransfer` revert?
- [ ]  A. `msg.sender` is an EOA that is not able to accept funds
- [ ]  B. `msg.sender` is a contract without a `receive()` or `fallback() payable` function
- [ ]  C. `msg.sender` is a contract that runs out of gas
- [ ]  D. `msg.sender` is a contract that reverts in its `receive()` function

<details>
<summary>Answer</summary>
B,C,D
<p>
There's no such thing as an EOA that is unable to receiver ether funds. Contracts, on the other hand, are more nuanced: When they receive ether funds via `.call()` their code is executed and may revert for various reasons.
</p>
</details>

#### Q6
> What does the `_shuffleBits()` function do?
- [ ]  A. Moves all the bits to the left
- [ ]  B. Moves all the bits to the right
- [ ]  C. Reverses all the bits one by one
- [ ]  D. Reverses all the bytes one by one

<details>
<summary>Answer</summary>
C
<p>
The `_shuffleBits()` function takes in and returns a `uint`, or more precisely, a `uint256` which stands for the 256 bits that make up a simple unsigned (all positive) natural number. The function iterates over each of these bits (from 0 to 255) by checking `preimage & (1 << i) != 0`:

The number 1 has a single bit at its zero position, and with `<<` this bit is shifted `i` times to the left. The result of this shifting operation is then processed by an bitwise-AND with the `preimage`. This means that for each bit at position `i` it checks whether the bit's value is unequal zero.

If it is unequal zero it writes `result |= 1 << (255 - i)` into `result` which is a new, empty unsigned integer of the same size.

The `1 << (255 -i)` operation is again shifting a single byte to the left, but this time it starts at the last bit and as `i` increases the bit gets closer to the zero position.

The `|=` assignment means that the current `result`'s value is bitwise-OR operated on with the shifted bit and then updated with the resulting value. Therefore it reverses all the bits one by one.
</p>
</details>

#### Q7
> `_convertPreimageToNumber` can return:
- [ ]  A. An even number
- [ ]  B. A positive number
- [ ]  C. A negative number
- [ ]  D. None of the above

<details>
<summary>Answer</summary>
A,B,C
<p>
The `_convertPreimageToNumber()` function takes in and returns a signed integer `int`, or more precisely a `int256` that can represent both positive and negative natural numbers - but it needs to do so using the same 256 bits as before. That means that the amount of positive numbers that can be represented needs to be reduced in order to make space for the negative ones.

The point where this split happens is at

`0x8000000000000000000000000000000000000000000000000000000000000000`

which represents the lowest number that the `int` type can represent (`type(int256).min == -57896044618658097711785492504343953926634992332820282019728792003956564819968`).

That this happens at this number is no coincidence. With the last byte going from `0x7f` to `0x80`, the highest bit `10000000` will now be set for all further numbers. Meaning, if you want to check whether the number is negative or positive, you simply have to check the most significant bit. This method of representation is called "two's complement".

Subtracting 1 from 0

`0x0000000000000000000000000000000000000000000000000000000000000000 - 1`

results in

`0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`

which represents `-1`

Before `_convertPreimageToNumber()` passes this signed preimage number to `_shuffleBits(uint(preimage))` it casts it to a signed integer. This doesn't change the actual value contained within the variable but its representation. If the `preimage` passed in was `-1` then, once cast to `uint`, it instead becomes the largest number that `uint256` can represent, but in reality was and still is `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`.

The value returned by `_shuffleBits()` is then cast back to a signed integer. Here again, the value doesn't change, rather, it depends whether the resulting value was above or below the where the split between positive and negative numbers happens. Depending on that the `int shuffled` variable becomes positive or negative.

Finally

`return shuffled < 0 ? -shuffled : shuffled;`

would make you expect that this function will only ever return positive numbers, but if we were to pass it the smallest possible signed integer

`0x8000000000000000000000000000000000000000000000000000000000000000 (-57896044618658097711785492504343953926634992332820282019728792003956564819968)`

it will return that very same number, in negative form.

The reason for this is that the positive range does not include that number without a sign. The maximum positive number representable is

`0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff (+57896044618658097711785492504343953926634992332820282019728792003956564819967)`

And as you can see, that is one too low to be able to represent that negative number as a positive one. So when solidity removes the negative sign, it just wraps around and gets back into the negative range again.
</p>
</details>

#### Q8
> How many valid preimages are there if `magicNumber == 1`?
- [ ]  A. 0
- [ ]  B. 1
- [ ]  C. 2
- [ ]  D. 3

<details>
<summary>Answer</summary>
C
<p>
Working backwards in `_convertPreimageToNumber()`, for it to return a 1

`return shuffled < 0 ? -shuffled : shuffled;`

The `shuffled` value either needs to be `-1` or `1`. Which is one of either:

```
0x0000000000000000000000000000000000000000000000000000000000000001 (+1)0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff (-1)
```

The `_shuffleBits()` function would have no impact on the `-1`'s value, therefore we already know that `-1` is one valid preimage for the magic number 1.

But for `_shuffleBits()` to return +1, the input would need to be that single bit shifted all the way to the right, which is:

`0x8000000000000000000000000000000000000000000000000000000000000000`

Making this two valid preimages for the magic number 1.
</p>
</details>