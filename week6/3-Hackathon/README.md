### Hackathon Challenge
- This is a Solidity Smart Contract challenge where you will need to create a function on a Hackathon contract to sort through a list of projects and find which one is the top-rated from a list of it's ratings.
- By completing this challenge you demonstrate your ability to sort with structs and arrays in Solidity.

### Top Rated Project
#### Hackathon Contract
- To complete this challenge we need to write a function that will help us find the winning project of the hackathon. 
    - The winning project will be determined by the average score of all of its ratings.
#### Contract Setup
- The Hackathon.sol contract is partially setup. 
- We have the Project struct:
    ```solidity
    struct Project {
        string title;
        uint[] ratings;
    }
    ```
    - It stores the title of the project and an array of unsigned integer ratings. 
    - The higher the integer, the higher the rating. 
    - For the purposes of this challenge, the project with the highest average rating is the winner.
- We can always look up the projects using the projects array, which is populated through the newProject function. 
    - This function takes a string and uses that to initialize the project's title. 
    - It also initializes the project's ratings to an empty uint array.
- Finally we have a rate function that allows an EOA to rate a particular project. 
    - It does this by taking an index to identify a project and a rating to be pushed on the projects ratings array.
#### Your Goal: Find Winner Function
1. Create an external, view function ``findWinner`` which returns a Project.
1. In this function, use the ``projects`` storage array to find the project that has the **highest average rating** amongst its array of ``ratings``.
1. Upon finding the highest average, return the project.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }
    
    Project[] projects;

    // TODO: add the findWinner function
    function findWinner() 
        external
        view
        returns (Project memory winner)
        {
            uint highestAverage = 0;
            for (uint i = 0; i < projects.length; i++) {
                uint sum = 0;
                for (uint j = 0; j < projects[i].ratings.length; j++){
                    sum += projects[i].ratings[j];
                }
                if (projects[i].ratings.length > 0) {
                    uint average = sum/projects[i].ratings.length;
                    if (average > highestAverage){
                        highestAverage = average;
                        winner = projects[i];
                    }
                }
            }
            return winner;
        }

    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }
}
```