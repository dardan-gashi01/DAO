import sdk from './1-SDK.js';
import {MaxUint256} from "@ethersproject/constants";

const NFTDrop = sdk.getEditionDrop("0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7");

(async () => {
    try{
        const conditions = [{
            startTime: new Date(),

            max_Quantity: 10,

            price: 0.2,

            quantityLimitPerTransaction: 1,

            waitInSeconds: MaxUint256,
        }]

        await NFTDrop.claimConditions.set("0", conditions);
        console.log('deployed the conditions to claim the drop')
    }catch(err){
        console.error(err);
    }
})();