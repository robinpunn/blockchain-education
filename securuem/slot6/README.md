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