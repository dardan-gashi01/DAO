import sdk from './1-SDK.js';

const token = sdk.getToken("0x5C69a8e7B51f035c9b09D8729A3C74795A517F03");

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