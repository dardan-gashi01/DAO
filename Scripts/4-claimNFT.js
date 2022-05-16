//for this I wasnt quite sure how to use the documentation for this claim condition so I used this an example
//https://docs.thirdweb.com/typescript/sdk.editiondrop
//importing the sdk
import sdk from './1-SDK.js';
import {MaxUint256} from "@ethersproject/constants";

//storing our nft address in a variable to make it easier to use
const NFTDrop = sdk.getEditionDrop("0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B");

//setting up our claim conditions so the like the price, time it goes up for sale etc
(async () => {
    try{
        //these statistics here would be different in a real life scenario but for test purposes we used the ones below
        const conditions = [{
            //start time as right now. we wouldnt do this in real life becuase you would prepare for a specific time
            startTime: new Date(),
            max_Quantity: 10,
            price: 0.1,
            //this is so we make sure that one user cannot just buy all 10 of our supply and we are a fair
            //governance
            quantityLimitPerTransaction: 1,
            //set the wait so the user cannot claim more than one so this is the maximum integer and I learnt this
            //when I was doing a solidity course and came accross this which was interesting so I used it here
            //https://forum.openzeppelin.com/t/using-the-maximum-integer-in-solidity/3000
            waitInSeconds: MaxUint256,
        }]
        //here we are setting the condition. we are doing something pretty interesting here.
        //so for erc1155 users can have multiple nfts that are the same id and this is the best for a DAO
        //because the point is to have the same pass. another thing this solves is that the gas paid is much lower
        //for erc1155
        await NFTDrop.claimConditions.set("0", conditions);
        console.log('deployed the conditions to claim the drop')
    }catch(err){
        console.error(err);
    }
})();




