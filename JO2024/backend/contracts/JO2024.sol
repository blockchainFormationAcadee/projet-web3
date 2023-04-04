// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

interface IRecursive {
    function exchangeByContract(address) external;
}

/// @author Franck
/// @title JO 2024 NFT - Acadee Project
/// @notice You can use this contract for mint JO2024 token/NFT  
///         Sport Token is use to collect, exchange and burn to get reward sport NFT
///         Sport NFT is a reward for example to get a ticket for the JO2024
/// @dev Deploy a ERC1155 token/NFT Collection
contract JO2024 is ERC1155, Pausable, Ownable, IRecursive {
    string private constant _name = 'JO 2024 Paris';
    string private constant _symbol = 'JO';
    // Amount tokens to burn and get sport NFT
    uint256 private amountBurn = 1000;

    /// The 5 tokens type possible and 5 NFT possible
    /// AthletismeToken = 0, AvironToken = 1, EscrimeToken = 2, BasketballToken = 3, BoxeToken = 4
    /// AthletismeNFT = 5, AvironNFT = 6, EscrimeNFT = 7, BasketballNFT = 8, BasketballToken = 9, BoxeNFT = 10
    uint256[] private supplies = [10000,10000,10000,10000,10000,1,1,1,1,1];
    uint256[] private minted = [0,0,0,0,0,0,0,0,0,0];

    /// workflow exchange state
    enum ExchangeState {
        Zero,
        Start,
        ToClose
    }

    /// Structure to save the exchange token between 2 players 
    struct Exchange {
        uint256 tokenTypeFrom;
        uint256 tokenTypeTo;
        uint256 amount;
        address to;
        ExchangeState exchangeState;
    }

    /// Map of address from => to Exchange Structure. The current exchanges
    mapping(address => Exchange) private _mapToExchange;

/// TODO modifier
    modifier onlySender() {
        require(msg.sender == msg.sender, "only sender can call this");
        _;
    }

    /// @dev Constructor 
    /// set _uri 
    constructor() ERC1155("https://nftstorage.link/ipfs/bafybeigi75mgneniifyoem7y2nkjqvadwmi6muj2ufehdhbec4mrazpmxa/{id}.json") {
    }

     /// @notice mint function
     /// @param _tokenType The type of token
     /// @param _amount The number to mint
    function mint(uint256 _tokenType, uint256 _amount) public {
        console.log("mint _tokenType %s _amount %s", _tokenType, _amount);
        require(_tokenType <= supplies.length-1,"NFT does not exist");
        require (minted[_tokenType] + 1 <= supplies[_tokenType], "All the NFT have been minted");
        require (_amount > 0, "Mint Zero");
        _mint(msg.sender, _tokenType, _amount, "0x0");
        minted[_tokenType] += _amount;
    }

    /// @notice start exchange tokens by msg.sender (from)
    /// @param _tokenTypeFrom The type of token from
    /// @param _tokenTypeTo The type of token to
    /// @param _amount The amount to exchange
    function exchangeStart(uint256 _tokenTypeFrom, uint256 _tokenTypeTo, uint256 _amount) public {
        console.log("exchangeStart _tokenTypeFrom %s _tokenTypeTo %s _amount %s", _tokenTypeFrom, _tokenTypeTo, _amount);
        require(balanceOf(msg.sender, _tokenTypeFrom) >= _amount, "No tokenType sufficient from");
        require(_tokenTypeFrom <= 4 && _tokenTypeTo <= 4,"Token does not exist");
        require(_tokenTypeFrom != _tokenTypeTo,"Tokens equals");
        require (_amount > 0, "Mint Zero");
        require(_mapToExchange[msg.sender].exchangeState != ExchangeState.ToClose, "Exchange to close");
        _mapToExchange[msg.sender] = Exchange(_tokenTypeFrom, _tokenTypeTo, _amount, address(0), ExchangeState.Start);
        setApprovalForAll(address(this), true);
    }

    /// @notice exchange tokens found by msg.sender (to)
    /// @param _from The address who have started the exchange
    function exchangeFound(address _from) public {
        console.log("exchangeFound _from %s", _from);
        require(_from != address(0), "Address not valide");
        require(balanceOf(msg.sender, _mapToExchange[_from].tokenTypeTo) >= _mapToExchange[_from].amount, "Insufficient balance for transfer : to");
        require(balanceOf(_from, _mapToExchange[_from].tokenTypeFrom) >= _mapToExchange[_from].amount, "Insufficient balance for transfer : from");
        require(_mapToExchange[_from].exchangeState == ExchangeState.Start, "Exchange not in start");
        _mapToExchange[_from].to = msg.sender;
        setApprovalForAll(address(this), true);
        exchangeToDoByContract(_from);
        setApprovalForAll(address(this), false);
    }

    /// @notice exchange by the contract tokens type between 2 address      
    /// @param _from The address who have started the exchange
    /// @dev Function external for that the contrat become  the msg.sender
    function exchangeByContract(address _from) external override {
        console.log("exchangeByContract _from %s", _from);
        require(msg.sender == address(this), "Only contract address could exchange");
        _mapToExchange[_from].exchangeState = ExchangeState.ToClose;
        safeTransferFrom(_from, _mapToExchange[_from].to, _mapToExchange[_from].tokenTypeFrom, _mapToExchange[_from].amount, "0x0");
        safeTransferFrom(_mapToExchange[_from].to, _from, _mapToExchange[_from].tokenTypeTo, _mapToExchange[_from].amount, "0x0");
    }
    
    /// @dev Call external function to become msg.sender     
    /// @param _from The address who have started the exchange
    function exchangeToDoByContract(address _from) private {
        console.log("exchangeToDoByContract _from %s", _from);
        IRecursive(address(this)).exchangeByContract(_from);
    }

    /// @notice exchangeClose tokens type between 2 address
    function exchangeClose() public {
        require(msg.sender != address(0), "Address not valide");
        require(_mapToExchange[msg.sender].exchangeState == ExchangeState.ToClose, "Exchange not to close");
        delete _mapToExchange[msg.sender];
        setApprovalForAll(address(this), false);
    }

    /// @notice exchangeState
    function exchangeState() public view returns (ExchangeState){
        return(_mapToExchange[msg.sender].exchangeState);
    }

    /// @notice Burn tokens to get NFT Rewards
    /// @param _tokenType The token type to burn
    function burn(uint256 _tokenType) public {
        require(_tokenType <= 4 && _tokenType <= 4,"Token does not exist");
        require(balanceOf(msg.sender, _tokenType) >= amountBurn, "No tokenType sufficient to burn");
        _burn(msg.sender, _tokenType, amountBurn);
        mint(_tokenType+5, 1);
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

    /// @notice Pause the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

}
