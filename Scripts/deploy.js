//making the file to deploy our contract to the blockchain
const main = async () => {
    //getting the deployer account so that we have access to it and we can deploy
    const [deployer] = await hre.ethers.getSigners();
    //getting the balance in the account to make sure that we can deploy and have enough
    const accountBalance = await deployer.getBalance();
    //just to check if we have the correct address and balance
    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account Balance: ", accountBalance.toString());

    //deploying the contract here
    const messageContractFactory = await hre.ethers.getContractFactory("messages");
    const messageContract = await messageContractFactory.deploy();
    //waiting until its deployed to return us with the contract address
    await messageContract.deployed();
    console.log("messageSystem address: ", messageContract.address);
}; 

//this method runs the deploy script
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

