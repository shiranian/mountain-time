//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/*
    Forge must be set before minting
*/
contract M3Token is ERC1155, Ownable {
    mapping(address => uint256) public lastMintTime; // Cooldown tracker 
    uint256 public constant COOLDOWN_PERIOD = 60; // 1 minute cooldown
    uint256 public constant TOKEN_AMOUNT = 1;
    address public forge; 

	// Errors
	error Cooldown(uint256 lastMintTime, uint256 current);
    error NotForge(address pretender);
	
    constructor(string memory uri) ERC1155(uri) Ownable() {

    }
    
    // Only the forge can execute functions to mint the tokens 
    modifier onlyForge() {
        if (msg.sender != forge) revert NotForge(msg.sender);
        _;
    }

    // After the contract is deployed, we will deploy the Forging contract and only the owner can set the forge 
    function setForge(address _forge) public onlyOwner {
        forge = _forge;
    }

    // Forging logic is in Forge contract. Only forge contract can execute this function 
    function mint(address sender, uint256 tokenId) public onlyForge{
        // Cooldown for tokens
        if(block.timestamp < lastMintTime[sender] + COOLDOWN_PERIOD) revert Cooldown(lastMintTime[sender], block.timestamp);
        lastMintTime[sender] = block.timestamp;
        _mint(sender, tokenId, TOKEN_AMOUNT , "");
    }

    // Only allow the forge to burn anyones token
    function burn(address sender, uint256 tokenId) public onlyForge {
        _burn(sender, tokenId, TOKEN_AMOUNT);
    }

}

contract M3Forge {

    // Errors
	error TokenRestricted();
	error BadForge(uint256 targetTokenId, uint256 insufficientTokenId); 

    M3Token public m3Token;
    uint256 public constant TOKEN_AMOUNT = 1;

    // Burn combinations for forging each token (3-6)
    mapping(uint256 => uint256[]) public burnRequirements;


    constructor(address tokenContract) {
        m3Token = M3Token(tokenContract);

        // Define burn requirements for forging
        burnRequirements[3] = [0, 1];
        burnRequirements[4] = [1, 2];
        burnRequirements[5] = [0, 2];
        burnRequirements[6] = [0, 1, 2];
    }

    // Users will call this function to create a token 
    function forge(address sender, uint256 targetTokenId) public {
        // Only 7 tokens exist 
        if (targetTokenId >= 7) revert TokenRestricted(); 

        // Allow free forging of token 0-2
        if (targetTokenId < 3) {
            m3Token.mint(sender, targetTokenId);
            return; // Return and skip logic below
        }
        
        // Burn required tokens for tokens 3-6
        // Note: This is not efficient for large lists, but this is small. Could store variables and maps
        for (uint256 i = 0; i < burnRequirements[targetTokenId].length; i++) {
            uint256 burnToken = burnRequirements[targetTokenId][i];
            if (m3Token.balanceOf(sender, burnToken) >= 1) { //Check users balance to avoid partial burns 
                m3Token.burn(sender, burnToken);
            } else {
                revert BadForge(targetTokenId, burnToken); //If any burn requirement is insufficient, revert entire transaction
            }
        }
        // All burn requirements have been met, mint target token
        m3Token.mint(sender, targetTokenId);         
    }
}
