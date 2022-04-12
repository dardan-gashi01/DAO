import sdk from './1-SDK.js';
import {MaxUint256} from "@ethersproject/constants";

const NFTDrop = sdk.getEditionDrop("0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B");

(async () => {
    try{
        const conditions = [{
            startTime: new Date(),

            max_Quantity: 10,

            price: 0.1,

            quantityLimitPerTransaction: 1,

            waitInSeconds: MaxUint256,
        }]

        await NFTDrop.claimConditions.set("0", conditions);
        console.log('deployed the conditions to claim the drop')
    }catch(err){
        console.error(err);
    }
})();