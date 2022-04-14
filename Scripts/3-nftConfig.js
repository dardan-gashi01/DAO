//importing this SDK
//used this code as a rough guide because we are not using that drop in the code
//we are using the edition drop to have an ERC1155 token
//https://portal.thirdweb.com/learn/code-examples/nft-drop
import sdk from './1-SDK.js';
import {readFileSync} from 'fs';

//storing the address of the NFT we deployed in the last script so we can use it rather than harcoding the address every time.
const NFTDrop = sdk.getEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');

//deploying the actual nft itself, not the collection
(async () => {
    try{
        //setting up our properties of the NFT
        await NFTDrop.createBatch([
            {
                name: 'Lizard',
                description: 'this lizards gives access to the DAO',
                image: readFileSync('./assets/lizard.png'),
            },
        ]);
        console.log('deployed NFT')
    }catch(err){
        console.error(err);
    }
})();



