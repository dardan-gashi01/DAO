import sdk from './1-SDK.js';

const token = sdk.getToken("0x6f9177d6937e619ECB05E5199b09F7840De19765");

(async () => {
    try{
        const amount = 1_000_000;

        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log('the total supplt of CITYCOIN is', totalSupply.displayValue);
    }catch(err){
        console.error(err);
    }
})();