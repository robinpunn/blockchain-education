modifier checkedPool{
  address pool;
  assembly { 
let size := calldatasize()
      pool := calldataload(sub(size, 32))
  }
  require(isValid(pool));
  _;
}

function isValid(pool) internal {...}
function somePoolOperation(...., address pool) public checkedPool { ... }
function anotherPoolOperation(...., address pool) public checkedPool { ... }
