import sdk from './1-SDK.js';
import {readFile, readFileSync} from 'fs';

(async () => {
    try{
        const NFTDropAddress = await sdk.deployer.deployEditionDrop({
            name: 'CITY DAO PASS',
            description: 'The pass to join the CITY DAO',
            image: readFileSync('./assets/lizard.png'),
            primary_sale_recipient: "0x001aa75Cf65D7CdF916dc2B69B0b47e45ad63a22",
        });


        const NFTDrop = sdk.getEditionDrop(NFTDropAddress);

        await NFTDrop.royalty.setDefaultRoyaltyInfo({
            seller_fee_basis_points: 500, // 5%
            fee_recipient: "0x54000321f966e0469367415436594De58e3BC304"
        })

        const royaltyInfo = await NFTDrop.royalty.getDefaultRoyaltyInfo()
        

        const metadata = await NFTDrop.metadata.get();

        console.log('deployed drop contract the address is :', NFTDropAddress);
        console.log("deploying royalties...");
        console.log("royalties: ", royaltyInfo);
        console.log("metadata: ", metadata);
    }catch(err){
        console.error(err);
    }
})();