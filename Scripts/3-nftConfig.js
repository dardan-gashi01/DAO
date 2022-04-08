import sdk from './1-SDK.js';
import {readFileSync} from 'fs';

const NFTDrop = sdk.getEditionDrop('0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7');

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