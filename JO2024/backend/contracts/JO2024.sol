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
    /// The 5 tokens type possible
    uint256 public constant Athletisme = 0;
    uint256 public constant Aviron = 1;
    uint256 public constant Escrime = 2;
    uint256 public constant Basketball = 3;
    uint256 public constant Boxe = 4;

    string private constant _name = 'JO 2024 Paris';
    string private constant _symbol = 'JO';

    /// workflow exchange state
    enum ExchangeState {
        Start,
        ToValidate,
        Closed
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
     /// @param tokenType The type of token
     /// @param tokenNb The number to mint
    function mintJeton(uint256 tokenType, uint256 tokenNb) public {
        _mint(msg.sender, tokenType, tokenNb, "0x0");
    }

    /// @notice start exchange tokens 
    /// @param _tokenTypeFrom The type of token
    function exchangeStart(uint256 _tokenTypeFrom, uint256 _tokenTypeTo, uint256 _amount) public {
        //require(balanceOf(msg.sender, tokenType) > 0, "No tokenType avalable");
        _mapToExchange[msg.sender] = Exchange(_tokenTypeFrom, _tokenTypeTo, _amount, address(0), ExchangeState.Start);
    }

    /// @notice exchange tokens found
    /// @param _from The address who have started the exchange
    function exchangeFound(address _from) public {
        //require(balanceOf(msg.sender, tokenType) > 0, "No tokenType avalable");
        _mapToExchange[_from].to = msg.sender;
        _mapToExchange[_from].exchangeState = ExchangeState.ToValidate;
        setApprovalForAll(_from, true);
    }

    /// @notice exchange tokens type between 2 address
    function exchange() public {
        //require(balanceOf(_from, _fromTokenType) > 0, "No tokenType avalable require1");
        //require(balanceOf(_to, _toTokenType) > 0, "No tokenType avalable require2");
        //require(_mapToExchange[_from] == _fromTokenType, "No tokenType avalable require2");

        _mapToExchange[msg.sender].exchangeState = ExchangeState.Closed;
        safeTransferFrom(msg.sender, _mapToExchange[msg.sender].to, _mapToExchange[msg.sender].tokenTypeFrom, _mapToExchange[msg.sender].amount, "0x0");
        safeTransferFrom(_mapToExchange[msg.sender].to, msg.sender, _mapToExchange[msg.sender].tokenTypeTo, _mapToExchange[msg.sender].amount, "0x0");
    }

    /// @notice exchangeClose tokens type between 2 address
    function exchangeClose(address _from) public {
        //require(balanceOf(_from, _fromTokenType) > 0, "No tokenType avalable require1");
        //require(balanceOf(_to, _toTokenType) > 0, "No tokenType avalable require2");
        //require(_mapToExchange[_from] == _fromTokenType, "No tokenType avalable require2");

        delete _mapToExchange[_from];
        setApprovalForAll(_from, false);
    }

    /// @notice exchangeState
    function exchangeState() public view returns (ExchangeState){
        return(_mapToExchange[msg.sender].exchangeState);
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

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

}
