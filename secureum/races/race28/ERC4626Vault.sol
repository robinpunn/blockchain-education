//SPDX-License-Identifier: NONE
pragma solidity ^0.8.13;

import {ERC20} from "https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol";
import {SafeTransferLib} from "https://github.com/transmissions11/solmate/blob/main/src/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "https://github.com/transmissions11/solmate/blob/main/src/utils/FixedPointMathLib.sol";

contract ERC4626Vault is ERC20 {
    using SafeTransferLib for ERC20;
    using FixedPointMathLib for uint256;
    ERC20 public immutable asset;

    constructor(
        ERC20 _asset,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol, 18) {
        asset = _asset;
    }

    function deposit(uint256 assets, address receiver) public virtual returns (uint256 shares) {
        require((shares = previewDeposit(assets)) != 0, "ZERO_SHARES");
        asset.safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, assets);
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function mint(uint256 shares, address receiver) public virtual returns (uint256 assets) {
        assets = previewMint(shares);
        _mint(receiver, shares);
        asset.safeTransferFrom(msg.sender, address(this), assets);
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual returns (uint256 shares) {
        shares = previewWithdraw(assets);
        if (msg.sender != owner) {
            uint256 allowed = allowance[owner][msg.sender];
            if (allowed != type(uint256).max) allowance[owner][msg.sender] = allowed - shares;
        }
        _burn(owner, shares);
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        asset.safeTransfer(receiver, assets);
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual returns (uint256 assets) {
        if (msg.sender != owner) {
            uint256 allowed = allowance[owner][msg.sender];
            if (allowed != type(uint256).max) allowance[owner][msg.sender] = allowed - shares;
        }
        require((assets = previewRedeem(shares)) != 0, "ZERO_ASSETS");
        _burn(owner, shares);
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        asset.safeTransfer(receiver, assets);
    }

    function totalAssets() public view virtual returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view virtual returns (uint256) {
        return totalSupply == 0 ? assets : assets.mulDivDown(totalSupply, totalAssets());
    }

    function convertToAssets(uint256 shares) public view virtual returns (uint256) {
        return totalSupply == 0 ? shares : shares.mulDivDown(totalAssets(), totalSupply);
    }

    function previewDeposit(uint256 assets) public view virtual returns (uint256) {
        return convertToShares(assets);
    }

    function previewMint(uint256 shares) public view virtual returns (uint256) {
        return totalSupply == 0 ? shares : shares.mulDivUp(totalAssets(), totalSupply);
    }

    function previewWithdraw(uint256 assets) public view virtual returns (uint256) {
        return totalSupply == 0 ? assets : assets.mulDivDown(totalSupply, totalAssets());
    }

    function previewRedeem(uint256 shares) public view virtual returns (uint256) {
        return convertToAssets(shares);
    }
}