// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {LessonTwelveHelper} from "../src/Lesson12.sol"; 

contract LessonTwelveHelperFuzzTest is Test {
    LessonTwelveHelper public lessonTwelveHelper;

    function setUp() public {
        lessonTwelveHelper = new LessonTwelveHelper(); 
    }

    function testFuzz_HellFunc(uint128 numberr) public {
        try lessonTwelveHelper.hellFunc(numberr) returns (uint256 result) {
            assert(result == uint256(result));
        } catch {
            console.log("Exception thrown for input:", numberr);
            fail(); 
        }
    }

    function testNinenine() public view {
        lessonTwelveHelper.hellFunc(99);
    }
}