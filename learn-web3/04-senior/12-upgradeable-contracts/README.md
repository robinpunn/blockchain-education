# Building smart contracts that can be upgraded over time
- We know that smart contracts on Ethereum are immutable, as the code is immutable and cannot be changed once it is deployed.
    But writing perfect code the first time around is hard, and as humans, we are all prone to making mistakes.
    Sometimes even contracts which have been audited turn out to have bugs that cost them millions.

### How does it work?
- To upgrade our contracts we use something called the ``Proxy Pattern``.
    The word ``Proxy`` might sound familiar to you because it is not a web3-native word.
- Essentially how this pattern works is that a contract is split into two contracts - ``Proxy Contract`` and the ``Implementation contract``.
- The ``Proxy Contract`` is responsible for managing the state of the contract which involves persistent storage whereas ``Implementation Contract`` is responsible for executing the logic and doesn't store any persistent state.
    - The user calls the ``Proxy Contract`` which further does a ``delegatecall`` to the ``Implementation Contract`` so that it can implement the logic.
    - Remember we studied ``delegatecall`` in one of our previous levels
- This pattern becomes interesting when ``Implementation Contract`` can be replaced which means the logic which is executed can be replaced by another version of the ``Implementation Contract`` without affecting the state of the contract which is stored in the proxy.
- There are mainly three ways in which we can replace/upgrade the ``Implementation Contract``:
    1. Diamond Implementation
    1. Transparent Implementation
    1. UUPS Implementation
- We will however only focus on Transparent and UUPS because they are the most commonly used ones.
- To upgrade the ``Implementation Contract`` you will have to use some methods like ``upgradeTo(address)`` which will essentially change the address of the ``Implementation Contract`` from the old one to the new one.
- But the important part lies in where we should keep the ``upgradeTo(address)`` function.
    - We have two choices:
        1. either keep it in the ``Proxy Contract`` which is essentially how ``Transparent Proxy Pattern`` works
        1. or keep it in the ``Implementation Contract`` which is how the UUPS contract works.