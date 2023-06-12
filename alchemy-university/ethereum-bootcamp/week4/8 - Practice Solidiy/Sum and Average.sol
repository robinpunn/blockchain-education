/*
Your Goal: Sum and Average
Create an external, pure function called sumAndAverage that has four uint parameters.
Find both the sum and the average of the four numbers. Return these two values in this order as unsigned integers.
*/
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Contract {
    function sumAndAverage(uint _a,uint _b,uint _c,uint _d) external pure returns (uint sum, uint average) {
        sum = _a + _b + _c + _d;
        average = sum/4;
    }
}