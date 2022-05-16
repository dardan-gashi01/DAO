//script to test our contract on the localhost
const main = async () => {
    //deploying the contract here
    const messageContractFactory = await hre.ethers.getContractFactory("messages");
    const messageContract = await messageContractFactory.deploy();
    //waiting until its deployed to return us with the contract address
    await messageContract.deployed();
    console.log("contract deployed to:", messageContract.address);

    //checking if we are getting new messages with a count
    let messageCount;
    messageCount = await messageContract.getTotalMessages();
    console.log(messageCount.toNumber());
    //sending a message from our conract
    let messageTxn = await messageContract.messageUser("this is my message");
    await messageTxn.wait();

    //sending a second message form our contract
    const [_, randomPerson] = await hre.ethers.getSigners();
    messageTxn = await messageContract.connect(randomPerson).messageUser("second message");
    await messageTxn.wait();

    //retieving all of our messages from our contract
    let allMessages = await messageContract.getAllMessages();
    console.log(allMessages);
}; 

//running the scripts
const runMain = async () => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.error(err);
        process.exit(1);
    }
};
runMain();