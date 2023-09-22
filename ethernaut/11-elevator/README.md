## Elevator
This elevator won't let you reach the top of your building. Right?

##### Things that might help
Sometimes solidity is not good at keeping promises.
This Elevator expects to be used from a Building.

#### Understanding the contract
1. Interface
```js
interface Building {
  function isLastFloor(uint) external returns (bool);
}
```
- This contract incorporates an [interface](https://solidity-by-example.org/interface/)
- This will allows the main contract to inherit the ``isLastFloor`` function from ``Building``
- ``isLastFloor`` takes one argument, a ``uint`` and it is an ``external`` function that returns a ``bool``

2. State Variables
```js
bool public top;
uint public floor;
```
- The ``Elevator`` contract has two state variables ``top`` and ``floor``
- ``top`` is a public bool
- floor is a public uint

3. Constructor
- There is no constructor function

4. Functions
- ``Elevator`` has one function ``goTo``
- ``goTo`` takes one argument, a uint, and it is a public function
- ``building`` is a variable of type ``Building`` and ``msg.sender`` is used as an argument for ``Building``
```js
if (! building.isLastFloor(_floor)) {
    floor = _floor;
    top = building.isLastFloor(floor);
}
```
- This part of the function checks to see if ``building.isLastFloor(_floor)`` is falsy... if it is falsy, then ``floor`` is assigned the ``_floor`` variable that was used as an argument for ``goTo`` and ``top`` would be set ``building.isLastFloor(_floor)`` (which should be false since)

#### Solving
Solving this challenge involves exploiting the fact that ``msg.sender`` is used as an argument for the ``Building`` contract: ``Building building = Building(msg.sender);`` This means that we can create a second contract to call this contract and our contract will be able to manipulate the ``goTo`` function.  Our goal is to set ``top`` to true.
In the ``goTo`` function, the ``isLastFloor`` function is going to be called twice. Once when it's checking for a falsy value, and a second time when it sets a value for ``top``. In our contract, we can create our own boolean and use that to create a function that will initially return false, and then return true:
```js
function isLastFloor(uint) external returns(bool) {
    if(!_top) {
        _top = true;
        return false;
    } else {
        _top = false;
        return true;
    }
}
```
Before implementing our contract, ``await contract.top()`` will return false. And ``await contract.floor().then(v=> v.toString())`` will return 0. Running these commands after we run our ``attack`` function, ``top`` will now be true and ``floor`` will be whatever number we input when we initally called the ``goTo`` function. Now that ``top`` is true, we should be able to submit the challenge.

#### Summary
You can use the ``view`` function modifier on an interface in order to prevent state modifications. The pure modifier also prevents functions from modifying the state. Make sure you read [Solidity's documentation](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) and learn its caveats.

An alternative way to solve this level is to build a view function which returns different results depends on input data but don't modify state, e.g. ``gasleft()``.