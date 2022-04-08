import sdk from './1-SDK.js';

const NFTDrop = sdk.getEditionDrop('0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7');
const token = sdk.getToken('0x5C69a8e7B51f035c9b09D8729A3C74795A517F03');

(async () => {
    try{
        const walletAddresses = await NFTDrop.history.getAllClaimerAddresses(0);

        if(walletAddresses.length === 0){
            console.log('none claimed');
            process.exit(0);
        }

        const airdropAddresses = walletAddresses.map((address) => {
            const amount = 5_000;
            console.log('airdropping', amount ,'coins to', address);

            const airdropAddress = {
                toAddress: address,
                amount: amount,
            };

            return airdropAddress;
        });

        console.log('beginning airdrop');
        await token.transferBatch(airdropAddresses);
        console.log('airdrop complete');
    }catch(err){
        console.log(err);
    }
})();