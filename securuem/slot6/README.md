## Slot 6 Audit Techniques and Tools 100

---
### Table of Contents
1. [Block 1](#block-1)
    1. [Audit](#1-audit)
    2. [Scope](#2-scope)
    3. [Goal](#3-goal)
    4. [Non-Goal](#4-non-goal)
    5. [Target](#5-target)
    6. [Need](#6-need)
    7. [Types](#7-types)
    8. [Timeline](#8-timeline)
    9. [Effort](#9-effort)
    10. [Cost](#10-cost)
    11. [Pre-reqs](#11-pre-reqs)
    12. [Limitations](#12-limitations)
    13. [Reports](#13-reports)
    14. [Classification](#14-classification)
    15. [Difficulty](#15-difficulty)
    16. [Impact](#16-impact)
    17. [Severity](#17-severity)
    18. [Checklist](#18-checklist)
    19. [Analysis Techniques](#19-analysis-techniques)
    20. [Specification](#20-specification)
2. [Block 2](#block-2)
	21. [Documentation](#21-documentation)
	22. [Testing](#22-testing)
	23. [Static Analysis](#23-static-analysis)
	24. [Fuzzing](#24-fuzzing)
	25. [Symbolic Checking](#25-symbolic-checking)
	26. [Formal Verification](#26-formal-verification)
	27. [Manual Analysis](#27-manual-analysis)
	28. [False Positives](#28-false-positives)
	29. [False Negatives](#29-false-negatives)
	30. [Audit Firms](#30-audit-firms)
	31. [Security Tools](#31-security-tools)
	32. [Categories of Security Tools](#32-categories-of-security-tools)
	33. [Slither Overview](#33-slither-overview)
	34. [Slither Features](#34-slither-features)
	35. [Slither Detectors](#35-slither-detectors)
	36. [Slither Printers](#36-slither-printers)
	37. [Slither Upgradeability](#37-slither-upgradeability)
	38. [Slither Code Similarity](#38-slither-code-similarity)
	39. [Slither Flat](#39-slither-flat)
	40. [Slither Format](#40-slither-format)
3. [Block 3](#block-3)
	41. [Slither ERC Conformance](#41-slither-erc-conformance)
	42. [Slither-Prop](#42-slither-prop)
	43. [Slither New Detectors](#43-slither-new-detectors)
	44. [Manticore](#44-manticore)
	45. [Echidna](#45-echidna)
	46. [Echidna Features](#46-echidna-features)
	47. [Echidna Usage](#47-echidna-usage)
	48. [Eth-security-toolbox](#48-eth-security-toolbox)
	49. [Ethersplay](#49-ethersplay)
	50. [Pyevmasm](#50-pyevmasm)
	51. [Rattle](#51-rattle)
	52. [Evm_cfg_builder](#52-evm_cfg_builder)
	53. [Crytic Compile](#53-crytic-compile)
	54. [Solc-selct](#54-solc-select)
	55. [Etheno](#55-etheno)
	56. [Mythx](#56-mythx)
	57. [Mythx process](#57-mythx-process)
	58. [Mythx tools](#58-mythx-tools)
	59. [Mythx Coverage](#59-mythx-coverage)
	60. [Mythx](#60-mythx)
4. [Block 4](#block-4)
	61. [MythX Privacy](#61-mythx-privacy)
	62. [MythX Performance](#62-mythx-performance)
	63. [MythX Versions](#63-mythx-versions)
	64. [MythX Pricing](#64-mythx-pricing)
	65. [Scribble](#65-scribble)
	66. [Fuzzing as a service](#66-fuzzing-as-a-service)
	67. [Karl](#67-karl)
	68. [Theo](#68-theo)
	69. [Visual Auditor](#69-visual-auditor)
	70. [Surya](#70-surya)
	71. [SWC Registry](#71-swc-registry)
	72. [Securify](#72-securify)
	73. [Verx](#73-verx)
	74. [Smartcheck](#74-smartcheck)
	75. [K-Framework](#75-k-framework)
	76. [Certora Prover](#76-certora-prover)
	77. [DappHubb's Hevm](#77-dapphubs-hevm)
	78. [Capture The Flag (CTF)](#78capture-the-flag-ctf)
	79. [Security Tools](#79-security-tools)
	80. [Audit Process](#80-audit-process)
---

### [Block 1](https://github.com/x676f64/secureum-mind_map)
#### 1. Audit
- An external security assessment of a project codebase, typically requested and paid-for by the project team
	1. It detects and describes (in a report) security issues with underlying vulnerabilities, severity/difficulty, potential exploit scenarios and recommended fixes.
	2. It also provides subjective insights into code quality, documentation and testing. 
	3. The scope/depth/format of audit reports varies across auditing teams but they generally cover similar aspects.
#### 2. Scope
- For Ethereum-based smart-contract projects, the scope is typically the on-chain smart contract code and sometimes includes the off-chain components that interact with the smart contracts.

#### 3. Goal
- The goal of audits is to assess project code (with any associated specification, documentation) and alert project team, typically before launch, of potential security-related issues that need to be addressed to improve security posture, decrease attack surface and mitigate risk.

#### 4. Non-Goal
- Audit is _not_ a security guarantee of “bug-free” code by any stretch of imagination but a best-effort endeavour by trained security experts operating within reasonable constraints of time, understanding, expertise and of course, decidability.

#### 5. Target
- Security companies execute audits for clients who pay for their services. 
- Engagements are therefore geared towards priorities of project owners and _not_ project users/investors. 
- Audits are _not_ intended to alert potential project users of any inherent risk. 
	- That is not their business/technical goal.

#### 6. Need
- Smart contract based projects  do not have sufficient in-house Ethereum smart contract security expertise and/or time to perform internal security assessments and therefore rely on external experts who have domain expertise in those areas. 
- Even if projects have some expertise in-house, they would still benefit from an unbiased external team with supplementary/complementary skill sets that can review the assumptions, design, specification and implementation of the project codebase.

#### 7. Types
- Depend on the scope/nature/status of projects but generally fall into the following categories:
	1. New audit: for a new project that is being launched
	2. Repeat audit: for a new version of an existing project being revised with new/fixed features
	3. Fix audit: for reviewing the fixes made to the findings from a current/prior audit
	4. Retainer audit: for constantly reviewing project updates
	5. Incident audit: for reviewing an exploit incident, root causing the incident, identifying the underlying vulnerabilities and proposing fixes.

#### 8. Timeline
- Depends on the scope/nature/status of the project to be assessed and the type of audit. 
- This may vary from a few days for a fix/retainer audit to several weeks for a new/repeat/incident audit.
- Can require months for projects with complex smart contracts that have many external dependencies
- The timeline should also depend on the anticipated value and criticality? 

#### 9. Effort
- Typically involves more than one auditor simultaneously for getting independent, redundant or supplementary/complementary assessment expertise on the project.

#### 10. Cost
- Depends on the type/scope of audit but typically costs upwards of USD $10K/week depending on the complexity of the project, market demand/supply for audits and the strength/reputation of the auditing firm.

#### 11. Pre-Reqs
- Audit Prerequisites should include:  
    1. Clear definition of the scope of the project to be assessed typically in the form of a specific  commit hash of project files/folders on a github repository
    2. Public/private repository
    3. Public/anonymous team
    4. Specification of the project’s design and architecture
    5. Documentation of the project’s implementation and business logic
    6. Threat models and specific areas of concern
    7. Prior testing, tools used, other audits
    8. Timeline, effort and costs/payments
    9. Engagement dynamics/channels for questions/clarifications, findings communication and reports
    10. Points of contact on both sides

#### 12. Limitations
- Audits are necessary (for now at least) but not sufficient:
	1. There is risk reduction but residual risk exists because of several factors such as limited amount of audit time/effort, limited insights into project specification/implementation, limited security expertise in the new and fast evolving technologies, limited audit scope, significant project complexity and limitations of automated/manual analysis.
	2. Not all audits are equal — it greatly depends on the expertise/experience of auditors, effort invested vis-a-vis project complexity/quality and tools/processes used.
	3. Audits provide a project’s security snapshot over a brief (typically few weeks) period. However, smart contracts need to evolve over time to add new features, fix bugs or optimize. Relying on external audits after every change is impractical.

#### 13. Reports
- Include details of the scope, goals, effort, timeline, approach, tools/techniques used, findings summary, vulnerability details, vulnerability classification, vulnerability severity/difficulty/likelihood, vulnerability exploit scenarios, vulnerability fixes and informational recommendations/suggestions on programming best-practices.
- Overall, an audit report is a comprehensive structured document that captures a lot of the above aspects in different levels of detail
- Most audits provide a report at the end or interim audits can also be shared depending on the duration and complexity of the audit
#### 14. Classification
- The vulnerabilities found during the audit are typically classified into different categories which helps to understand the nature of the vulnerability, potential impact/severity, impacted project components/functionality and exploit scenarios. 
- Trail of Bits, for example, uses the below classification:
	1. Access Controls: Related to authorization of users and assessment of rights
	2. Auditing and Logging: Related to auditing of actions or logging of problems
	3. Authentication: Related to the identification of users
	4. Configuration: Related to security configurations of servers, devices or software
	5. Cryptography: Related to protecting the privacy or integrity of data
	6. Data Exposure: Related to unintended exposure of sensitive information
	7. Data Validation: Related to improper reliance on the structure or values of data
	8. Denial of Service: Related to causing system failure
	9. Error Reporting: Related to the reporting of error conditions in a secure fashion
	10. Patching: Related to keeping software up to date
	11. Session Management: Related to the identification of authenticated users
	12. Timing: Related to race conditions, locking or order of operations
	13. Undefined Behavior: Related to undefined behavior triggered by the program
- Other auditing firms may use slightly different classification, but there is usually overlap.

#### 15. Difficulty
- Per [OWASP](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology), likelihood or difficulty is a rough measure of how likely or difficult this particular vulnerability is to be uncovered and exploited by an attacker. 
- OWASP proposes three Likelihood levels of Low, Medium and High. 
- Some audit firms use OWASP, but others use their own terminology and ranking because OWASP doesn't apply very well to web3 in general
- Trail of Bits, for example, classifies every finding into four difficulty levels:
	1. Undetermined: The difficulty of exploit was not determined during this engagement
	2. Low: Commonly exploited, public tools exist or can be scripted that exploit this flaw
	3. Medium: Attackers must write an exploit, or need an in-depth knowledge of a complex system
	4. High: The attacker must have privileged insider access to the system, may need to know extremely complex technical details or must discover other weaknesses in order to exploit this issue
- Irrespective of the subjective nature of difficulty, the relative classification across the three or four categories is what is important 
	- This aspect should be consistently applied to all the findings within the scope of the audit

#### 16. Impact
- Per OWASP, this estimates the magnitude of the technical and business impact on the system if the vulnerability were to be exploited. 
- OWASP proposes three Impact levels of Low, Medium and High but this needs to be revisited for web3 because the impact from smart contract vulnerabilities and their exploits is generally very high
	- High Impact: Usually reserved for vulnerabilities causing loss or locking of funds that may be triggered by any unauthorized user
	- Medium Impact: Reserved for vulnerabilities that effect the application in some significant way, but do not immediately lead to loss of funds
	- Low Impact: anything that isn't considered high or medium

#### 17. Severity
- Per OWASP, the Likelihood estimate and the Impact estimate are put together to calculate an overall Severity for this risk. 
- This is done by figuring out whether the Likelihood is Low, Medium, or High and then do the same for impact.
	1. OWASP proposes a 3x3 Severity Matrix which combines the three Likelihood levels with the three Impact levels
	2. Severity Matrix (Likelihood-Impact = Severity): 
		1. Low-Low = Note; 
		2. Low-Medium = Low; 
		3. Low-High = Medium; 
		4. Medium-Low = Low; 
		5. Medium-Medium = Medium; 
		6. Medium-High = High; 
		7. High-Low = Medium; 
		8. High-Medium = High; 
		9. High-High = Critical;
	3. Trail of Bits uses:
	    1. Informational: 
		    - The issue does not pose an immediate risk, but is relevant to security best practices or Defense in Depth
	    2. Undetermined: 
		    - The extent of the risk was not determined during this engagement
	    3. Low: 
		    - The risk is relatively small or is not a risk the customer has indicated is important
	    4. Medium: 
		    - Individual user’s information is at risk, exploitation would be bad for client’s reputation, moderate financial impact, possible legal implications for client
	    5. High: 
		    - Large numbers of users, very bad for client’s reputation, or serious legal or financial implications
	4. ConsenSys uses:
	    1. Minor: 
		    - Issues are subjective in nature. 
		    - They are typically suggestions around best practices or readability. 
		    - Code maintainers should use their own judgment as to whether to address such issues.
	    2. Medium: 
		    - Issues are objective in nature but are not security vulnerabilities. 
		    - These should be addressed unless there is a clear reason not to.
	    3. Major: 
		    - Issues are security vulnerabilities that may not be directly exploitable or may require certain conditions in order to be exploited. All major issues should be addressed.
	    4. Critical: 
		    - Issues are directly exploitable security vulnerabilities that need to be fixed.

#### 18. Checklist
- A checklist for projects to get ready for an audit is helpful so that audit firms can assume some level of readiness when the audit starts
- Trail of bits recommends a checklist that has three broad categories: test, review, and document
	- Test: enable and address every compiler warning (below is from their [site](https://blog.trailofbits.com/2018/04/06/how-to-prepare-for-a-security-audit/))
1. Resolve the easy issues: 
	1) Enable and address every last compiler warning 
	2) Increase unit and feature test coverage 
	3) Remove dead code, stale branches, unused libraries, and other extraneous weight.
2. Document: 
	1) Describe what your product does, who uses it, why, and how it delivers. 
	2) Add comments about intended behavior in-line with the code. 
	3) Label and describe your tests and results, both positive and negative. 
	4) Include past reviews and bugs.
3. Deliver the code batteries included: 
	1) Document the steps to create a build environment from scratch on a computer that is fully disconnected from your internal network 
	2) Include external dependencies 
	3) Document the build process, including debugging and the test environment 
	4) Document the deployment process and environment, including all the specific versions of external tools and libraries for this process.

#### 19. Analysis Techniques
- Involve a combination of different methods that are applied to the project codebase with accompanying specification and documentation. 
- Many are automated analyses performed with tools and some require manual assistance.
	1. Specification analysis (manual)
	2. Documentation analysis (manual)
	3. Testing (automated)
	4. Static analysis (automated)
	5. Fuzzing (automated)
	6. Symbolic checking (automated)
	7. Formal verification (automated)
	8. Manual analysis (manual)
- One may also think of these as manual/semi-automated/fully-automated, where the distinction between semi-automated and fully-automated is the difference between a tool that requires a user to define properties versus a tool that requires (almost) no user configuration except to triage results. 
- Fully-automated tools tend to be straightforward to use, while semi-automated tools require some human assistance and are therefore more resource-expensive.

#### 20. Specification
- Specification describes in detail what (and sometimes why) the project and its various components are supposed to do functionally as part of their design and architecture. 
	1. From a security perspective, it specifies what the assets are, where they are held, who are the actors, privileges of actors, who is allowed to access what and when, trust relationships, threat model, potential attack vectors, scenarios and mitigations. 
	2. Analyzing the specification of a project provides auditors with the above details and lets them evaluate the assumptions made and indicate any shortcomings
	3. Very few smart contract projects have detailed specifications at their first audit stage. 
		- At best, they have some documentation about what is implemented. 
		- Auditors spend a lot of time inferring specification from documentation/implementation which leaves them with less time for vulnerability assessment.


### [Block 2](https://www.youtube.com/watch?v=QstpNY1IuqM)
#### 21. Documentation
- Documentation is a description of what has been implemented based on the design and architectural requirements.
    1. Documentation answers ‘how’ something has been designed/architected/implemented without necessarily addressing the ‘why’ and the design/requirement goals
    2. Documentation is typically in the form of Readme files in the Github repository describing individual contract functionality combined with functional NatSpec and individual code comments.
    3. Documentation in many cases serves as a substitute for specification and provides critical insights into the assumptions, requirements and goals of the project team
    4. Understanding the documentation before looking at the code helps auditors save time in inferring the architecture of the project, contract interactions, program constraints, asset flow, actors, threat model and risk mitigation measures
    5. Mismatches between the documentation and the code could indicate stale/poor documentation, software defects or security vulnerabilities
    6. Auditors are expected to encourage the project team to document thoroughly so that they do not need to waste their time inferring this by reading code

#### 22. Testing
- Software testing or validation is a well-known fundamental software engineering primitive to determine if software produces expected outputs when executed with different chosen inputs.
	1. Smart contract testing has a similar motivation but is arguably more complicated despite their relatively smaller sizes (in lines of code) compared to Web2 software
	2. Smart contract development platforms (Truffle, Embark, Brownie, Waffle, Hardhat etc.) are relatively new with different levels of support for testing
	3. Projects, in general, have very little testing done at the audit stage. Testing integrations and composability with mainnet contracts and state is non-trivial
	4. Test coverage and test cases give a good indication of project maturity and also provide valuable insights to auditors into assumptions/edge-cases for vulnerability assessments
	5. Auditors should expect a high-level of testing and test coverage because this is a must-have software-engineering discipline, especially when smart contracts that are by-design exposed to everyone on the blockchain end up holding assets worth tens of millions of dollars
	6. "Program testing can be used to show the presence of bugs, but never to show their absence!” - E.W. Dijkstra

#### 23. Static Analysis
- A technique of analyzing program properties without actually executing the program.
	1. This is in contrast to software testing where programs are actually executed/run with different inputs
	2. For smart contracts, static analysis can be performed on the Solidity code or on the EVM bytecode. [Slither](https://github.com/crytic/slither) performs static analysis at the Solidity level while [Mythril](https://github.com/ConsenSys/mythril) analyzes EVM bytecode.
		- Also, [Maru](https://blog.mythx.io/features/mythx-tech-behind-the-scenes-of-smart-contract-analysis/) is mentioned... while Mythril is used as an example in symbolic checking
	3. Static analysis typically is a combination of control flow and data flow analyses

#### 24. Fuzzing
- Fuzz testing is an automated software testing technique that involves providing invalid, unexpected, or random data as inputs to a computer program.
- The program is then monitored for exceptions such as crashes, failing built-in code assertions, or potential memory leaks
	1. Fuzzing is especially relevant to smart contracts because anyone can interact with them on the blockchain with random inputs without necessarily having a valid reason or expectation (arbitrary byzantine behaviour)
	2. [Echidna](https://github.com/crytic/echidna) and [Harvey](https://mariachris.github.io/Pubs/FSE-2020-Harvey.pdf) are two popular tools for smart contract fuzzing

#### 25. Symbolic Checking
- A technique of checking for program correctness, i.e. proving/verifying, by using symbolic inputs to represent set of states and transitions instead of enumerating individual states/transitions separately
	1. Model checking or property checking is a method for checking whether a finite-state model of a system meets a given specification (also known as correctness)
	2. In order to solve such a problem algorithmically, both the model of the system and its specification are formulated in some precise mathematical language. To this end, the problem is formulated as a task in logic, namely to check whether a structure satisfies a given logical formula.
	3. A simple model-checking problem consists of verifying whether a formula in the propositional logic is satisfied by a given structure
	4. Instead of enumerating reachable states one at a time, the state space can sometimes be traversed more efficiently by considering large numbers of states at a single step. When such state space traversal is based on representations of a set of states and transition relations as logical formulas, binary decision diagrams (BDD) or other related data structures, the model-checking method is symbolic.
	5. Model-checking tools face a combinatorial blow up of the state-space, commonly known as the state explosion problem, that must be addressed to solve most real-world problems
	6. Symbolic algorithms avoid explicitly constructing the graph for the finite state machines (FSM); instead, they represent the graph implicitly using a formula in quantified propositional logic
	7.  [Manticore](https://github.com/trailofbits/manticore) and Mythril are two examples3

#### 26. Formal Verification
- The act of proving or disproving the correctness of intended  algorithms underlying a system with respect to a certain formal specification or property, using formal methods of mathematics
	1. Formal verification is effective at detecting complex bugs which are hard to detect manually or using simpler automated tools
	2. Formal verification needs a specification of the program being verified and techniques to translate/compare the specification with the actual implementation
	3. [Certora’s](https://www.certora.com/) Prover and ChainSecurity’s [VerX](http://verx.ch/) are examples of formal verification tools for smart contracts. [KEVM](https://github.com/kframework/evm-semantics) from Runtime Verification Inc is a formal verification framework that models EVM semantics.

#### 27. Manual Analysis
- Complimentary to automated analysis using tools and serves a critical need in smart contract audits
	1. Automated analysis using tools is cheap (typically open-source free software), fast, deterministic and scalable (varies depending on the tool being semi-/fully-automated) but however is only as good as the properties it is made aware of, which is typically limited to Solidity and EVM related constraints
	2. Manual analysis with humans, in contrast, is expensive, slow, non-deterministic and not scalable because human expertise in smart contact security is a rare/expensive skill set today and we are slower, prone to error and inconsistent.
	3. Manual analysis is however the only way today to infer and evaluate business logic and application-level constraints which is where a majority of the serious vulnerabilities are being found

#### 28. False Positives
- Findings which indicate the presence of vulnerabilities but which in fact are not vulnerabilities.
- Such false positives could be due to incorrect assumptions or simplifications in analysis which do not correctly consider all the factors required for the actual presence of vulnerabilities.
	1. False positives require further manual analysis on findings to investigate if they are indeed false or true positives
	2. High number of false positives increases manual effort in verification and lowers the confidence in the accuracy of the earlier automated/manual analysis
	3. True positives might sometimes be classified as false positives which leads to vulnerabilities being exploited instead of being fixed

#### 29. False Negatives
- Missed findings that should have indicated the presence of vulnerabilities but which are in fact are not reported at all.
- Such false negatives could be due to incorrect assumptions or inaccuracies in analysis which do not correctly consider the minimum factors required for the actual presence of vulnerabilities.
    1. False negatives, per definition, are not reported or even realised unless a different analysis reveals their presence or the vulnerabilities are exploited
    2. High number of false negatives lowers the confidence in the effectiveness of the earlier manual/automated analysis.

#### 30. Audit Firms
- There are several teams or firms that have security expertise and provide auditing services
- Some have a web2 origin from the traditional audit space while others are specialized specifically in smart contract audits
	- [ABDK](https://www.abdk.consulting/)
	- [Arcadia](https://arcadiamgroup.com/)
	- [Beosin](https://www.cybersecurityintelligence.com/beosin-5834.html)
	- [Blockchain Consilium](https://www.blockchainconsilium.com/)
	- [BlockSec](https://www.blocksecteam.com/)
	- [CertiK](https://certik.io/)
	- [ChainSafe](https://chainsafe.io/)
	- [ChainSecurity](https://chainsecurity.com/)
	- [Chainsulting](https://chainsulting.de/smart-contract-audit/)
	- [CoinFabrik](https://www.coinfabrik.com/services/smart-contract-audits/)
	- [ConsenSys Diligence](https://consensys.net/diligence/)
	- [Dedaub](https://www.dedaub.com/)
	- [G0](https://github.com/g0-group)
	- [Hacken](https://hacken.io/)
	- [Haechi](https://audit.haechi.io/)
	- [Halborn](https://halborn.com/)
	- [HashEx](https://hashex.org/smart_contracts_and_audit/)
	- [Iosiro](https://iosiro.com/services/smart-contract-auditing)
	- [Least Authority](https://leastauthority.com/)
	- [MixBytes](https://mixbytes.io/audit)
	- [NCC](https://www.nccgroup.com/us/our-services/cyber-security/specialist-practices/cryptography-services/blockchain-security/)
	- [NewAlchemy](https://audits.newalchemy.io/)
	- [OpenZeppelin](https://openzeppelin.com/)
	- [PeckShield](https://peckshield.com/en)
	- [Pessimistic](https://pessimistic.io/)
	- [PepperSec](https://peppersec.com/smart-contract-audit.html)
	- [Pickle](https://pickle.solutions/security-audits/)
	- [Quantstamp](https://quantstamp.com/)
	- [QuillHash](https://audits.quillhash.com/smart-contract-audit)
	- [Runtime Verification](https://runtimeverification.com/)
	- [Sigma Prime](https://sigmaprime.io/)
	- [SlowMist](https://www.slowmist.com/en/)
	- [SmartDec](https://smartdec.net/)
	- [Solidified](https://solidified.io/)
	- [Somish](https://www.somish.com/blockchain/smart-contract-audit/)
	- [Trail of Bits](https://www.trailofbits.com/)
	- [Zokyo](https://www.zokyo.io/)

#### 31. Security Tools
- Critical in assisting smart contract developers and auditors with showcasing (potentially) exploitable vulnerabilities, highlighting dangerous programming styles or surfacing common patterns of misuse.
- None of these however replace the need for manual review/validation to evaluate contract-specific business logic and other complex control-flow, data-flow & value-flow aspects.

#### 32. Categories of Security Tools
- Tools for:
	- testing
	- test coverage
	- linting
	- disassembling
	- visualization
	- static analysis
	- symbolic checking
	- fuzzing
	- formal verification
	- monitoring and instant? response tools

#### 33. Slither Overview
- 20. [Slither](https://github.com/crytic/slither) is a Solidity static analysis framework written in Python 3.
- It runs a suite of vulnerability detectors, prints visual information about contract details, and provides an API to easily write custom analyses.
- Slither enables developers to find vulnerabilities, enhance their code comprehension, and quickly prototype custom analyses.
- It implements [74 detectors](https://github.com/crytic/slither#detectors) in the publicly available free version (with [trophies](https://github.com/crytic/slither/blob/master/trophies.md) that showcase Slither findings in real-world contracts).

#### 34. Slither features
1. Detects vulnerable Solidity code with low false positives
2. Identifies where the error condition occurs in the source code
3. Easily integrates into continuous integration and Truffle builds
4. Built-in 'printers' quickly report crucial contract information
5. Detector API to write custom analyses in Python
6. Ability to analyze contracts written with Solidity >= 0.4
7. Intermediate representation (SlithIR) enables simple, high-precision analyses
8. Correctly parses 99.9% of all public Solidity code
9. Average execution time of less than 1 second per contract

#### 35. Slither Detectors
- Slither bugs and optimizations detection can run on a Truffle/Embark/Dapp/Etherlime/Hardhat application or on a single Solidity file:
	1. Slither runs all its detectors by default.
		1. To run only selected detectors, use _--detect detector1,detector2_.
		2. To exclude detectors, use _--exclude detector1,detector2_.
	2. To exclude detectors with an informational or low severity, use _--exclude-informational_ or _--exclude-low_
	3. _--list-detectors_ lists available detectors
- Two specific examples of detectors are: reentrancy-eth and unprotected-upgrade

#### 36. Slither Printers
- Slither printers allow printing contract information with _--print_ and following options (with contract-summary, human-summary, and inheritance-graph for quick review, and others such as call-graph, cfg, function-summary and vars-and-auth for in-depth review):
	1. call-graph: Export the call-graph of the contracts to a dot file
	2. cfg: Export the CFG of each functions
	3. constructor-calls: Print the constructors executed
	4. contract-summary: Print a summary of the contracts
	5. data-dependency: Print the data dependencies of the variables
	6. echidna: Export Echidna guiding information
	7. evm: Print the evm instructions of nodes in functions
	8. function-id: Print the keccack256 signature of the functions
	9. function-summary: Print a summary of the functions
	10. human-summary: Print a human-readable summary of the contracts
	11. inheritance: Print the inheritance relations between contracts
	12. inheritance-graph: Export the inheritance graph of each contract to a dot file
	13. modifiers: Print the modifiers called by each function
	14. require: Print the require and assert calls of each function
	15. slithir: Print the slithIR representation of the functions
	16. slithir-ssa: Print the slithIR representation of the functions
	17. variable-order: Print the storage order of the state variables
	18. vars-and-auth: Print the state variables written and the authorization of the functions

#### 37. Slither Upgradeability
- Slither upgradeability checks helps review contracts that use the delegatecall proxy pattern using _slither-check-upgradeability_ tool with following options:
	1. became-constant: Variables that should not be constant
	2. function-id-collision: Functions ids collision
	3. function-shadowing: Functions shadowing
	4. missing-calls: Missing calls to init functions
	5. missing-init-modifier: initializer() is not called
	6. multiple-calls: Init functions called multiple times
	7. order-vars-contracts: Incorrect vars order with the v2
	8. order-vars-proxy: Incorrect vars order with the proxy
	9. variables-initialized: State variables with an initial value
	10. were-constant: Variables that should be constant
	11. extra-vars-proxy: Extra vars in the proxy
	12. missing-variables: Variable missing in the v2
	13. extra-vars-v2: Extra vars in the v2
	14. init-inherited: Initializable is not inherited
	15. init-missing: Initializable is missing
	16. initialize-target: Initialize function that must be called
	17. initializer-missing: initializer() is missing

#### 38. Slither Code Similarity
- Slither [code similarity detector](https://blog.trailofbits.com/2020/10/23/efficient-audits-with-machine-learning-and-slither-simil/) (a research-oriented tool) uses state-of-the-art machine learning to detect similar (vulnerable) Solidity functions
	1. It uses a pre-trained model from etherscan_verified_contracts with 60,000 contracts and more than 850,000 functions
	2. It uses FastText, a vector embedding technique, to generate compact numerical representations of every function
	3. It has four modes:
		-  _test_ - finds similar functions to your own in a dataset of contracts
		-  _plot_ - provide a visual representation of similarity of multiple sampled functions
		-  _train_ - builds new models of large datasets of contracts
		- _info_ - inspects the internal information of the pre-trained model or the assessed code

#### 39. Slither Flat
- Slither contract flattening tool _slither-flat_ produces a flattened version of the codebase with the following features:
	1. Supports three strategies:
		- MostDerived: Export all the most derived contracts (every file is standalone)
		- OneFile: Export all the contracts in one standalone file
		- LocalImport: Export every contract in one separate file, and include import ".." in their preludes
	2. Supports circular dependency
	3. Supports all the compilation platforms (Truffle, embark, buidler, etherlime, ...).

#### 40. Slither-Format
- Slither format tool _slither-format_ generates automatically patches. The patches are compatible with git. Patches should be carefully reviewed before applying. Detectors supported with this tool are:
	1. unused-state
	2. solc-version
	3. pragma
	4. naming-convention
	5. external-function
	6. constable-states
	7. constant-function


### [Block 3](https://www.youtube.com/watch?v=QmD2bJUe140)
#### 41. Slither ERC Conformance
- Slither ERC conformance tool _slither-check-erc_ checks the following for ERC's conformance for ERC20, ERC721, ERC777, ERC165, ERC223 and ERC1820:
	1. All the functions are present
	2. All the events are present
	3. Functions return the correct type
	4. Functions that must be view are view
	5. Events' parameters are correctly indexed
	6. The functions emit the events
	7. Derived contracts do not break the conformance

#### 42. Slither-Prop
- Slither property generation tool _slither-prop_ generates code properties (e.g., invariants) that can be tested with unit tests or Echidna, entirely automatically. The ERC20 scenarios that can be tested are:
	1. Transferable - Test the correct tokens transfer
	2. Pausable - Test the pausable functionality
	3. NotMintable - Test that no one can mint tokens
	4. NotMintableNotBurnable - Test that no one can mint or burn tokens
	5. NotBurnable - Test that no one can burn tokens
	6. Burnable - Test the burn of tokens. Require the "burn(address) returns()" function

#### 43. Slither New Detectors
- Slither’s plugin architecture lets you integrate new detectors that run from the command line. The skeleton for a detector has:
	1. _ARGUMENT_: lets you run the detector from the command line
	2. _HELP_: is the information printed from the command line
	3. _IMPACT_: indicates the impact of the issue. Allowed values are INFORMATIONAL|LOW|MEDIUM|HIGH
	4. _CONFIDENCE_: indicates your confidence in the analysis. Allowed values are LOW|MEDIUM|HIGH
	5. _WIKI_: constants are used to generate automatically the documentation.
	6. ``detect()`` is the function that implements the detector logic and needs to return a list of findings.

#### 44. [Manticore](https://github.com/trailofbits/manticore)
- A symbolic execution tool for analysis of Ethereum smart contracts (besides Linux binaries & WASM modules). See [tutorial](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/manticore) for details.
	1. Program Exploration: Manticore can execute a program with symbolic inputs and explore all the possible states it can reach
	2. Input Generation: Manticore can automatically produce concrete inputs that result in a given program state
	3. Error Discovery: Manticore can detect crashes and other failure cases in binaries and smart contracts
	4. Instrumentation: Manticore provides fine-grained control of state exploration via event callbacks and instruction hooks
	5. Programmatic Interface: Manticore exposes programmatic access to its analysis engine via a Python API

#### 45. [Echidna](https://github.com/crytic/echidna)
- A Haskell program designed for fuzzing/property-based testing of Ethereum smart contracts that compliments Slither and Manticore.
- It uses sophisticated grammar-based fuzzing campaigns based on a contract ABI to falsify user-defined predicates or Solidity assertions.

#### 46. Echidna Features
1. Generates inputs tailored to your actual code
2. Optional corpus collection, mutation and coverage guidance to find deeper bugs
3. Powered by Slither to extract useful information before the fuzzing campaign
4. Source code integration to identify which lines are covered after the fuzzing campaign
5. Curses-based retro UI, text-only or JSON output
6. Automatic test case minimization for quick triage
7. Seamless integration into the development workflow
8. Maximum gas usage reporting of the fuzzing campaign
9. Support for a complex contract initialization with Etheno and Truffle

#### 47. Echidna Usage
-  [Tutorial](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna#echidna-tutorial) for details)
	1. Executing the test runner:
		- The core Echidna functionality is an executable called echidna-test.
		- echidna-test takes a contract and a list of invariants (properties that should always remain true) as input.
		- For each invariant, it generates random sequences of calls to the contract and checks if the invariant holds.
		- If it can find some way to falsify the invariant, it prints the call sequence that does so.
		- If it can't, you have some assurance the contract is safe.
	2. Writing invariants:
		- Invariants are expressed as Solidity functions with names that begin with echidna_, have no arguments, and return a boolean.
	3. Collecting and visualizing coverage:
		- After finishing a campaign, Echidna can save a coverage maximizing corpus in a special directory specified with the corpusDir config option.
		- This directory will contain two entries:
			1) a directory named coverage with JSON files that can be replayed by Echidna and
			2) a plain-text file named covered.txt, a copy of the source code with coverage annotations.
#### 48. [Eth-security-toolbox](https://github.com/crytic/eth-security-toolbox)
- A Docker container preinstalled and preconfigured with all of Trail of Bits’ Ethereum security tools.
- This includes:
	1. Echidna property-based fuzz tester
	2. Etheno integration tool and differential tester
	3. Manticore symbolic analyzer and formal contract verifier
	4. Slither static analysis tool
	5. Rattle EVM lifter
	6. Not So Smart Contracts repository

#### 49. [Ethersplay](https://github.com/crytic/ethersplay)
- A Binary Ninja plugin which enables an EVM disassembler and related analysis tools.
	1. Takes as input the evm bytecode in raw binary format
	2. Renders control flow graph of all functions
	3. Shows Manticore coverage
#### 50. [Pyevmasm](https://github.com/crytic/pyevmasm)
- An assembler and disassembler library for the Ethereum Virtual Machine (EVM).
- It includes a command line utility and a Python API.

#### 51. [Rattle](https://github.com/crytic/rattle)
- An EVM binary static analysis framework designed to work on deployed smart contracts (not actively developed anymore).
	1. Takes EVM byte strings and uses a flow-sensitive analysis to recover the original control flow graph
	2. Lifts the control flow graph into an SSA/infinite register form, and optimizes the SSA – removing DUPs, SWAPs, PUSHs, and POPs
	3. The conversion from a stack machine to SSA form removes 60%+ of all EVM instructions and presents a much friendlier interface to those who wish to read the smart contracts they’re interacting with

#### 52. [Evm_cfg_builder](https://github.com/crytic/evm_cfg_builder)
- A tool used to extract a control flow graph (CFG) from EVM bytecode and used by Ethersplay, Manticore, and other tools from Trail of Bits.
	1. Reliably recovers a Control Flow Graph (CFG) from EVM bytecode using a dedicated Value Set Analysis
	2. Recovers functions names
	3. Recovers attributes (e.g., payable, view, pure)
	4. Outputs the CFG to a dot file
	5. Library API

#### 53. [Crytic-compile](https://github.com/crytic/crytic-compile)
- A smart contract compilation library which is used in Trail of Bits’ security tools and supports Truffle, Embark, Etherscan, Brownie, Waffle, Hardhat and other development environments.
- The plugin is used in Crytic tools, including:
	1. Slither
	2. Echidna
	3. Manticore
	4. evm-cfg-builder

#### 54. [Solc-select](https://github.com/crytic/solc-select)
- A script to quickly switch between Solidity compiler versions.
	1. solc-select: manages installing and setting different solc compiler versions
	2. solc: wrapper around solc which picks the right version according to what was set via solc-select
	3. solc binaries are downloaded from https://binaries.soliditylang.org/ which contains official artifacts for many historical and modern solc versions for Linux and macOS

#### 55. [Etheno](https://github.com/crytic/etheno)
- The Ethereum testing Swiss Army knife.
- It’s a JSON RPC multiplexer, analysis tool wrapper, and test integration tool.
	1. JSON RPC Multiplexing:
		- Etheno runs a JSON RPC server that can multiplex calls to one or more clients:
			1) API for filtering and modifying JSON RPC calls
			2) Enables differential testing by sending JSON RPC sequences to multiple Ethereum clients
			3) Deploy to and interact with multiple networks at the same time
	2. Analysis Tool Wrapper:
		- Etheno provides a JSON RPC client for advanced analysis tools like Manticore
			1) Lowers barrier to entry for using advanced analysis tools
			2) No need for custom scripts to set up account and contract state
			3) Analyze arbitrary transactions without Solidity source code
	3. Integration with Test Frameworks like Ganache and Truffle:
		1) Run a local test network with a single command
		2) Use Truffle migrations to bootstrap Manticore analyses
		3) Symbolic semantic annotations within unit tests

#### 56. [MythX](https://mythx.io/)
- A powerful security analysis service that finds Solidity vulnerabilities in your Ethereum smart contract code during your development life cycle.
- It is a [paid API-based service](https://mythx.io/plans/) which uses [several tools](https://mythx.io/tools/) on the backend including a static analyzer (Maru), symbolic analyzer (Mythril) and a greybox fuzzer (Harvey) to implement a total of [46 detectors](https://mythx.io/detectors/).
- [Mythril](https://github.com/ConsenSys/mythril) is the open-source component of MythX.

#### 57. MythX process
- MythX is an api based service so it doesn't run locally on the users's machine
	1. Submit your code:
		- The analysis requests are encrypted with TLS and the code you submit is accessed only by you.
		- Submit both the source code and the compiled bytecode of your smart contracts for best results.
	2. Activate a full suite of analysis techniques:
		- The longer MythX runs, the more it can detect more security weaknesses.
	3. Receive a detailed analysis report:
		- MythX detects a majority of vulnerabilities listed in the SWC Registry.
		- The report will return a listing of all the weaknesses found in your code, including the exact position of the issue and its SWC ID.
		- Reports generated can be only accessed by you.
		- MythX offers 3 scan modes, quick, standard and deep.

#### 58. MythX tools
- When you submit your code to the API it gets analyzed by multiple microservices in parallel where these tools cooperate to return the more comprehensive results in the execution time provided.
	1. A static analyzer, Maru, parses the Solidity AST
	2. A symbolic analyzer, Mythril, detects possible vulnerable states
	3. A greybox fuzzer, Harvey, detects vulnerable execution paths
		- Compared to traditional blackbox fuzzing, greybox fuzzing is guided by coverage information which is made possible by using program instrumentation to trace the code coverage "breached?" by each input during fuzzing

#### 59. MythX coverage
- Extends to most SWCs found in the [SWC Registry](https://swcregistry.io/) with the 46 detectors listed [here](https://mythx.io/detectors/) along with the type of analysis used.

#### 60. MythX
- Based on a SaaS (Security as a Service) platform based on the premise that:
    1. Higher performance compared to running security tools locally
    2. Higher vulnerability coverage than any standalone tool
    3. Benefit from continuous improvements to our security analysis technology with new and improved security tests as the smart contract security landscape evolves.


### [Block 4](https://www.youtube.com/watch?v=jZ81ebDJVe0)
#### 61. MythX Privacy
- MythX privacy guarantee for the smart contract code submitted using their SaaS APIs:
	1. Code analysis requests are encrypted with TLS
	2. To provide comprehensive reports and improve performance, it stores some of the contract data in our database, including parts of the source code and bytecode but that data never leaves their secure server and is not shared with any outside parties.
	3. It keeps the results of your analysis so you can retrieve them later, but the report can be accessed by you only.

#### 62. MythX Performance
- Performance is usually a concern with security tools
- Quick scan runs for 5 minutes, Standard scan runs for 30 minutes, and Deep scan runs for 90 minutes.

#### 63. MythX Versions
- Comes in different versions, so it can be accessed in different ways
- MythX official integrations, tools and libraries include:
    1. MythX CLI: Unified tool to use MythX as a Command Line Interface (CLI) now with full Truffle Projects support.
    2. MythX-JS: Typescript library to integrate MythX in your JS or TS projects.
    3. PythX: Python library to integrate MythX in your Python projects.
    4. MythX VSCode: VSCode extension which allows you to scan smart-contracts and view results directly from your code editor.

#### 64. MythX Pricing
1. On Demand (US$9.99/3 scans): All scan modes and Prepaid scan packs
2. Developer (US$49/mo): Quick and Standard scan modes; 500 scans/month
3. Professional (US$249/mo): All scan modes; 10 000 scans/month
4. Enterprise (Custom pricing):
	1. Custom plans for your team's specific needs
	2. Custom Verification Service
	3. Retainer for Custom Support

#### 65. [Scribble](https://github.com/consensys/scribble)
- A verification language and runtime verification tool that translates high-level specifications into solidity code. It allows you to annotate a solidity smart contract with properties (See [here](https://docs.scribble.codes/)_)_.
    1. Principles/Goals:
	    1) Specifications are easy to understand by developers and auditors
	    2) Specifications are simple to reason about
	    3) Specifications can be efficiently checked using off-the-shelf analysis tools 4) A small number of core specification constructs are sufficient to express and reason about more advanced constructs
    2. Transforms annotations in the Scribble specification language into concrete assertions
    3. With these instrumented but equivalent contracts, one can then use Mythril, Harvey, MythX

#### 66. [Fuzzing-as-a-Service](https://consensys.net/diligence/fuzzing/)
- A service recently launched by ConsenSys Diligence where projects can submit their smart contracts along with embedded inlined specifications or properties written using the Scribble language.
- These contracts are run through the Harvey fuzzer which uses the specified properties to optimize fuzzing campaigns.
- Any violations from fuzzing are reported back from the service for the project to fix.

#### 67. [Karl](https://github.com/cleanunicorn/karl)
- A monitor for smart contracts that checks for security vulnerabilities using the Mythril detection engine.
- It can be used to monitor the Ethereum blockchain for newly deployed vulnerable smart contracts in real-time.

#### 68. [Theo](https://github.com/cleanunicorn/theo)
- An exploitation tool with a Metasploit-like interface, drops you into a Python REPL console, where you can use the available features to do smart contract reconnaissance, check the storage, run exploits or frontrun or backrun transactions targeting a specific smart contract.
- Features:
	1. Automatic smart contract scanning which generates a list of possible exploits
	2. Sending transactions to exploit a smart contract
	3. Transaction pool monitor
	4. Web3 console
	5. Frontrunning and backrunning transactions
	6. Waiting for a list of transactions and sending out others
	7. Estimating gas for transactions means only successful transactions are sent
	8. Disabling gas estimation will send transactions with a fixed gas quantity.

#### 69. Visual Auditor
- S Visual Studio Code extension that provides security-aware syntax and semantic highlighting for [Solidity](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor) _and_ [Vyper](https://marketplace.visualstudio.com/items?itemName=tintinweb.vscode-vyper)_._
	1. Syntax Highlighting:
		- access modifiers (external, public, payable, …)
		- security relevant built-ins, globals, methods and user/miner-tainted information, (address.call(), tx.origin, msg.data, block.*, now)
		- storage access modifiers (memory, storage)
		- developer notes in comments (TODO, FIXME, HACK, …)
		- custom function modifiers
		- contract creation / event invocations
		- easily differentiate between arithmetics vs. logical operations
		- make Constructor and Fallback function more prominent
	2. Semantic Highlighting:
		- highlights StateVars (constant, inherited)
		- detects and alerts about StateVar shadowing
		- highlights function arguments in the function body
	3. Review Features:
		- audit annotations/bookmarks - @audit - ``<msg>`` @audit-ok - ``<msg>`` (see below),
		- generic interface for importing external scanner results - cdili json format (see below),
		- codelens inline action:
			- graph, report, dependencies, inheritance, parse, ftrace, flatten, generate unit test stub, function signature hashes, uml
	4. Graph- and Reporting Features:
		- access your favorite Sūrya features from within vscode,
		- interactive call graphs with call flow highlighting and more,
		- auto-generate UML diagrams from code to support your threat modelling exercises or documentation
	5. Code Augmentation:
		- Hover over Ethereum Account addresses to download the byte-code,
		- source-code or open it in the browser,
		- Hover over ASM instructions to show their signatures,
		- Hover over keywords to show basic Security Notes,
		- Hover over StateVar's to show declaration information
	6. Views: Cockpit vs Outline

#### 70. [Surya](https://github.com/ConsenSys/surya)
- Aids auditors in understanding and visualizing Solidity smart contracts by providing information about the contracts’ structure and generates call graphs and inheritance graphs.
- It also supports querying the function call graph in multiple ways to aid in the manual inspection of contracts.
    1. Integrated with Visual Auditor
    2. Commands: graph, ftrace, flatten, describe, inheritance, dependencies, parse, mdreport

#### 71. [SWC Registry](https://github.com/SmartContractSecurity/SWC-registry)
- The Smart Contract Weakness Classification Registry (SWC Registry) is an implementation of the weakness classification scheme proposed in EIP-1470.
    1. It is loosely aligned to the terminologies and structure used in the Common Weakness Enumeration (CWE) while overlaying a wide range of weakness variants that are specific to smart contracts
    2. The goals of this project are as follows:
	    - Provide a straightforward way to classify security issues in smart contract systems.
	    - Define a common language for describing security issues in smart contract systems' architecture, design, or code.
	    - Serve as a way to train and increase performance for smart contract security analysis tools.
    3. This repository is maintained by the team behind MythX and currently contains 37 entries

#### 72. [Securify](https://github.com/eth-sri/securify2)
- A security scanner for Ethereum smart contracts which Implements static analysis written in Datalog and supports 38 vulnerabilities

#### 73. [VerX](https://verx.ch/)
- A verifier that can automatically prove temporal safety properties of Ethereum smart contracts.
	- The verifier is based on a careful combination of three ideas:
		- reduction of temporal safety verification to reachability checking,
		- an efficient symbolic execution engine used to compute precise symbolic states within a transaction,
		- and delayed abstraction which approximates symbolic states at the end of transactions into abstract states.

#### 74. [SmartCheck](https://github.com/smartdec/smartcheck)
- An extensible static analysis tool for discovering vulnerabilities and other code issues in Ethereum smart contracts written in the Solidity programming language.
- It translates Solidity source code into an XML-based intermediate representation and checks it against XPath patterns.

#### 75. [K-Framework](https://kframework.org/)
- A verification framework from the  [Runtime Verification](https://runtimeverification.com/smartcontract/) team.
- Analysis, modelling and verification tools from (RV):
	- provides [KEVM](https://github.com/kframework/evm-semantics) which is a model of EVM in the K-Framework.
	- It is the first executable specification of the EVM that completely passes official test-suites and serves as a platform for building a wide range of analysis tools and other semantic extensions for EVM.

#### 76. [Certora](https://www.certora.com/) [Prover](https://www.certora.com/pubs/QuickGuide.pdf)
- Checks that a smart contract satisfies a set of rules written in a language called Specify.
- Each rule is checked on all possible transactions, though of course this is not done by explicitly enumerating transactions, but rather through symbolic techniques.
    1. The Certora Prover provides complete path coverage for a set of safety rules provided by the user.
		- For example, a rule might check that only a bounded number of tokens can be minted in an ERC20 contract.
		- The prover either guarantees that a rule holds on all paths and all inputs or produces a test input that demonstrates a violation of the rule.
    2. The problem addressed by the Certora Prover is known to be undecidable which means that there will always be pathological programs and rules for which the Certora prover will time out without a definitive answer
    3. The Certora Prover takes as input the smart contract (either as EVM bytecode or Solidity source code) and a set of rules, written in Certora’s specification language.
	    - The Prover then automatically determines whether or not the contract satisfies all the rules using a combination of two computer science techniques: abstract interpretation and constraint solving

#### 77. DappHub’s [Hevm](http://dapp.tools/hevm/)
- An implementation of the EVM made specifically for unit testing and debugging smart contracts.
- It can run unit tests, property tests, interactively debug contracts while showing the Solidity source, or run arbitrary EVM code.

#### 78.Capture the Flag (CTF)
- Fun and educational challenges where participants have to hack different (dummy) smart contracts that have vulnerabilities in them.
- They help understand the complexities around how vulnerabilities may be exploited in the wild. Popular ones include:
    1. [Capture The Ether](https://capturetheether.com/): is a set of twenty challenges created by [Steve Marx](https://twitter.com/smarx) which test knowledge of Ethereum concepts of contracts, accounts and math among other things.
    2. [Ethernaut](https://ethernaut.openzeppelin.com/): is a Web3/Solidity based war game from OpenZeppelin that is played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be ‘hacked'. The game is 100% open source and all levels are contributions made by other players
    3. [Damn Vulnerable DeFi v2](https://www.damnvulnerabledefi.xyz/v2-release.html): is a set of 12 DeFi related challenges created by [tinchoabbate](https://twitter.com/tinchoabbate). Depending on the challenge, you should either stop the system from working, steal as much funds as you can, or do some other unexpected things.
    4. [Paradigm CFT](https://ctf.paradigm.xyz/): is a set of seventeen [challenges](https://github.com/paradigm-operations/paradigm-ctf-2021) created by [samczsun](https://twitter.com/samczsun) at Paradigm.

#### 79. Security Tools
- Smart contract security tools are useful in assisting auditors while reviewing smart contracts.
- They automate many of the tasks that can be codified into rules with different levels of coverage, correctness and precision.
- They are fast, cheap, scalable and deterministic compared to manual analysis.
- But they are also susceptible to false positives.
- They are especially well-suited currently to detect common security pitfalls and best-practices at the Solidity and EVM level.
- With varying degrees of manual assistance, they can also be programmed to check for application-level, business-logic constraints.

#### 80. Audit Process
- Audit Process could be thought of as a ten-step process as follows:
    1. Read specification/documentation of the project to understand the requirements, design and architecture
    2. Run fast automated tools such as linters or static analyzers to investigate common Solidity pitfalls or missing smart contract best-practices
    3. Manual code analysis to understand business logic and detect vulnerabilities in it
    4. Run slower but more deeper automated tools such as symbolic checkers, fuzzers or formal verification analyzers which typically require formulation of properties/constraints beforehand, hand holding during the analyses and some post-run evaluation of their results
    5. Discuss (with other auditors) the findings from above to identify any false positives or missing analyses
    6. Convey status to project team for clarifying questions on business logic or threat model
    7. Iterate the above for the duration of the audit leaving some time for report writing
    8. Write report summarizing the above with details on findings and recommendations
    9. Deliver the report to the project team and discuss findings, severity and potential fixes
    10. Evaluate fixes from the project team and verify that they indeed remove the vulnerabilities identified in findings.