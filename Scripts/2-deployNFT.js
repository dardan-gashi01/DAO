import sdk from './1-SDK.js';
import {readFile, readFileSync} from 'fs';

(async () => {
    try{
        const NFTDropAddress = await sdk.deployer.deployEditionDrop({
            name: 'CITY DAO PASS',
            description: 'The pass to join the CITY DAO',
            image: readFileSync('./assets/lizard.png'),
            primary_sale_recipient: "0x964fC93ba3C3b4809f154a419274a7F3d1A3F38A",
        });


        const NFTDrop = sdk.getEditionDrop(NFTDropAddress);

        await NFTDrop.royalty.setDefaultRoyaltyInfo({
            seller_fee_basis_points: 500, // 5%
            fee_recipient: "0x964fC93ba3C3b4809f154a419274a7F3d1A3F38A"
        });

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