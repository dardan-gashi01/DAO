//importing the sdk we created to be able to interact and deploy the contract
import sdk from './1-SDK.js';
import {readFile, readFileSync} from 'fs';

//function to create our NFT collection and deploying it to the blockchain
(async () => {
    try{
        //using editionDrop because we want to use an ERC1155 token as we want all users to have the same ID NFT
        const NFTDropAddress = await sdk.deployer.deployEditionDrop({
            //name of the NFT
            name: 'CITY DAO PASS',
            //a little description
            description: 'The pass to join the CITY DAO',
            //importing the image into it so when they have it in their wallet they can see it
            image: readFileSync('./assets/lizard.png'),
            //address of the person receiving the ethereum when the user buys it. for this I put the DAO's address
            primary_sale_recipient: "0x964fC93ba3C3b4809f154a419274a7F3d1A3F38A",
        });

        //we are getting the NFT drop address so that we can us it with the other scripts and pages
        const NFTDrop = sdk.getEditionDrop(NFTDropAddress);

        //setting royalties on the NFT so if the owner wants to sell a small percentage goes to the DAO to be used
        //as future investment
        await NFTDrop.royalty.setDefaultRoyaltyInfo({
            seller_fee_basis_points: 500, // 5% royalties
            fee_recipient: "0x964fC93ba3C3b4809f154a419274a7F3d1A3F38A"//the address of the DAO
        });

        //getting the information of  the royalties to confirm its correct when we display it
        const royaltyInfo = await NFTDrop.royalty.getDefaultRoyaltyInfo()
        
        //same as above but we are getting our metadata information which should just be the things above
        const metadata = await NFTDrop.metadata.get();

        //just printing things to the console to confirm that everything deployed as we expected it to
        console.log('deployed drop contract the address is :', NFTDropAddress);
        console.log("deploying royalties...");
        console.log("royalties: ", royaltyInfo);
        console.log("metadata: ", metadata);
    }catch(err){
        console.error(err);
    }
})();