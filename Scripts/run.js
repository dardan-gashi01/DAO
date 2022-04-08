const main = async () => {
    
    const messageContractFactory = await hre.ethers.getContractFactory("messages");
    const messageContract = await messageContractFactory.deploy();
    await messageContract.deployed();
    console.log("contract deployed to:", messageContract.address);

    let messageCount;
    messageCount = await messageContract.getTotalMessages();
    console.log(messageCount.toNumber());

    let messageTxn = await messageContract.messageUser("this is my message");
    await messageTxn.wait();

    const [_, randomPerson] = await hre.ethers.getSigners();
    messageTxn = await messageContract.connect(randomPerson).messageUser("second message");
    await messageTxn.wait();

    let allMessages = await messageContract.getAllMessages();
    console.log(allMessages);

}; 

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