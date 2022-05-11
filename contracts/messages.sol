//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//this is an import for the console.log functions so that we can debug any errors
import "hardhat/console.sol";
//defining messages contract
contract messages {
    //setting a variable of totalMessages to keep track of the total messages 
    uint256 totalMessages;

    //creating an event that tracks our message when we send it to the blockchain
    event NewMessage(address indexed from, uint256 timestamp, string message);

    //object of type Message with the components of messager, message and timestamp
    struct Message {
        address messager;
        string message;
        uint256 timestamp;
    }

    //creating an array called messages that takes items of the object Message
    Message[] messages;

    //empty contructor as we dont pass anything through
    constructor(){
    }

    //this is our function to send our message onto the blockchain
    function messageUser(string memory _message) public {
        totalMessages+=1;
        //for debugging purposes
        //console.log("message: ", msg.sender, _message);

        //pushing the message the user sends into our array we created so we can pull from it for the forum page
        messages.push(Message(msg.sender, _message, block.timestamp));

        //this sends the message to the blockchain with the information below
        emit NewMessage(msg.sender, block.timestamp, _message);
    }

    //this is our other fnuction to be able to retrive the past messages to be able to display this in our forum page
    function getAllMessages() public view returns (Message[] memory){
        return messages;
    }
}
