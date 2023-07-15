# [Run code from other contracts inside your own using delegatecall](https://learnweb3.io/degrees/ethereum-developer-degree/senior/run-code-from-other-contracts-inside-your-own-using-delegatecall/)
- ``.delegatecall()`` is a method in Solidity used to call a function in a target contract from an original contract. However, unlike other methods, when the function is executed in the target contract using ``.delegatecall()``, the context is passed from the original contract i.e. the code executes in the target contract, but variables get modified in the original contract.


