// SPDX-License-Identifier: UNLICENSED 
pragma solidity 0.8.20; 
import { ERC721 } from "https://github.com/Vectorized/solady/blob/main/src/tokens/ERC721.sol"; 
import { IERC20 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/IERC20.sol"; 
import { ClonesWithImmutableArgs } from "https://github.com/wighawag/clones-with-immutable-args/blob/master/src/ClonesWithImmutableArgs.sol"; 
import { Clone } from "https://github.com/wighawag/clones-with-immutable-args/blob/master/src/Clone.sol"; 


/// @notice For the purpose of RACE-21 there are no bugs in the `Rabbits` token contract. 
/// If anything exists it's due to integrating with the token contract, not the token contract itself. 
contract Rabbits is ERC721 { 
	/* --------------------------------- Storage -------------------------------- */ 
	string internal _name; 
	string internal _symbol; 
	address public deployer; 
	
	/* --------------------------------- Errors --------------------------------- */ 
	error NotAuthorized(); 
	
	/* -------------------------------- Modifiers ------------------------------- */ 
	modifier onlyDeployer() { 
		if (msg.sender != deployer) { revert NotAuthorized(); 
		} 
		_; 
	} 
	
	/* ------------------------------- Constructor ------------------------------ */ 
	constructor() { 
		_name = "RabidRabbits"; 
		_symbol = "RABID"; 
		deployer = msg.sender; 
	} 
	
	/* ---------------------------- Solady Overrides ---------------------------- */ 
	
	/// @dev Returns the token collection name. 
	function name() public view override returns (string memory) { 
		return _name; 
	} 
	
	/// @dev Returns the token collection symbol. 
	function symbol() public view override returns (string memory) { 
		return _symbol; 
	} 
	
	/// @dev Returns the Uniform Resource Identifier (URI) for token `id`. 
	function tokenURI(uint256) public pure override returns (string memory) { 
		return "{ fancyJson: true }"; // not relevant for RACE-21 
	} 
	
	function mint(address to, uint256 tokenId) public onlyDeployer { 
		_mint(to, tokenId); 
	} 
	
	function sudoBurn(uint256 tokenId) public onlyDeployer { 
		_burn(tokenId); 
	} 
	
	function burn(uint256 tokenId) public { 
		_burn(msg.sender, tokenId); 
	} 
} 

interface SharedTypes { 
	/* ---------------------------------- Types --------------------------------- */ 
	enum CommitReveal { 
		None, 
		Commit, 
		Reveal 
	} 
	
	struct Research { 
		CommitReveal commitReveal; 
		bool successfulFinding; 
	} 
	
	struct Entropy { 
		bytes32 entropy; 
		uint256 timestamp; 
		bytes32 previousEntropy; 
		bool previousResult; 
	} 
} 

/// @notice Uses clones-with-immutable-args to avoid cost of storage reads. 
/// See https://github.com/wighawag/clones-with-immutable-args 
contract ResearchLab is Clone { 
	/* --------------------------------- Storage -------------------------------- */ 
	SharedTypes.Research[] public researchEndeavors; 
	SharedTypes.Entropy public entropy; 
	
	/* --------------------------------- Getters -------------------------------- */ 
	/// @notice For clones-with-immutable-args custom getters are needed. 
	function getRandomOracle() public pure returns (address) { 
		return _getArgAddress(0); 
	} 
	
	function getEndeavor(uint256 idx) public view returns (SharedTypes.Research memory){ 
		return researchEndeavors[idx]; 
	} 
	
	/* ------------------------ State Transition Function ----------------------- */ 
	
	function commitReseachResources() public { 
		researchEndeavors.push(SharedTypes.Research(SharedTypes.CommitReveal.Commit, false)); 
	} 
	
	function revealResearchResult(uint256 idx) public { 
		SharedTypes.Research storage endeavor = researchEndeavors[idx]; 
		trulyRandomExternalCall(endeavor); 
	} 
	
	function trulyRandomExternalCall(SharedTypes.Research memory endeavor) internal { 
		// Update state at the same time 
		bytes memory payload = abi.encodeWithSelector(TrulyRandomOracleMock.oracleResult.selector, endeavor); 
		
		// Use TrulyRandomOracleMock to update state 
		getRandomOracle().delegatecall(payload); 
	} 
} 

contract TrulyRandomOracleMock { 
	/* --------------------------------- Storage -------------------------------- */ 
	SharedTypes.Research[] internal researchEndeavors; 
	SharedTypes.Entropy public entropy; 
	
	/* ------------------------ State Transition Function ----------------------- */ 
	// For the purpose of RACE-21 assume the random oracle obtains a seed from a truly random source. 
	function oracleResult(SharedTypes.Research memory endeavor) public { 
		// This line is a mock, assume it was actually random from external source. 
		bytes32 mockRandomSeed = keccak256(abi.encode(entropy, endeavor, block.timestamp)); 
		
		// Calculate new entropy. 
		SharedTypes.Entropy memory newEntropy = entropy; 
		calculateResult(newEntropy, mockRandomSeed); 
		
		// Update entropy state. 
		entropy = newEntropy; 
		
		// Update endeavor state. 
		endeavor.commitReveal = SharedTypes.CommitReveal.Reveal; 
		endeavor.successfulFinding = newEntropy.previousResult; 
	} 
	
	/* --------------------------------- Helpers -------------------------------- */ 
	function calculateResult(SharedTypes.Entropy memory newEntropy, bytes32 mockRandomSeed) internal view { 
		newEntropy.entropy = mockRandomSeed; 
		newEntropy.timestamp = block.timestamp; 
		newEntropy.previousEntropy = entropy.entropy; 
		// 1 in 10_000 chance but disallow 2 in a row 
		newEntropy.previousResult = uint256(mockRandomSeed) % 10_000 == 0 && !entropy.previousResult; 
	} 
} 

contract RabidRabbits { 
	using ClonesWithImmutableArgs for address; 
	
	/* --------------------------------- Errors --------------------------------- */ 
	error NotDead(); 
	
	/* ---------------------------------- Types --------------------------------- */ 
	enum Rabies { 
		None, 
		Symptomatic, 
		Ded, 
		Cured 
	} 
	
	struct Bunny { 
		uint256 id; 
		Rabies rabies; 
		address owner; 
		uint256 birthed; 
		ResearchLab[] researchLabs; 
	} 
	
	/* -------------------------- Immutable / Constant -------------------------- */ 
	
	uint256 public constant ADOPTION_PRICE = 10 ether; 
	uint256 public constant DR_FEES = 0.5 ether; 
	
	IERC20 public immutable lidoToken; 
	ResearchLab public immutable researchLabImpl; 
	address public immutable cloneArgsTarget; 
	
	/* --------------------------------- Storage -------------------------------- */ 
	
	Bunny[] public bunnies; 
	Rabbits public rabbitToken; 
	
	/* ------------------------------- Constructor ------------------------------ */ 
	// For the purpose of RACE-21 we are passing in the Lido token from mainnet 
	// https://etherscan.io/token/0x5a98fcbea516cf06857215779fd812ca3bef1b32#code 
	constructor(IERC20 _lidoToken, address _cloneArgsTarget) { 
		// Deploy contracts. 
		rabbitToken = new Rabbits(); 
		researchLabImpl = new ResearchLab(); 
		
		// Set contract state. 
		lidoToken = IERC20(_lidoToken); 
		
		cloneArgsTarget = _cloneArgsTarget; 
	} 
	
	/* --------------------------------- Getters -------------------------------- */ 
	
	function labsOf(uint256 bunnyIdx, uint256 labIdx) public view returns (ResearchLab) { 
		return bunnies[bunnyIdx].researchLabs[labIdx]; 
	} 
	
	/* ------------------------ Public State Transitions ------------------------ */ 
	function adopt() public { 
		lidoToken.transferFrom(msg.sender, address(this), ADOPTION_PRICE); 
		rabbitToken.mint(msg.sender, bunnies.length); 
		
		// 1 in 1000 chance of having a rabbit with rabies. 
		uint256 randomSeed = uint256(blockhash(block.number)); 
		Rabies rabies = randomSeed % uint32(1000) == 0 ? Rabies.Symptomatic : Rabies.None; 
		bunnies.push(Bunny(bunnies.length, rabies, msg.sender, block.timestamp, new ResearchLab[](0))); 
	} 
	
	function miracleCure(uint256 start, uint256 end) public { 
		// Once a cure is found we can cure symptomatic rabbits. 
		// "left as exercise for the reader" 
	} 
	
	function researchAndDevelopment(uint256 idx) public { 
		// Clone ResearchLab. 
		bytes memory cloneArgs = abi.encodePacked(cloneArgsTarget); 
		ResearchLab researchLab = ResearchLab(address(researchLabImpl).clone(cloneArgs)); 
		
		// init multiple research initiatives. 
		for (uint256 i = 0; i < 10; i++) { 
			researchLab.commitReseachResources(); 
			// This is a RACE, no time for actual commit/reveal. 
			researchLab.revealResearchResult(i); 
		} 
		
		// Credit where credit is due. 
		bunnies[idx].researchLabs.push(researchLab); 
	} 
	
	/// @notice if a rabbit has rabies and is not cured, it will die (╥﹏╥) 
	function burry(uint256 idx) public { 
		Bunny[] memory localBunnies = bunnies; 
		
		if (localBunnies[idx].rabies != Rabies.Symptomatic && (block.timestamp < 7 days + localBunnies[idx].birthed)) { 
			revert NotDead(); 
		} 
		
		// Efficiently delete from array. 
		bunnies[idx] = bunnies[localBunnies.length - 1]; 
		bunnies.pop(); 
		
		// Tidy up and burn token. 
		rabbitToken.sudoBurn(idx); 
	} 
}