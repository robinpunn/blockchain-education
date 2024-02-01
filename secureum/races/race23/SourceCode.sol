// tree.circom


include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";


template Mux() {
    signal input in[2];
    signal input s;
    signal output out[2];


    out[0] <-- (s == 0) ? in[0] : in[1];
    out[1] <-- (s == 0) ? in[1] : in[0];
}


template ComputeTreeRoot(nLevels) {
    signal input leaf;
    signal input indices[nLevels];
    signal input siblings[nLevels];


    signal output root;


    component muxes[nLevels];
    component hashers[nLevels];


    signal hashes[nLevels + 1];
    hashes[0] <-- leaf;


    for (var i = 0; i < nLevels; i++) {
        hashers[i] = Poseidon(2);
        muxes[i] = Mux();


        muxes[i].in[0] <== hashes[i];
        muxes[i].in[1] <== siblings[i];
        muxes[i].s <== indices[i];


        hashers[i].inputs[0] <== muxes[i].out[0];
        hashers[i].inputs[1] <== muxes[i].out[1];


        hashes[i + 1] <== hashers[i].out;
    }


    hashes[0] === leaf;
    root <== hashes[nLevels];
}

// treeAdd.circom


include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";
include "./tree.circom";


template MerkleTreeAdd(nLevels) {
    signal input oldVal;
    signal input amount;
    signal input index;
    signal input siblings[nLevels];


    signal input oldRoot;
    signal output newRoot;
    signal output nullifier;


    component indexBits = Num2Bits(nLevels);
    indexBits.in <== index;


    component newRootCalc = ComputeTreeRoot(nLevels);
    component oldRootCalc = ComputeTreeRoot(nLevels);
    oldRootCalc.leaf <== oldVal;
    newRootCalc.leaf <== oldVal + amount;


    for (var i = 0; i < nLevels; i++) {
        oldRootCalc.siblings[i] <== siblings[i];
        oldRootCalc.indices[i] <== indexBits.out[i];
        newRootCalc.siblings[i] <== siblings[i];
        newRootCalc.indices[i] <== indexBits.out[i];
    }


    oldRootCalc.root === oldRoot;
    newRoot <== newRootCalc.root;


    component nullifierHash = Poseidon(1);
    nullifierHash.inputs[0] <== oldVal + amount;
    nullifier <== nullifierHash.out;
}


component main {public [oldRoot, index, amount]} = MerkleTreeAdd(32);
// treeSub.circom


include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";
include "./tree.circom";


template MerkleTreeSub(nLevels) {
    signal input oldVal;
    signal input amount;
    signal input index;
    signal input siblings[nLevels];


    signal input oldRoot;
    signal output newRoot;
    signal output nullifier;


    component indexBits = Num2Bits(nLevels);
    indexBits.in <== index;


    component newRootCalc = ComputeTreeRoot(nLevels);
    component oldRootCalc = ComputeTreeRoot(nLevels);
    oldRootCalc.leaf <== oldVal;
    newRootCalc.leaf <== oldVal - amount;


    for (var i = 0; i < nLevels; i++) {
        oldRootCalc.siblings[i] <== siblings[i];
        oldRootCalc.indices[i] <== indexBits.out[i];
        newRootCalc.siblings[i] <== siblings[i];
        newRootCalc.indices[i] <== indexBits.out[i];
    }


    oldRootCalc.root === oldRoot;
    newRoot <== newRootCalc.root;


    component nullifierHash = Poseidon(1);
    nullifierHash.inputs[0] <== oldVal - amount;
    nullifier <== nullifierHash.out;
}


component main {public [oldRoot, index, amount]} = MerkleTreeSub(32);

// PrivateToken.sol


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;


// Invokes verifier generated by snarkjs
interface IVerifier {
    function verifyAdd(uint256 oldRoot, uint256 index, uint256 amount, uint256 newRoot, uint256 nullifier, uint256[8] calldata proof) external returns (bool);
    function verifySub(uint256 oldRoot, uint256 index, uint256 amount, uint256 newRoot, uint256 nullifier, uint256[8] calldata proof) external returns (bool);
}


contract PrivateToken {
    mapping(uint256 => bool) usedNullifiers;
    uint256 public root;
    IVerifier verifier;
    address minter;


    struct OperationProof {
        uint256 oldRoot;
        uint256 index;
        uint256 amount;
        uint256 newRoot;
        uint256 nullifier;
        uint256[8] proof;
    }


    event Mint(uint256 oldRoot, uint256 index, uint256 amount, uint256 newRoot, uint256 nullifier);
    event Burn(uint256 oldRoot, uint256 index, uint256 amount, uint256 newRoot, uint256 nullifier);
    event Transfer(uint256 oldRoot, uint256 from, uint256 to, uint256 amount, uint256 newRoot, uint256 fromNullifier, uint256 toNullifier);


    constructor(address v, address m) {
        // root of tree with height of 32 and 0s for each leaf
        root = 19057105225525447794058879360670244229202611178388892366137113354909512903676;
        verifier = IVerifier(v);
        minter = m;
    }


    function burn(OperationProof calldata subProof) external {
        require(!usedNullifiers[subProof.nullifier]);
        usedNullifiers[subProof.nullifier] = true;
        root = subProof.newRoot;


        require(verifier.verifySub(subProof.oldRoot, subProof.index, subProof.amount, subProof.newRoot, subProof.nullifier, subProof.proof));


        emit Burn(subProof.oldRoot, subProof.index, subProof.amount, subProof.newRoot, subProof.nullifier);
    }


    function mint(OperationProof calldata addProof) external {
        require(msg.sender == minter);
        require(!usedNullifiers[addProof.nullifier]);
        usedNullifiers[addProof.nullifier] = true;
        root = addProof.newRoot;


        require(verifier.verifyAdd(addProof.oldRoot, addProof.index, addProof.amount, addProof.newRoot, addProof.nullifier, addProof.proof));


        emit Mint(addProof.oldRoot, addProof.index, addProof.amount, addProof.newRoot, addProof.nullifier);
    }


    function transfer(OperationProof calldata addProof, OperationProof calldata subProof) external {
        require(addProof.amount == subProof.amount);
        require(!usedNullifiers[addProof.nullifier]);
        usedNullifiers[addProof.nullifier] = true;
        require(!usedNullifiers[subProof.nullifier]);
        usedNullifiers[subProof.nullifier] = true;


        require(verifier.verifyAdd(addProof.oldRoot, addProof.index, addProof.amount, addProof.newRoot, addProof.nullifier, addProof.proof));
        require(verifier.verifySub(subProof.oldRoot, subProof.index, subProof.amount, subProof.newRoot, subProof.nullifier, subProof.proof));


        require(addProof.oldRoot == subProof.newRoot || addProof.newRoot == subProof.oldRoot);
        uint256 oldRoot;
        if(addProof.oldRoot == subProof.newRoot) {
            oldRoot = subProof.oldRoot;
            root = addProof.newRoot;
        }
        else {
            oldRoot = addProof.oldRoot;
            root = subProof.newRoot;
        }


        emit Transfer(oldRoot, subProof.index, addProof.index, addProof.amount, root, subProof.nullifier, addProof.nullifier);
    }
}