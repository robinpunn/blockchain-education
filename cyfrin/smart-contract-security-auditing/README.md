# [Smart Contract Security and Auditing](https://github.com/Cyfrin/security-and-auditing-full-course-s23) 

---

### Table of Contents

<details>

<summary> Lesson 1: Review </summary>

1. [Tooling Prerquisites](#table-of-contents)
2. [Solidity & Smart Contract Prerequisites](#solidity--smart-contract-prerequisites)
3. [Fuzzing and Invariants](#fuzzing-and-invariants)
4. [Install Libraries](#install-libraries)
4. [What is an ERC20](#what-is-an-erc20)

</details>

### [Review](https://www.youtube.com/watch?v=pUWmJ86X_do&t=15s)
#### Tooling Prerequisites
[Foundry](https://book.getfoundry.sh/)
    - chisel
    - cast
    - forge
- [Windows Users: WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- AI Helpers
    - ChatGPT
    - Phind
- Forums & Resources
    - Ethereum Stack Exchange
    - Peeranha
    - Github Discussions

#### Solidity & Smart Contract Prerequisites
- Should be familiar with [Remix](https://remix.ethereum.org/)
	- Compile
	- Deploy locally and deploy to test net using inject provider

**Foundry**
- Use foundry to create a project
	- make a directory: `mkdir directory-name`
    - `forge init --no-git` (use `--no-git` to avoid issues when creating a project already within a repository... not needed if creating a fresh project)
- Should be able to understand the following smart contract:
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```

- Use `forge build` to compile

**Testing**
- We have our tests in the `test` folder
	- run tests with `forge test`

```solidity
function test_Increment() public {
	counter.increment();
	assertEq(counter.number(), 1);
}
```
- This is a regular test where we expect a certain value

```solidity
function testFuzz_SetNumber(uint256 x) public {
	counter.setNumber(x);
	assertEq(counter.number(), x);
}
```
- This is a fuzz test that will use a certain number random numbers based on how many runs we set

- `foundry.toml` has a link for more info: https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
```
[fuzz]
runs = 256
max_test_rejects = 65536
seed = '0x3e8'
dictionary_weight = 40
include_storage = true
include_push_bytes = true
```
- This is how we can change the number of fuzz runs, by adding it to `foundry.toml`
- run a single test: `forge test --mt testName`

#### Fuzzing and Invariants
- [Video](https://www.youtube.com/watch?v=juyY-CTolac)

**Fuzz testing**
- Fuzz testing: supply random data to your system to break it
- Invariant:  Property of our system that should always hold
- In a normal unit test, we would pass a single variable and test the function
- Steps we need to follow
	1. Understand the Invariants
	2. Write a fuzz test for invariant

**Stateless Fuzz test**
- The state of the previous run is discarded for every new run

**Stateful Fuzzing**
- The final state of the previous run is the starting state of your next run
- To write a stateful fuzz test in foundry, we use the [`invariant`](https://book.getfoundry.sh/forge/invariant-testing) keyword
- Stateful fuzzing should call the functions in our contract in a random order with random data
```solidity
import {StdInvariant} from "forge-std/StdInvariant.sol";

contract MyContractTest is StdInvariant, Test {
	...
	function invariant_testAlwaysReturnsZero() public {
		assertEq(exampleContract.shouldAlwaysBeZero() == 0);
	}
}
```

**Foundry Specific**
- In foundry, fuzz tests means giving random data to one function
- In foundry, invariant test means giving random data and random function calls to many functions
- Foundry fuzzing = stateless fuzzing
- Foundry invariant = stateful fuzzing

**Examples of Invariants**
- New tokens minted < inflation rate
- Only possible to have 1 winner in a lottery
- Only withdraw what you deposit

#### Install Libraries
- [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts)
	- popular library for smart contracts

**Install OpenZeppelin Contracts**
- `forge install OpenZeppelin/openzeppelin-contracts --no-commit`

**Set remappings**
- `foundry.toml`:
```
remappings = ['@openzeppelin/contracts=lib/openzepplin-contracts/contracts']
```

**Import**
```solidity
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

**Set constructor**
```solidity
contract MyToken is ERC20 {
	constructor() ERC20("MyTokenName", "MTN"){}
}
```
- Gives us a minimal ERC20

#### What is an ERC20
- ERC20s are tokens that are deployed on a chain using the [ERC20 token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
	- And ERC20 is a smart contract (it's also a token)

- Why make an ERC20?
	- Governance tokens
	- Secure an underlying network
	- Create a synthetic asset
	- Anything else

- How do we create an ERC20?
	- All we have to do is create a smart contract that follows the ERC20 standard

- An ERC20 should have these methods:
```solidity
function name() public view returns (string) 
function symbol() public view returns (string) 
function decimals() public view returns (uint8) 
function totalSupply() public view returns (uint256) 
function balanceOf(address _owner) public view returns (uint256 balance) 
function transfer(address _to, uint256 _value) public returns (bool success) 
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) 
function approve(address _spender, uint256 _value) public returns (bool success) 
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```

- [ERC677](https://github.com/ethereum/EIPs/issues/677) improves on ERC20 but is still ERC20 compatible
	- Chainlink is an example

- [ERC777](https://docs.openzeppelin.com/contracts/3.x/erc777) is another improvement of the ERC20 that is still ERC20 compatible