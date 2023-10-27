# Provably Random Raffle Contract

## About

This is a smart contract for a provably random smart contract

## What does it do

1. Users can enter by paying a ticket fee
   1. The ticket fees go to the winner during the draw
2. After X period of time, the lottery will automatically draw a winner
   1. This will be done programatically
3. Using Chainlink VRF and Chainlink Automation
   1. Chainlink VRF -> Randomness
   2. Chainlink Automation -> Time based trigger

## Tests

1. Write some deploy scripts
2. Write some tests
   1. Works on a local chain
   2. Forked Testnet
   3. Forked Mainnet
