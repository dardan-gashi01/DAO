import sdk from './1-SDK.js';

//here we deploy our erc20 token(cryptocurrency) so that the users can vote on proposals
//I did create a smart contract for this if you go to contract/Token.sol
//however to make it compatible with the NFT we deployed we need to use ThirdWeb again 

(async () => {
    try{
        //deploying the token with the name CITY COIN, ticker CITY
        const tokenAdd = await sdk.deployer.deployToken({
            name: "CITY COIN",
            symbol:"CITY",
        });
        console.log('deploted token, address:', tokenAdd);
    }catch(err){
        console.error(err);
    }
})();

