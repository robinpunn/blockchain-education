# [Access private data in smart contracts](https://learnweb3.io/degrees/ethereum-developer-degree/senior/access-private-data-in-smart-contracts/)
- When we start writing smart contracts and come across visibility modifiers like ``public``, ``private``, etc.
    - We may think that if you want the value of some variable to be readable by the public you need to declare it ``public``, and that private variables cannot be read by anyone but the smart contract itself.

### What does private mean?
- Function (and variable) visibility modifiers only affect the visibility of the function - and do not prevent access to their values.
    - We know that ``public`` functions are those which can be called both externally by users and smart contracts, and also by the smart contract itself.
- Similarly, ``internal`` functions are those which can only be called by the smart contract itself, and outside users and smart contracts cannot call those functions.
    - ``external`` functions are the opposite, where they can only be called by external users and smart contracts, but not the smart contract that has the function itself.
- ``private``, similarly, just affects who can call that function.
    - ``private`` and ``internal`` behave mostly similarly, except the fact that ``internal`` functions are also callable by derived contracts, whereas ``private`` functions are not.

