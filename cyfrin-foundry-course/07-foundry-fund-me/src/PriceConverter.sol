// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
        // get price
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256){
        // we need the address and the abi
        // address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        (, int256 price,,,) = priceFeed.latestRoundData();
        // price of eth in terms of USD
        return uint256(price * 1e10);
    }

    // get conversion rate
    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256){
        // convert 1 eth (1000000000000000000)?
        // 1. get eth price: 2000_000000000000000000
        uint256 ethPrice = getPrice(priceFeed);
        // 2. multiply eth price with eth amount: (2000_000000000000000000 * 1000000000000000000) / 1e18
        uint256 ethAmountInUsd = (ethPrice* ethAmount) / 1e18;
        // returns: $2000_000000000000000000 = 1 eth
        return ethAmountInUsd;
    }
}