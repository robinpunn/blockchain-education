// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// gas to deploy without constant: 867,097
// gas to deploy with constant: 843,668
// gas to deploy with contant/immutable: 816,980

// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

error NotOwner();
error CallFailed();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 5e18;

    address[] public funders;
    mapping(address funder => uint256 amountFunded) public addressToAmountFunded;

    address public immutable i_owner;

    // constructor
    constructor() {
        i_owner = msg.sender;
    }

    // send money to contract
    function fund() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD); //1e18 = 1 ETH = 1000000000000000000 = 1 * 10 ** 18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    // owner withdraw
    function withdraw() external onlyOwner {
        // for loop
        // [1, 2, 3, 4] elements
        //  0, 1, 2, 3  indexes
        // for (/* startingIndex, endingIndex, stepAmount*/)
        for (uint256 funderIndex =0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address[](0);
        // withdraw funds
        // transfer  msg.sender = address... payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);
        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess,"send failed");
        // call
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        // require(success, "call failed");
        if (!success) {revert CallFailed();}
    }
    
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "not the owner");
        if (msg.sender != i_owner) { revert NotOwner();}
        _;
    }

    // what happens if someone sends eth without calling the fund function

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}