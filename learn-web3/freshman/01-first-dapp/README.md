# Build your first dApp with ethers.js

### Create a basic HTML web page
- The html page consists of an input and two buttons
- The user inputs a mood, and uses the ``Set Mood`` button
    - The ``Set Mood`` button initiates a transaction which will be signed with a web wallet
- The ``Get Mood`` button will display the mood on the console and the web page

### Create a basic Solidity smart contract
- The smart contract is created with Remix and deployed to the Sepolia test net
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MoodDiary{
    string mood;

    //create a function that writes a mood to the smart contract
    function setMood(string memory _mood) public{
        mood = _mood;
    }

    //create a function that reads the mood from the smart contract
    function getMood() public view returns(string memory){
        return mood;
    }
}
```

### Connect the web page with the smart contracts using Ethers.js
- Ethers.js cdn is used:
```html
<script
    src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"
    type="application/javascript"
>
</script>
```
- This allows the app to connect to web3 wallets with the window object