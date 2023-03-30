// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @author Franck
/// @title JO 2024 NFT
/// @notice You can use this contract for mint JO2024 
/// @dev Deploy a ERC1155 NFT Collection
contract JO2024 is ERC1155, Pausable, Ownable {
    /// The 5 tokens possible
    uint256 public constant Athletisme = 0;
    uint256 public constant Aviron = 1;
    uint256 public constant Escrime = 2;
    uint256 public constant Basketball = 3;
    uint256 public constant Boxe = 4;

    string private constant _name = 'JO 2024 Paris';
    string private constant _symbol = 'JO';

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    
    /// @dev Constructor set _uri 
    /// First item are minted
    constructor() ERC1155("https://nftstorage.link/ipfs/bafybeigi75mgneniifyoem7y2nkjqvadwmi6muj2ufehdhbec4mrazpmxa/{id}.json") {
        _mint(msg.sender, Athletisme, 1, "");
        _mint(msg.sender, Aviron, 1, "");
        _mint(msg.sender, Escrime, 1, "");
        _mint(msg.sender, Basketball, 1, "");
        _mint(msg.sender, Boxe, 1, "");
    }

    /// @dev mint function  
    function mintNFT(uint256 tokenType, uint256 tokenNb) public returns (uint256) {
        uint256 newItemId = getTokenIds();
        _mint(msg.sender, tokenType, tokenNb, "");
        //_setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    /// @dev Gets the token id.
    function getTokenIds() private returns (uint256) {
       _tokenIds.increment();
       uint256 newItemId = _tokenIds.current();
       return newItemId;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    /// @dev Gets the token name.
    /// @return string representing the token name
    function name() external pure returns (string memory) {
        return _name;
    }

    /// @dev Gets the token symbol.
    /// @return string representing the token symbol
    function symbol() external pure returns (string memory) {
        return _symbol;
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }

    /// @notice Pause the contract
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
