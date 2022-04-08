//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract messages {
    uint256 totalMessages;

    event NewMessage(address indexed from, uint256 timestamp, string message);

    struct Message {
        address messager;
        string message;
        uint256 timestamp;
    }

    Message[] messages;

    constructor(){
    }

    function getTotalMessages() public view returns (uint256){
        console.log("we have %d total messages", totalMessages);
        return totalMessages;
    }

    function messageUser(string memory _message) public {
        totalMessages+=1;
        console.log("message: ", msg.sender, _message);

        messages.push(Message(msg.sender, _message, block.timestamp));

        emit NewMessage(msg.sender, block.timestamp, _message);
    }

    function getAllMessages() public view returns (Message[] memory){
        return messages;
    }
}
