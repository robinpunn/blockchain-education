// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {Test, console} from "forge-std/Test.sol";
import {DeployDSC} from "../../script/DeployDSC.s.sol";
import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
import {DSCEngine} from "../../src/DSCEngine.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";

contract DSCEngineTest is Test {
    DeployDSC deployer;
    DecentralizedStableCoin dsc;
    DSCEngine dsce;
    HelperConfig config;
    address ethUsdPriceFeed;
    address btcUsdPriceFeed;
    address weth;

    address public USER = makeAddr("user");
    uint256 public constant AMOUNT_COLLATERAL = 10 ether;
    uint256 public constant AMOUNT_TO_MINT = 100 ether;
    uint256 public constant STARTING_ERC20_BALANCE = 10 ether;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    uint256 public constant LIQUIDATION_THRESHOLD = 50;

    function setUp() public {
        deployer = new DeployDSC();
        (dsc, dsce, config) = deployer.run();
        (ethUsdPriceFeed, btcUsdPriceFeed, weth,,) = config.activeNetworkConfig();

        ERC20Mock(weth).mint(USER, STARTING_ERC20_BALANCE);
    }

    ///////////////
    // modifiers //
    ///////////////
    modifier depositedCollateral() {
        vm.startPrank(USER);
        ERC20Mock(weth).approve(address(dsce), AMOUNT_COLLATERAL);
        dsce.depositCollateral(weth, AMOUNT_COLLATERAL);
        vm.stopPrank();
        _;
    }

    modifier depositedCollateralAndMintDsc() {
        vm.startPrank(USER);
        ERC20Mock(weth).approve(address(dsce), AMOUNT_COLLATERAL);
        dsce.depositCollateralAndMintDsc(weth, AMOUNT_COLLATERAL, AMOUNT_TO_MINT);
        vm.stopPrank();
        _;
    }

    ///////////////////////
    // Constructor Tests //
    ///////////////////////
    address[] public tokenAddresses;
    address[] public priceFeedAddresses;

    function testRevertsIfTokenLengthDoesntMatchPriceFeed() public {
        tokenAddresses.push(weth);
        priceFeedAddresses.push(ethUsdPriceFeed);
        priceFeedAddresses.push(btcUsdPriceFeed);

        vm.expectRevert(DSCEngine.DSCEngine__TokenAddressesAndPriceFeedAddressesMustBeSameLength.selector);
        new DSCEngine(tokenAddresses, priceFeedAddresses, address(dsc));
    }

    /////////////////
    // Price Tests //
    /////////////////
    function testGetUsdValue() public {
        uint256 ethAmount = 15e18;
        uint256 expectedUsd = 30000e18;
        uint256 actualUsd = dsce.getUsdValue(weth, ethAmount);
        assertEq(expectedUsd, actualUsd);
    }

    function testGetTokenAmountFromUsd() public {
        uint256 usdAmount = 100 ether;
        uint256 expectedWeth = 0.05 ether; // assuming $2000 eth
        uint256 actualWeth = dsce.getTokenAmountFromUsd(weth, usdAmount);
        assertEq(expectedWeth, actualWeth);
    }

    /////////////////////////////
    // depositCollateral Tests //
    /////////////////////////////
    function testRevertsIfCollateralZero() public {
        vm.startPrank(USER);
        ERC20Mock(weth).approve(address(dsce), AMOUNT_COLLATERAL);

        vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
        dsce.depositCollateral(weth, 0);
        vm.stopPrank();
    }

    function testRevertsIfUnapprovedCollateral() public {
        ERC20Mock ranToken = new ERC20Mock("RAN", "RAN", USER, AMOUNT_COLLATERAL);
        vm.startPrank(USER);
        vm.expectRevert(DSCEngine.DSCEngine__TokenNotAllowed.selector);
        dsce.depositCollateral(address(ranToken), AMOUNT_COLLATERAL);
        vm.stopPrank();
    }

    function testCanDepositCollateralAndGetAccountInfo() public depositedCollateral {
        (uint256 totalDscMinted, uint256 collateralValueInUsd) = dsce.getAccountInformation(USER);

        uint256 expectedTotalDscMinted = 0;
        uint256 expectedDepositAmount = dsce.getTokenAmountFromUsd(weth, collateralValueInUsd);

        assertEq(totalDscMinted, expectedTotalDscMinted);
        assertEq(AMOUNT_COLLATERAL, expectedDepositAmount);
    }

    ///////////////////
    // mintDsc Tests //
    ///////////////////
    function testRevertWithoutCollateral() public {
        vm.startPrank(USER);
        // bytes4 selector = bytes4(keccak256("DSCEngine__BreaksHealthFactor(uint256)"));
        // vm.expectRevert(abi.encodeWithSelector(selector, type(uint256).max));
        vm.expectRevert();
        dsce.mintDsc(AMOUNT_COLLATERAL / 10);
        vm.stopPrank();
    }

    function testReverIfMintIsZero() public depositedCollateral {
        vm.startPrank(USER);
        vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
        dsce.mintDsc(0);
        vm.stopPrank();
    }

    function testBreakHealthFactor() public depositedCollateral {
        vm.startPrank(USER);
        dsce.mintDsc(AMOUNT_TO_MINT);
        // bytes4 selector = bytes4(keccak256("DSCEngine__BreaksHealthFactor(uint256)"));
        // uint256 healthFactor = dsce.getHealthFactor(USER);
        // vm.expectRevert(abi.encodeWithSelector(selector, healthFactor));
        vm.expectRevert();
        dsce.mintDsc(AMOUNT_TO_MINT * 1000);
        vm.stopPrank();
    }

    function testMintDsc() public depositedCollateral {
        vm.startPrank(USER);
        dsce.mintDsc(AMOUNT_COLLATERAL / 10);
        vm.stopPrank();
        (uint256 totalDscMinted,) = dsce.getAccountInformation(USER);
        assertEq(AMOUNT_COLLATERAL / 10, totalDscMinted);
    }

    ///////////////////
    // burnDsc Tests //
    ///////////////////
    function testRevertWithNothingToBurn() public {
        vm.prank(USER);
        vm.expectRevert();
        dsce.burnDsc(1);
    }

    function revertIfBurningMoreThanOwned() public depositedCollateralAndMintDsc {
        vm.startPrank(USER);
        dsc.approve(address(dsce), AMOUNT_TO_MINT * 1000);
        vm.expectRevert();
        dsce.burnDsc(AMOUNT_TO_MINT * 1000);
        vm.stopPrank();
    }

    function testBurnDsc() public depositedCollateralAndMintDsc {
        vm.startPrank(USER);
        dsc.approve(address(dsce), AMOUNT_TO_MINT);
        dsce.burnDsc(AMOUNT_TO_MINT);
        vm.stopPrank();
        (uint256 totalDscMinted,) = dsce.getAccountInformation(USER);
        assertEq(0, totalDscMinted);
    }

    ////////////////////////////
    // redeemCollateral Tests //
    ////////////////////////////
    function testRevertZeroCollateralRedeem() public depositedCollateral {
        vm.startPrank(USER);
        vm.expectRevert(DSCEngine.DSCEngine__NeedsMoreThanZero.selector);
        dsce.redeemCollateral(weth, 0);
        vm.stopPrank();
    }

    function testRedeemCollateral() public depositedCollateral {
        vm.startPrank(USER);
        dsce.redeemCollateral(weth, AMOUNT_COLLATERAL);
        vm.stopPrank();
        (, uint256 collateralValueInUsd) = dsce.getAccountInformation(USER);
        assertEq(0, collateralValueInUsd);
    }

    ///////////////////////////////////
    // Public and External Functions //
    ///////////////////////////////////
    function testGetPrecision() public {
        uint256 expectedPrecision = 1e18;
        uint256 actualPrecision = dsce.getPrecision();
        assertEq(expectedPrecision, actualPrecision);
    }

    function testGetAdditionalFeedPrecision() public {
        uint256 expectedPrecision = 1e10;
        uint256 actualAdditionalPrecision = dsce.getAdditionalFeedPrecision();
        assertEq(expectedPrecision, actualAdditionalPrecision);
    }

    function testGetLiquidationThreshold() public {
        uint256 actualThreshold = dsce.getLiquidationThreshold();
        assertEq(LIQUIDATION_THRESHOLD, actualThreshold);
    }

    function testGetLiquidationBonus() public {
        uint256 expectedLiquidationBonus = 10;
        uint256 actualLiquidationBonus = dsce.getLiquidationBonus();
        assertEq(expectedLiquidationBonus, actualLiquidationBonus);
    }

    function testGetLiquidationPrecision() public {
        uint256 expectedLiquidationPrecision = 100;
        uint256 actualLiquidationPrecision = dsce.getLiquidationPrecision();
        assertEq(expectedLiquidationPrecision, actualLiquidationPrecision);
    }

    function testGetMinHealthFactor() public {
        uint256 actualMinHealthFactor = dsce.getMinHealthFactor();
        assertEq(actualMinHealthFactor, MIN_HEALTH_FACTOR);
    }

    function testGetCollateralTokens() public {
        address[] memory collateralTokens = dsce.getCollateralTokens();
        assertEq(collateralTokens[0], weth);
    }

    function testGetDsc() public {
        address dscAddress = dsce.getDsc();
        assertEq(address(dsc), dscAddress);
    }

    function testGetCollateralTokenPriceFeed() public {
        address wethPriceFeed = dsce.getCollateralTokenPriceFeed(weth);
        assertEq(wethPriceFeed, ethUsdPriceFeed);
    }

    function testGetHealthFactor() public {
        uint256 expectedHealthFactor = type(uint256).max;
        uint256 actualHealthFactor = dsce.getHealthFactor(USER);
        assertEq(expectedHealthFactor, actualHealthFactor);
    }

    function testGetAccountInformation() public {
        (uint256 totalDscMinted, uint256 collateralValueInUsd) = dsce.getAccountInformation(USER);
        assertEq(totalDscMinted, 0);
        assertEq(collateralValueInUsd, 0);
    }

    function testGetAccountInformationAfterDepositAndMint() public depositedCollateralAndMintDsc {
        (uint256 totalDscMinted, uint256 collateralValueInUsd) = dsce.getAccountInformation(USER);
        uint256 ethUsdValue = dsce.getUsdValue(weth, AMOUNT_COLLATERAL);
        assertEq(totalDscMinted, AMOUNT_TO_MINT);
        assertEq(collateralValueInUsd, ethUsdValue);
    }

    function testCalculateHealthFactorAfterDepositAndMint() public depositedCollateralAndMintDsc {
        uint256 liquidationPrecision = dsce.getLiquidationPrecision();
        uint256 precision = dsce.getPrecision();
        (uint256 totalDscMinted, uint256 collateralValueInUsd) = dsce.getAccountInformation(USER);
        uint256 collateralAdjustedForThreshold = (collateralValueInUsd * LIQUIDATION_THRESHOLD) / liquidationPrecision;
        uint256 expectedHealthFactor = (collateralAdjustedForThreshold * precision) / totalDscMinted;
        uint256 actualHealthFactor = dsce.getHealthFactor(USER);
        assertEq(expectedHealthFactor, actualHealthFactor);
    }

    function testGetCollateralBalanceOfUser() public {
        uint256 collateralBalance = dsce.getCollateralBalanceOfUser(USER, weth);
        assertEq(collateralBalance, 0);
    }

    function testGetCollateralBalanceOfUserAfterDeposit() public depositedCollateral {
        uint256 collateralBalance = dsce.getCollateralBalanceOfUser(USER, weth);
        assertEq(collateralBalance, AMOUNT_COLLATERAL);
    }

    function testGetAccountCollateralValue() public {
        uint256 collateralValue = dsce.getAccountCollateralValue(USER);
        assertEq(collateralValue, 0);
    }

    function testGetAccountCollateralValueAfterDeposit() public depositedCollateral {
        uint256 collateralValue = dsce.getAccountCollateralValue(USER);
        uint256 ethUsdValue = dsce.getUsdValue(weth, AMOUNT_COLLATERAL);
        assertEq(collateralValue, ethUsdValue);
    }
}
