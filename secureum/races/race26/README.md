### [Race 26](https://ventral.digital/posts/2024/1/30/race-26-of-the-secureum-bootcamp-epoch-infinity/)
#### Q1
```js
# @version 0.3.0

"""A simple vault contract

This contract implements a simple vault where users can deposit and withdraw
ether.
"""

userBalances: public(HashMap[address, uint256])

event Deposit:
    src: indexed(address)
    amount: uint256

event Transfer:
    src: indexed(address)
    dst: indexed(address)
    amount: uint256

event Withdrawal:
    src: indexed(address)
    amount: uint256

@external
@payable
def deposit():
    self.userBalances[msg.sender] += msg.value
    log Deposit(msg.sender, msg.value)

@external
@nonreentrant("withdraw")
def transfer(to: address, amount: uint256):
    if self.userBalances[msg.sender] >= amount:
        self.userBalances[msg.sender] -= amount
        self.userBalances[to] += amount
        log Transfer(msg.sender, to, amount)

@external
@nonreentrant("withdraw")
def withdrawAll():
    _balance: uint256 = self.userBalances[msg.sender]
    assert _balance > 0, "Insufficient balance"
    raw_call(msg.sender, b"", value=_balance)
    self.userBalances[msg.sender] = 0
    log Withdrawal(msg.sender, _balance)

@external
@view
def getBalance() -> uint256:
    return self.balance
```
- [ ]  A. The contract is vulnerable to reentrancy attacks
- [ ]  B. The contract is vulnerable to denial of service attacks
- [ ]  C. The contract is vulnerable to overflow attacks
- [ ]  D. None of the above

<details>

<summary>Answer</summary>

A

<p>
A: The [Vyper version used(opens in a new tab)](https://hackmd.io/@vyperlang/HJUgNMhs2), [`0.3.0`(opens in a new tab)](https://github.com/vyperlang/vyper/security/advisories/GHSA-5824-cm3x-3c38%22), is affected by a [compiler bug](https://ventral.digital/posts/2024/1/19/ethereum-smart-contract-auditors-2023-rewind/#vypers-compiler-bug) that allows cross-function reentrancy between `transfer()` and `withdrawAll()` despite the fact that both are using a `nonreentrant` decorator with the same mutex key. Effectively, an attacker could make a call to `withdrawAll()` to initiate the withdrawal of the deposit, but before the user balance is reset to 0, a `raw_call` is made back to `msg.sender`. This triggers a malicious contract's fallback handler, allowing the attacker to reenter the contract through `transfer()` and move the balance to another address before it is reset to 0. This process can be repeated over and over again until the entire vault is drained. There are two other Vyper versions affected by this bug: `0.2.15`, `0.2.16`. You can see how this affects the storage layout using the following compiler command: `vyper -f layout vault.vy`.
</p>
<p>
B: Would mean that the contract can be brought into a state that denies service to users. In this contract's case, there isn't really any state that is shared between users that would allow a permanent denial of service.
</p>
<p>
C: Vyper has native protection against arithmetic overflows: ["Bounds and overflow checking: On array accesses as well as on arithmetic level."](https://docs.vyperlang.org/en/latest/)
</p>

</details>


#### Q2
```js
# @version 0.3.7
 
"""A small vault implementation
 
This contract implements a simple vault where users can deposit and withdraw
ether, where the balances of each user are stored in a custom hashmap implementation to lower the number of users that can use the vault.
"""
 
MAX_USERS: constant(uint256) = max_value(uint64) + 2
_balances: uint256[MAX_USERS]
admin: public(address)
 
event AdminSet:
    admin: indexed(address)
 
event Deposit:
    src: indexed(address)
    amount: uint256
 
event Transfer:
    src: indexed(address)
    dst: indexed(address)
    amount: uint256
 
event Withdrawal:
    src: indexed(address)
    amount: uint256
 
@external
def __init__():
    self._set_admin(msg.sender)
 
@internal
@pure
def _indexer(_address: address) -> uint256:
    return convert(sha256(convert(_address, bytes32)), uint256) % MAX_USERS
 
@internal
@view
def _is_admin(_address: address) -> bool:
    return _address == self.admin
 
@internal
def _set_admin(_admin: address):
    self.admin = _admin
    log AdminSet(_admin) 
 
@external
def setAdmin(_admin: address):
    assert self._is_admin(msg.sender), "Only admin can set admin"
    self._set_admin(_admin)
 
@external
def userBalances(_address: address) -> uint256:
    return self._balances[self._indexer(msg.sender)]
 
@external
@payable
def deposit():
    self._balances[self._indexer(msg.sender)] = msg.value
    log Deposit(msg.sender, msg.value)
 
@external
@nonreentrant("withdraw")
def transfer(to: address, amount: uint256):
    if self._balances[self._indexer(msg.sender)] >= amount:
        self._balances[self._indexer(msg.sender)] -= amount
        self._balances[self._indexer(to)] += amount
        log Transfer(msg.sender, to, amount)
 
@external
@nonreentrant("withdraw")
def withdrawAll():
    _balance: uint256 = self._balances[self._indexer(msg.sender)]
    assert _balance > 0, "Insufficient balance"
 
    self._balances[self._indexer(msg.sender)] = 0
    raw_call(msg.sender, b"", value=_balance)
    
    log Withdrawal(msg.sender, _balance)
 
@external
@view
def getBalance() -> uint256:
    return self.balance
 
@external
def kill():
    assert self._is_admin(msg.sender), "Only admin can kill"
    selfdestruct(msg.sender)
```
- [ ]  A. The reentrancy locks are not necessary
- [ ]  B. The reentrancy locks do not protect against cross-function reentrancy
- [ ]  C. Collisions in the `_balances` array can occur in theory, but are unlikely to occur in practice
- [ ]  D. Collisions in the `_balances` array can occur both in theory and in practice


<details>

<summary>Answer</summary>

A,C

<p>
A: The functions correctly follow the Checks-Effects-Interactions pattern, therefore the reentrancy locks are indeed unnecessary.
</p>
<p>
B: The Vyper version used in this snippet has reentrancy locks that work as intended.
</p>
<p>
C/D: An address type consists of 20 bytes, which is 160 bits. The `_indexer()` function maps arbitrary addresses to a space that is around 64 bits - a much smaller than addresses. This theoretically allows finding two addresses that would map to the same index, but it would still be impractical to actually exploit this:
<br>
Let 𝑁N be the total possible indexes in our array (264+1264+1). Using the birthday paradox, the probability of a collision after using 𝑘k different addresses is 𝑃(𝑘)=1−𝑒−𝑘⋅(𝑘−1)2⋅(264+1)P(k)=1−e−2⋅(264+1)k⋅(k−1)​.
<br>
To have a 5050chance of collision, we must solve for 𝑘k in 0.5=1−𝑒−𝑘⋅(𝑘−1)2⋅(264+1)0.5=1−e−2⋅(264+1)k⋅(k−1)​, which has a solution 𝑘≈5056940000k≈5056940000, which implies that to have a 5050chance of collisions to occur, more than half of the entire planet must have an ethereum address and have interacted with the contract.
<br>
So, in practice, impossible.
</p>

</details>


#### Q3
Given the same Vyper contract from previous Question, select the true statement(s):

- [ ]  A. A malicious admin can steal all the funds in the contract
- [ ]  B. Anyone can hijack the admin in theory, but it is highly unlikely to happen in practice
- [ ]  C. Anyone can hijack the admin both in theory and in practice
- [ ]  D. None of the above

<details>

<summary>Answer</summary>

A,B

<p>
A: A malicious administrator can call the `kill()` function which executes `SELFDESTRUCT`. This will destroy the contract and send all of its balance to the `msg.sender` (the admin calling the function).
</p>
<p>
B/C: While the probability of a collision is very low, in theory one could call the contract from an address whose index (as returned from `_indexer()`) is 264264. The balance being written to this storage slot would break the contract because Vyper versions `<= 0.3.7` are affected by [a compiler bug(opens in a new tab)](https://github.com/vyperlang/vyper/security/advisories/GHSA-6m97-7527-mh74) that can cause storage clashes when large arrays are used.
</p>

</details>


#### Q4
Given the same Vyper contract from previous Question, what would be the Solidity equivalent of the `_indexer` function?

- [ ]  A. `function _indexer(address _address) private pure returns (uint256) { return uint256(sha256(abi.encodePacked(_address))) % MAX_USERS; }`
- [ ]  B. `function _indexer(address _address) internal view returns (uint256) { return uint256(sha256(abi.encode(_address))) % MAX_USERS; }`
- [ ]  C. `function _indexer(address _address) internal pure returns (uint256) { return uint256(sha256(abi.encodePacked(_address))) % MAX_USERS; }`
- [ ]  D. `function _indexer(address _address) internal pure returns (uint256) { return uint256(sha256(abi.encode(_address))) % MAX_USERS; }`

<details>

<summary>Answer</summary>

D

<p>
Like its Vyper equivalent, the function should be `internal` and `pure`, that leaves only options C and D. It cannot be C since the hash resulting from the input of `abi.encodePacked()` would not be equivalent to the `_indexer()` function due to its difference in encoding the address (it would not add zero-padding to the address to fill full 32 bytes).
</p>

</details>


#### Q5
Which function would be more suitable to deploy a Gnosis Safe module?

- [ ]  A. `create_minimal_proxy_to`
- [ ]  B. `create_copy_of`
- [ ]  C. `create_from_blueprint`
- [ ]  D. None of the above



<details>

<summary>Answer</summary>

A

<p>
All of these functions are ["built-ins"(opens in a new tab)](https://docs.vyperlang.org/en/stable/built-in-functions.html#chain-interaction) for contract creation: "All three contract creation built-ins rely on the code to deploy already being stored on-chain, but differ in call vs deploy overhead, and whether or not they invoke the constructor of the contract to be deployed."
<br>
`create_minimal_proxy_to(address, ...)` deploys an immutable proxy pointing to a specified implementation contract. Minimal proxies commonly are usually [EIP-1167 forwarder bytecode(opens in a new tab)](https://www.rareskills.io/post/eip-1167-minimal-proxy-standard-with-initialization-clone-pattern) and use `DELEGATECALL`s, making them cheap to deploy but expensive to call.
<br>
`create_copy_of(address, ...)` makes a copy of the runtime code at the specified address, making it expensive to deploy but cheaper to call than a proxy.
<br>
`create_from_blueprint(address, ...)` re-deploys the contract at the specified address by using its initialization code (ie. the constructor will be executed too). Being a copy instead of a contract makes it again expensive to deploy but cheaper to call.
<br>
In Safe Wallets, [modules follow EIP-1167(opens in a new tab)](https://github.com/gnosis/module-factory), which is what `create_minimal_proxy_to()` implements. In theory you could also use `create_from_blueprint()` to deploy a Gnosis Safe module, but it's much more complex to do so.
</p>

</details>


#### Q6
```js
# @version 0.3.7
 
"""A small vault implementation
 
This contract implements a simple vault where users can deposit and withdraw
ether, where the balances of each user are stored in a custom hashmap implementation to lower the number of users that can use the vault.
"""
 
MAX_USERS: constant(uint256) = max_value(uint64) + 2
_balances: uint256[MAX_USERS]
admin: public(address)
 
event AdminSet:
    admin: indexed(address)
 
event Deposit:
    src: indexed(address)
    amount: uint256
 
event Transfer:
    src: indexed(address)
    dst: indexed(address)
    amount: uint256
 
event Withdrawal:
    src: indexed(address)
    amount: uint256
 
@external
def __init__():
    self._set_admin(msg.sender)
 
@internal
@pure
def _indexer(_address: address) -> uint256:
    return convert(sha256(convert(_address, bytes32)), uint256) % MAX_USERS
 
@internal
@view
def _is_admin(_address: address) -> bool:
    return _address == self.admin
 
@internal
def _set_admin(_admin: address):
    self.admin = _admin
    log AdminSet(_admin) 
 
@external
def setAdmin(_admin: address):
    assert self._is_admin(msg.sender), "Only admin can set admin"
    self._set_admin(_admin)
 
@external
def userBalances(_address: address) -> uint256:
    return self._balances[self._indexer(msg.sender)]
 
@external
@payable
def deposit():
    self._balances[self._indexer(msg.sender)] = msg.value
    log Deposit(msg.sender, msg.value)
 
@external
@nonreentrant("withdraw")
def transfer(to: address, amount: uint256):
    if self._balances[self._indexer(msg.sender)] >= amount:
        self._balances[self._indexer(msg.sender)] -= amount
        self._balances[self._indexer(to)] += amount
        log Transfer(msg.sender, to, amount)
 
@external
@nonreentrant("withdraw")
def withdrawAll():
    _balance: uint256 = self._balances[self._indexer(msg.sender)]
    assert _balance > 0, "Insufficient balance"
 
    self._balances[self._indexer(msg.sender)] = 0
    raw_call(msg.sender, b"", value=_balance)
    
    log Withdrawal(msg.sender, _balance)
 
@external
@view
def getBalance() -> uint256:
    return self.balance
 
@external
def kill():
    assert self._is_admin(msg.sender), "Only admin can kill"
    selfdestruct(msg.sender)
```
- [ ]  A. This contract cannot be compiled as it calls an external function from another external function
- [ ]  B. `weird1` and `weird3` are equivalent
- [ ]  C. `weird2` and `weird3` will always revert
- [ ]  D. `weird1` and `weird4` are equivalent


<details>

<summary>Answer</summary>

D

<p>
A: The contract compiles just fine and there's no general problem with an external function calling another external function in Vyper.
<br>
B: The `weird3()` function does not encode the function signature correctly. Signature should be added through `method_id` instead of being ABI encoded as a parameter with padding.
<br>
C: The `weird2()` function, similarly to `weird3()`, does not correctly prepend the signature to the ABI encoded calldata. Furthermore, the signature isn't even calculated correctly since the hash is not reduced to 4 bytes. But, despite all this, this doesn't necessarily mean that they'll always revert.
<br>
D: Both `weird1()` and `weird4()` correctly use `method_id` to specify the function signature. Also, the result of `method_id("unsafeSum(uint256,uint256)")` is equivalent to hashing and shortening the string's hash down to 4 bytes, resulting in the same signature `0x4f388eb1`.
</p>

</details>


#### Q7
Under which circumstance(s) does the following function return `True`?
```js
# @version 0.3.7
 
@external
def fun(a: uint256, b: uint256) -> bool:
    return sqrt(a) == isqrt(b)
```
- [ ]  A. When `a == b`
- [ ]  B. When neither `a` nor `b` are perfect squares
- [ ]  C. When `a + b < 1 + 2*sqrt(a*b)`
- [ ]  D. None of the above


<details>

<summary>Answer</summary>

D

<p>
Both `sqrt()` and `isqrt()` are built-in functions for calculating the square root of a specified number. The difference is that `isqrt()` works with integers (`uint256`) and rounds down, while `sqrt()` uses Vyper's `decimal` type which is able to store a decimal fixed point value. Due to this difference in expected input types the above snippet will actually error during compilation.
</p>

</details>


#### Q8
Given the following broken Vyper contract, what changes are necessary so that the source code can be successfully compiled?
```js
# @version 0.3.7
 
from vyper.interfaces import ERC20
 
implements: ERC20
 
balances: public(HashMap[address, uint256])
allowed: public(HashMap[address, HashMap[address, uint256]])
total_supply: public(uint256)
 
event Transfer:
    from: indexed(address)
    to: indexed(address)
    value: uint256
 
event Approval:
    owner: indexed(address)
    spender: indexed(address)
    value: uint256
 
@external
def __init__(_initial_supply: uint256):
    self.total_supply = _initial_supply
 
@internal
def _mint(to: address, value: uint256):
    assert self.total_supply + value > self.total_supply
    assert self.balances[to] + value > self.balances[to]
 
    self.total_supply += value
    self.balances[to] += value
 
    log Transfer(empty(address), to, value)
 
@external
def allowance(owner: address, spender: address):
    pass
 
@external
def approve(spender: address, value: uint256):
    pass
 
@external
def balanceOf(owner: address) -> uint256:
    return self.balances[owner]
 
@external
def transfer(to: address, value: uint256) -> bool:
    assert self.balances[msg.sender] >= value
    assert self.balances[_to] + value >= self.balances[to]
 
    self.balances[msg.sender] -= value
    self.balances[to] += value
 
    log Transfer(msg.sender, to, value)
 
    return True
 
@external
def transferFrom(from: address, to: address, value: uint256) -> bool:
    assert self.balances[from] >= value
    assert self.balances[to] + value >= self.balances[to]
    assert self.allowed[from][msg.sender] >= value
 
    self.balances[to] += value
    self.balances[from] -= value
    self.allowed[from][msg.sender] -= value
 
    log Transfer(from, to, value)
 
    return True
 
@external
@payable
def __default__():
    self._mint(msg.sender, msg.value)
```
- [ ]  A. Replacing all variable and parameter name instances of `value` and `from` because they are reserved keywords
- [ ]  B. Implementing the `allowance` and `approve` functions as this is required by the ERC20 interface
- [ ]  C. Implementing a `totalSupply` function as this is required by the ERC20 interface
- [ ]  D. None of the above



<details>

<summary>Answer</summary>

A,C

<p>
A: In Vyper `from` is a keyword used in [relative imports(opens in a new tab)](https://github.com/vyperlang/vyper/issues/1367). The `value` keyword is reserved and cannot be used as a variable name in a function input.
<br>
B: The ERC20 interface does not require the `allowance()` and `approve()` functions to be implemented (ie. have an actual function body), it just needs them to be declared.
<br>
C: The `totalSupply()` function is in the interface and it's missing in the contract.
</p>

</details>