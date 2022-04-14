import sdk from './1-SDK.js';
//doc used for this section https://docs.thirdweb.com/typescript/sdk.token
//getting the address of the token we deployed in the earlier script
const token = sdk.getToken("0x6f9177d6937e619ECB05E5199b09F7840De19765");

//making the minting function which essentially is like printing money
(async () => {
    try{
        //defining the amount we want to mint and this case its 1 million tokens
        const amount = 1_000_000;
        //then we have to wait until we have minted the amount
        await token.mint(amount);
        const totalSupply = await token.totalSupply();
        //then we print the total amount to check if it all went fine
        console.log('the total supply of CITYCOIN is', totalSupply.displayValue);
    }catch(err){
        console.error(err);
    }
})();