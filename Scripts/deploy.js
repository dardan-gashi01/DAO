const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account Balance: ", accountBalance.toString());

    const messageContractFactory = await hre.ethers.getContractFactory("messages");
    const messageContract = await messageContractFactory.deploy();
    await messageContract.deployed();
    
    console.log("messageSystem address: ", messageContract.address);
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