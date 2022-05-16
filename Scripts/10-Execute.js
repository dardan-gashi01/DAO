//executing proposals script to execute all proposals that are 

import sdk from './1-SDK.js';

const vote = sdk.getVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');

(async () => {
    try{
        //getting all proposals 
        const proposals = await vote.getAll();
        //loop to iterate all proposals
        for (let i = 0; i< proposals.length; i++){
            //checking the state to see if it is in execute state
            if (proposals[i].state === 4){
                //if it is ready to execute we execute the proposals
                await vote.execute(proposals[i].proposalId);
                console.log('executed the proposal:', proposals[i].description)
            }          
        }
    }catch(error){
        console.error(error);
    }
})();

