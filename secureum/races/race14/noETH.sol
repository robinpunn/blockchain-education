modifier noETH {
  require(balanceOf(this) == 0);
  _;
}