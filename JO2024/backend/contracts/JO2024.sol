// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./interfaces/IRecursive.sol";

/// @author Franck
/// @title JO 2024 NFT - Acadee Project
/// @notice You can use this contract for mint JO2024 NFT  
///         Sport fungible NFT is use to collect, exchange and burn to get reward sport NFT
///         Sport unique NFT is a reward for example to get a ticket for the JO2024
/// @dev Deploy a ERC1155 NFT Collection
contract JO2024 is ERC1155, Pausable, Ownable, IRecursive {
    // For Opensea
    string private constant _name = 'JO 2024 Paris';
    string private constant _symbol = 'JO';
    // Amount fungible NFT to burn and get an unique sport NFT
    uint256 public amountBurn = 1000;

    /// The 5 fungible NFTs type possible and 5 unique NFT possible :
    /// AthletismeNFT = 0, AvironNFT = 1, EscrimeNFT = 2, BasketballNFT = 3, BoxeNFT = 4
    /// UniqueAthletismeNFT = 5, UniqueAvironNFT = 6, UniqueEscrimeNFT = 7, UniqueBasketballNFT = 8, UniqueBasketballNFT = 9, UniqueBoxeNFT = 10
    uint256[] public supplies = [10000,10000,10000,10000,10000,1,1,1,1,1];
    uint256[] public minted = [0,0,0,0,0,0,0,0,0,0];

    /// workflow exchange state
    enum ExchangeState {
        Init,
        Start,
        ToClose
    }

    /// Structure to save the exchange fongible NFTs between 2 players 
    struct Exchange {
        uint256 TypeFrom;
        uint256 TypeTo;
        uint256 amount;
        address to;
        ExchangeState exchangeState;
    }

    /// Map of address from => to Exchange Structure. The current exchanges
    mapping(address => Exchange) private _mapToExchange;

    /// @dev Constructor 
    /// set _uri 
    constructor() ERC1155("https://nftstorage.link/ipfs/bafybeie4rhk5qbnog5vbtvbzk6pcyweaxug7shyqrin6hum32x42vbllke/{id}.json") {
    }

    /// set _uri only Ownner
    function setURI(string memory _uri) external onlyOwner() {
        _setURI(_uri);
    }

    /// change the supply
    function setSupply(uint256 _Type, uint256 _amount) external onlyOwner() {
        supplies[_Type]=_amount;
    }

    /// change the amount to burn
    function setAmountBurn(uint256 _amount) external onlyOwner() {
        amountBurn=_amount;
    }

     /// @notice Mint function by one type 
     /// @param _Type The type of NFT
     /// @param _amount The amount to mint
    function mint(uint256 _Type, uint256 _amount) public whenNotPaused {
        console.log("mint _Type %s _amount %s", _Type, _amount);
        require(_Type <= supplies.length-1,"NFT does not exist");
        require (minted[_Type] + 1 <= supplies[_Type], "All the NFT have been minted");
        require (_amount > 0, "Mint Zero");
        _mint(msg.sender, _Type, _amount, "0x0");
        minted[_Type] += _amount;
    }

    /// @notice start exchange NFTs by msg.sender (from)
    /// @param _TypeFrom The type of NFT from
    /// @param _TypeTo The type of NFT to
    /// @param _amount The amount to exchange
    function exchangeStart(uint256 _TypeFrom, uint256 _TypeTo, uint256 _amount) public {
        console.log("exchangeStart _TypeFrom %s _TypeTo %s _amount %s", _TypeFrom, _TypeTo, _amount);
        require(_TypeFrom <= 4 && _TypeTo <= 4,"NFT does not exist to exchange");
        require(balanceOf(msg.sender, _TypeFrom) >= _amount, "Insufficient balance for transfer : from");
        require(_TypeFrom != _TypeTo,"NFTs equals");
        require (_amount > 0, "Mint Zero");
        require(_mapToExchange[msg.sender].exchangeState != ExchangeState.ToClose, "Exchange to close");
        _mapToExchange[msg.sender] = Exchange(_TypeFrom, _TypeTo, _amount, address(0), ExchangeState.Start);
        setApprovalForAll(address(this), true);
    }

    /// @notice exchange NFTs found by msg.sender (to)
    /// @param _from The address who have started the exchange
    function exchangeFound(address _from) public {
        console.log("exchangeFound _from %s", _from);
        require(_from != address(0), "Address not valide");
        require(balanceOf(msg.sender, _mapToExchange[_from].TypeTo) >= _mapToExchange[_from].amount, "Insufficient balance for transfer : to");
        require(balanceOf(_from, _mapToExchange[_from].TypeFrom) >= _mapToExchange[_from].amount, "Insufficient balance for transfer : from");
        require(_mapToExchange[_from].exchangeState == ExchangeState.Start, "Exchange not in start");
        _mapToExchange[_from].to = msg.sender;
        setApprovalForAll(address(this), true);
        exchangeToDoByContract(_from);
        setApprovalForAll(address(this), false);
    }

    /// @dev Call external function to become msg.sender     
    /// @param _from The address who have started the exchange
    function exchangeToDoByContract(address _from) private {
        console.log("exchangeToDoByContract _from %s", _from);
        IRecursive(address(this)).exchangeByContract(_from);
    }

    /// @notice exchange by the contract NFTs type between 2 address      
    /// @param _from The address who have started the exchange
    /// @dev Function external for that the contrat become  the msg.sender
    function exchangeByContract(address _from) external override {
        console.log("exchangeByContract _from %s", _from);
        require(msg.sender == address(this), "Only contract address could exchange");
        _mapToExchange[_from].exchangeState = ExchangeState.ToClose;
        safeTransferFrom(_from, _mapToExchange[_from].to, _mapToExchange[_from].TypeFrom, _mapToExchange[_from].amount, "0x0");
        safeTransferFrom(_mapToExchange[_from].to, _from, _mapToExchange[_from].TypeTo, _mapToExchange[_from].amount, "0x0");
    }

    /// @notice exchangeClose NFTs type between 2 address
    function exchangeClose() public {
        console.log("exchangeClose msg.sender %s", msg.sender);
        require(msg.sender != address(0), "Address not valide");
        require(_mapToExchange[msg.sender].exchangeState == ExchangeState.ToClose, "Exchange not to close");
        delete _mapToExchange[msg.sender];
        setApprovalForAll(address(this), false);
    }

    /// @notice exchangeState
    function exchangeState() public view returns (ExchangeState){
        return(_mapToExchange[msg.sender].exchangeState);
    }
    
    /// @notice Burn fungible NFTs to get NFT Rewards
    /// @param _Type The NFT type to burn
    function burn(uint256 _Type) public {
        console.log("burn msg.sender %s _Type %s", msg.sender, _Type);
        require(_Type <= 4,"NFT does not exist to burn");
        require(balanceOf(msg.sender, _Type) >= amountBurn, "No NFTType sufficient to burn");
        require (minted[_Type+5] + 1 <= supplies[_Type+5], "The unique NFT have been minted");
        _burn(msg.sender, _Type, amountBurn);
        // mint unique NFT of type
        mint(_Type+5, 1);
    }

    /// @notice Pause the contract
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
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
}
