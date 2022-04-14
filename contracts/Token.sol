//SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Token is ERC20Votes {
    uint public s_maxSupply = 1000000000000000000000000000000;

    constructor() ERC20("City Coin","CITY")ERC20Permit("City Coin"){
        _mint(msg.sender, s_maxSupply);
    }

    //overrides required by solidity

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes){
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes){
        super._burn(account, amount);
    }
}

