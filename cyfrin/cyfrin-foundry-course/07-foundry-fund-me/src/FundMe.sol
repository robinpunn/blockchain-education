// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

error FundMe_NotOwner();
error CallFailed();

contract FundMe {
    using PriceConverter for uint256;

    mapping(address funder => uint256 amountFunded) private s_addressToAmountFunded;
    address[] private s_funders;


    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 5e18;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "not the owner");
        if (msg.sender != i_owner) { revert FundMe_NotOwner();}
        _;
    }

    // constructor
    constructor(address priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    // send money to contract
    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD); //1e18 = 1 ETH = 1000000000000000000 = 1 * 10 ** 18
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    // cheaper owner withdraw
    function cheaperWithdraw() external onlyOwner {

        uint256 fundersLength = s_funders.length;
        for (uint256 funderIndex = 0; funderIndex < fundersLength; funderIndex++) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        if (!success) {revert CallFailed();}
    }

    // owner withdraw
    function withdraw() external onlyOwner {
        // loop through funders
        for (uint256 funderIndex =0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset the array
        s_funders = new address[](0);
        // withdraw funds
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        // require(success, "call failed");
        if (!success) {revert CallFailed();}
    }

    function getVersion() external view returns(uint256) {
        return s_priceFeed.version();
    }

    // what happens if someone sends eth without calling the fund function

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
        View / Pure functions (Getters)
    */

    function getAddressToAmountFunded(address fundingAddress) external view returns(uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getFunder(uint256 index) external view returns(address) {
        return s_funders[index];
    }

    function getOwner() external view returns(address) {
        return i_owner;
    }

}