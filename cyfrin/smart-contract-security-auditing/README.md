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

</details>

### [Review](https://youtu.be/pUWmJ86X_do?t=1361)
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

#### What is an ERC721
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

#### Storage
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

#### Fallback and Receive
- By default, solidity smart contracts reject eth 
- A contract receiving ether must have either [fallback](https://solidity-by-example.org/fallback/) or [receive](https://solidity-by-example.org/sending-ether/)
	- receive is called if `msg.data` is empty
- When sending eth to a contract, the first check is whether or not `msg.data` is empty
	- If there is `msg.data`, it will go to the fall back function
	- if there is no `msg.data`, it will check if there is a `receive()` function
	- if there is no `receive()` function it will go to the `fallback()`
	- if there is no `fallback()` the contract can't receive eth

#### Abi encode
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

#### Encoding Functions
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

#### Upgradeable Contracts
- [Proxy upgrade pattern](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies)
- [delegatecall](https://solidity-by-example.org/delegatecall/)

#### Selfdestruct 
- [Selfdestruct](https://solidity-by-example.org/hacks/self-destruct/) will be removed in an upcoming hard fork
	- Contracts can be deleted from the blockchain by calling `selfdestruct`.
	- `selfdestruct` sends all remaining Ether stored in the contract to a designated address.
- If a contract doesn't have `receive` or `fallback`, it can't receive ETH. However, you could create another contract and `selfdestruct` sending ETH to a contract without `receive` or `fallback`

#### Fork Tests
- `forge test --fork-url <URL>`
	- You would use something like your alchemy URL for something like main net
	- This would allow us to work with main net/ test net contracts locally
- [`vm.createSelectFork`](https://book.getfoundry.sh/cheatcodes/create-select-fork)
	- Creates _and_ selects a new fork from the given endpoint and returns the identifier of the fork. If a block number is passed as an argument, the fork will begin on that block, otherwise it will begin on the _latest_ block.
	- If a transaction hash is provided, it will roll the fork to the block the transaction was mined in and replays all previously executed transactions.
```solidity
uint256 forkId = vm.createSelectFork(MAINNET_RPC_URL);
```

### [What is a smart contract audit](https://youtu.be/pUWmJ86X_do?t=6748)
#### What is a smart contract audit?
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

#### The audit process
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

#### Rekt test
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

#### Security Tools
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

#### What if a protocol I audit gets hacked?
- An audit should be valuable on its own merit beyond finding critical issues
	- Provide some value other than finding issues
	- The less critical issues you miss, the better
	- But auditors won't find all the issues
- Just because an auditor missed something, doesn't mean the protocol can use that as a scapegoat
	- So it is a good idea to have a private audit, run it through contests, and have a bug bounty program
	- The more audits done, the better off the protocol will be
- As an auditor, when a hack does happen, you can help contain the vulnerability or mitigate the attack
	- Your responsibility is limited to the agreement you signed with the client, but you should provide support for the clients that hired you when a hack occurs

#### Top Web3 Attacks
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


### [PasswordStore Audit](https://youtu.be/pUWmJ86X_do?t=8571)
#### Your First Security Review
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

#### Scoping: Etherscan
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

#### Scoping: Audit Details
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


#### Scoping: cloc
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