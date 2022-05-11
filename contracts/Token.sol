//SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

//new contract called Token that extends the ERC20Votes
contract Token is ERC20Votes {
    ///this is the supply of the coins
    uint public s_maxSupply = 1000000000000000000000000000000;

    //constructor so we name it the coin name we want and to mint the total supply straight away once its called
    constructor() ERC20("City Coin","CITY")ERC20Permit("City Coin"){
        _mint(msg.sender, s_maxSupply);
    }

    //overrides required by solidity
    
    //this is to be able to transfer tokens to people 
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    //our mint function so the user can mint the function as we called it in the constructor
    function _mint(address to, uint256 amount) internal override(ERC20Votes){
        super._mint(to, amount);
    }

    //burn tokens that are used to vote so they cannot be used anymore
    function _burn(address account, uint256 amount) internal override(ERC20Votes){
        super._burn(account, amount);
    }
}

