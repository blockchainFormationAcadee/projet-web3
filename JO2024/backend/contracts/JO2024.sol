// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @author Franck
/// @title JO 2024 NFT
/// @notice You can use this contract for mint JO2024 
/// @dev Deploy a ERC1155 NFT Collection
contract JO2024 is ERC1155, Pausable, Ownable {
    string private constant _name = 'JO 2024 Paris';
    string private constant _symbol = 'JO';
    uint256 private amountBurn = 1000;

    /// The 5 tokens type possible and 5 NFT possible
    /// AthletismeToken = 0, AvironToken = 1, EscrimeToken = 2, BasketballToken = 3, BoxeToken = 4
    /// AthletismeNFT = 5, AvironNFT = 6, EscrimeNFT = 7, BasketballNFT = 8, BasketballToken = 9, BoxeNFT = 10
    uint256[] private supplies = [10000,10000,10000,10000,10000,1,1,1,1,1];
    uint256[] private minted = [0,0,0,0,0,0,0,0,0,0];

    /// workflow exchange state
    enum ExchangeState {
        Start,
        ToValidate,
        ToClose
    }

    /// Structure to save the exchange token between 2 collectors 
    struct Exchange {
        uint256 tokenTypeFrom;
        uint256 tokenTypeTo;
        uint256 amount;
        address to;
        ExchangeState exchangeState;
    }

    /// @dev map of address from => to exchange Structure
    mapping(address => Exchange) private _mapToExchange;

    modifier onlyExchanger() {
        require(msg.sender == msg.sender, "only exchanger can call this");
        _;
    }

    /// @dev Constructor 
    /// set _uri 
    /// set exchanger
    constructor() ERC1155("https://nftstorage.link/ipfs/bafybeigi75mgneniifyoem7y2nkjqvadwmi6muj2ufehdhbec4mrazpmxa/{id}.json") {
    }

     /// @notice mint function
     /// @param _tokenType The type of token
     /// @param _amount The number to mint
    function mint(uint256 _tokenType, uint256 _amount) public {
        require(_tokenType <= supplies.length-1,"NFT does not exist");
        require (minted[_tokenType] + 1 <= supplies[_tokenType], "All the NFT have been minted");
        require (_amount > 0, "Mint Zero");
        _mint(msg.sender, _tokenType, _amount, "0x0");
        minted[_tokenType] += _amount;
    }

     /// @notice mint function with address
     /// @param _to The address that will receive the token
     /// @param _tokenType The type of token
     /// @param _amount The number to mint
    function mintWithAddress(address _to, uint256 _tokenType, uint256 _amount) public {
        require(_to != address(0), "Address not valide");
        require(_tokenType <= supplies.length-1,"NFT does not exist");
        require (minted[_tokenType] + 1 <= supplies[_tokenType], "All the NFT have been minted");
        require (_amount > 0, "Mint Zero");
        _mint(_to, _tokenType, _amount, "0x0");
        minted[_tokenType] += _amount;
    }

    /// @notice start exchange tokens 
    /// @param _tokenTypeFrom The type of token from
    /// @param _tokenTypeTo The type of token to
    /// @param _amount The amount to exchange
    function exchangeStart(uint256 _tokenTypeFrom, uint256 _tokenTypeTo, uint256 _amount) public {
        require(balanceOf(msg.sender, _tokenTypeFrom) >= _amount, "No tokenType sufficient from");
        require(_tokenTypeFrom <= 4 && _tokenTypeTo <= 4,"Token does not exist");
        require(_tokenTypeFrom != _tokenTypeTo,"Tokens equals");
        require (_amount > 0, "Mint Zero");
        require(_mapToExchange[msg.sender].exchangeState != ExchangeState.ToValidate, "Exchange to validate");
        require(_mapToExchange[msg.sender].exchangeState != ExchangeState.ToClose, "Exchange to close");
        _mapToExchange[msg.sender] = Exchange(_tokenTypeFrom, _tokenTypeTo, _amount, address(0), ExchangeState.Start);
    }

    /// @notice start exchange tokens 
    /// @param _from The address start an exchange
    /// @param _tokenTypeFrom The type of token from
    /// @param _tokenTypeTo The type of token to
    /// @param _amount The amount to exchange
    function exchangeStartWithAddress(address _from, uint256 _tokenTypeFrom, uint256 _tokenTypeTo, uint256 _amount) public {
        require(_from != address(0), "Address not valide");
        require(balanceOf(_from, _tokenTypeFrom) >= _amount, "No tokenType sufficient from");
        require(_tokenTypeFrom <= 4 && _tokenTypeTo <= 4,"Token does not exist");
        require(_tokenTypeFrom != _tokenTypeTo,"Tokens equals");
        require (_amount > 0, "Mint Zero");
        require(_mapToExchange[_from].exchangeState != ExchangeState.ToValidate, "Exchange to validate");
        require(_mapToExchange[_from].exchangeState != ExchangeState.ToClose, "Exchange to close");
        _mapToExchange[_from] = Exchange(_tokenTypeFrom, _tokenTypeTo, _amount, address(0), ExchangeState.Start);
    }

    /// @notice exchange tokens found
    /// @param _from The address who have started the exchange
    function exchangeFound(address _from) public {
        require(_from != address(0), "Address not valide");
        require(balanceOf(msg.sender, _mapToExchange[_from].tokenTypeTo) >= _mapToExchange[_from].amount, "No tokenType sufficient to");
        require(_mapToExchange[_from].exchangeState == ExchangeState.Start, "Exchange not in start");
        _mapToExchange[_from].to = msg.sender;
        _mapToExchange[_from].exchangeState = ExchangeState.ToValidate;
        setApprovalForAll(_from, true);
    }

    /// @notice exchange tokens found
    /// @param _from The address who have started the exchange
    /// @param _to The address who accept the exchange
    function exchangeFoundWithAddress(address _from, address _to) public {
        require(_from != address(0), "Address not valide");
        require(_to != address(0), "Address not valide");
        require(balanceOf(_to, _mapToExchange[_from].tokenTypeTo) >= _mapToExchange[_from].amount, "No tokenType sufficient to");
        require(_mapToExchange[_from].exchangeState == ExchangeState.Start, "Exchange not in start");
        _mapToExchange[_from].to = _to;
        _mapToExchange[_from].exchangeState = ExchangeState.ToValidate;
        setApprovalForAll(_from, true);
    }

    /// @notice exchange tokens type between 2 address
    function exchange() public {
        require(balanceOf(msg.sender, _mapToExchange[msg.sender].tokenTypeFrom) >= _mapToExchange[msg.sender].amount, "No tokenType sufficient from");
        require(balanceOf(_mapToExchange[msg.sender].to, _mapToExchange[msg.sender].tokenTypeTo) >= _mapToExchange[msg.sender].amount, "No tokenType sufficient to");
        require(_mapToExchange[msg.sender].exchangeState == ExchangeState.ToValidate, "Exchange not to validate");

        _mapToExchange[msg.sender].exchangeState = ExchangeState.ToClose;
        safeTransferFrom(msg.sender, _mapToExchange[msg.sender].to, _mapToExchange[msg.sender].tokenTypeFrom, _mapToExchange[msg.sender].amount, "0x0");
        safeTransferFrom(_mapToExchange[msg.sender].to, msg.sender, _mapToExchange[msg.sender].tokenTypeTo, _mapToExchange[msg.sender].amount, "0x0");
    }

    /// @notice exchange tokens type between 2 address
    /// @param _from The address who do exchange
    function exchangeWithAddress(address _from) public {
        require(_from != address(0), "Address not valide");
        require(balanceOf(_from, _mapToExchange[_from].tokenTypeFrom) >= _mapToExchange[_from].amount, "No tokenType sufficient from");
        require(balanceOf(_mapToExchange[_from].to, _mapToExchange[_from].tokenTypeTo) >= _mapToExchange[_from].amount, "No tokenType sufficient to");
        require(_mapToExchange[_from].exchangeState == ExchangeState.ToValidate, "Exchange not to validate");

        _mapToExchange[_from].exchangeState = ExchangeState.ToClose;
        safeTransferFrom(_from, _mapToExchange[_from].to, _mapToExchange[_from].tokenTypeFrom, _mapToExchange[_from].amount, "0x0");
        safeTransferFrom(_mapToExchange[_from].to, _from, _mapToExchange[_from].tokenTypeTo, _mapToExchange[_from].amount, "0x0");
    }

    /// @notice exchangeClose tokens type between 2 address
    function exchangeClose(address _from) public {
        require(_from != address(0), "Address not valide");
        require(_mapToExchange[_from].to == msg.sender, "Not possible to close");
        require(_mapToExchange[_from].exchangeState == ExchangeState.ToClose, "Exchange not to close");

        delete _mapToExchange[_from];
        setApprovalForAll(_from, false);
    }

    /// @notice exchangeState
    function exchangeState() public view returns (ExchangeState){
        return(_mapToExchange[msg.sender].exchangeState);
    }

    /// @notice exchangeState With Address
    /// @param _address The address 
    function exchangeStateWithAddress(address _address) public view returns (ExchangeState){
        return(_mapToExchange[_address].exchangeState);
    }

    /// @notice Burn token to NFT Rewards
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
