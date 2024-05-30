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

#### The Tincho
- After scoping, we're ready to go into recon
- He doesn't have a "formal process", but there are general steps to take
**Audit Process**
1. download the code/ read the docs (at least the intro)
2. bring the tools you like best (if a project is using hardhat, use foundry if you want)
3. build small building blocks, by briefly analyzing the code
4. take notes, both in code and seperately
5. when you end up in rabbit holes filling in knowledge gaps, remember to stay focused on the audit
- [Tincho’s ENS Review](https://www.youtube.com/watch?app=desktop&v=A-T9F0anN1E)

#### Recon: Context
- Start by reading the docs
- [Solidity Metrics](https://github.com/Consensys/solidity-metrics)
	- For windows, I have to `Ctrl+Shift+P` and choose `Solidity Metrics: report for all open work spaces`
	- after running, use the command pallet again to export report

#### Recon: Understanding the code
- Looking for bugs is a direct result of understanding the codebase
- Run through the code line by line and take notes
- Notes
	- About the project, in my words
	- Attack vector ideas
- Well documented code makes things easier, but without it, an open line of communication with the devs is the only way to know intended effects

#### Exploit: Access Control
- Make sure functions that are meant to be restricted have proper access control
	- One of the reasons documentation/nat spec is important is so 

#### Exploit: Public Data
- All information on a blockchain is public
	- using the `private` keyword does not hide the variable

#### Protocol Tests
- For a private traditional audit, your goal is to do whatever you can to make the protocol more secure
	- Look into improving the protocol's tests and engineering best practices
- Tests can give you a hint into what the protcol is and isn't testing

#### Writing an amazing finding: Overview
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

#### Writing an amazing finding: Title
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

#### Writing an amazing finding: Description
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

#### Writing an amazing finding: Proof of code
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

#### Writing an amazing finding: Recommended Mitigation
- In the example protocol we're looking at, the whole protocol is useless because storing passwords on chain doesn't make sense
	- Having a security mindset when creating a password can help mitigate problems like this
- However, our goal is to help the protocol
```
Due to this, the overall architecture of the contract should be rethought. One could encrypt the password off-chain, and store the encrypted password on-chain. This would require the user to remember another password off-chain to decrypt the password. However, you'd also want to remove the view funtion as you wouldn't want the user to accidentally send a transaction with the password that decrypts your password.
```

#### Finding Writeup
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

#### Access Control Write up
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

#### Missing Access Controls Proof of Code
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

#### Finding Writeup Docs
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

####  Severity Rating Introduction
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


#### Assessing Highs
- Assess the impact 
	- Does it impact the funds?
	- Does it disrupt the protocol?
- Assess the likelihood
	- What is the probability of the finding occurring?
- Some would call a high impact and a high likelihood a critical

- Rank findings from high to medium to low
	- Rank each category starting with the worst offenders

#### Severity Rating Informational
- An informational finding can happen in a few ways
	- If there is no impact, then the likelihood doesn't matter. It's informational
	- If the likelihood is none, and the impact is high, it's still informational.
- It's not exactly a bug, but the protocol should be aware
- There can also be findings that are "gas improvements" and "non-crits"????

#### Timeboxing
- You can always review more lines of code, but you have to decide on a stopping point

#### Making a pdf
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




