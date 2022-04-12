import sdk from './1-SDK.js';
import {readFileSync} from 'fs';

const NFTDrop = sdk.getEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');

(async () => {
    try{
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