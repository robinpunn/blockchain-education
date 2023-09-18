//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4; // stating our version

contract SimpleStorage {
    // struct
    struct Person {
        uint256 favoriteNumber;
        string name;
    }

    // Basic Types: boolean, unit, int, address, bytes
    bool hasFavoriteNumber = false;
    uint256 myFavoriteNumber;
    int public favoriteINumber = -17;
    string favoriteNumberInText = "seventeen";
    address myAddress = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    bytes32 favoriteBytes32 = "cat"; 
    
    // fixed array (max 3 entries)
    uint256[3] listOfFavoriteNumbers;
    
    // dynmaic array (array without a maximum)
    Person[] public listOfPeople;
  
    // mapping  
    mapping(string => uint256) public namesToNumbers;

    // manually create struct
    Person public rob = Person(17,"Rob");
    Person public bor = Person({favoriteNumber:17,name:"Bor"});

    
    // function to store/change favorite number
    function store(uint256 _favoriteNumber) public virtual{
        myFavoriteNumber = _favoriteNumber;
    }

    // function to add person to listOfPeople array
    function addPerson(string memory _name, uint256 _favoriteNumber)  public {
        // Person memory newPerson = Person(_favoriteNumber, _name);
        listOfPeople.push(Person(_favoriteNumber, _name));
        namesToNumbers[_name] = _favoriteNumber;
    }

    // function to retrieve myFavoriteNumber
    function retrieve() public view returns(uint256) {
        return myFavoriteNumber;
    }
}