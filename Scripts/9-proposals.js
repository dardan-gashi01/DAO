import sdk from './1-SDK.js';

const vote = sdk.getVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');
const NFTDrop = sdk.getEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
const token = sdk.getToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');
// adapted once again from with small changes made to parameters https://portal.thirdweb.com/guides/build-treasury-and-governance-for-your-dao
(async () => {
    try{
        const description = 'random proposal for some more final checks';
        
        await vote.propose(description);

        console.log('created proposal');

    }catch(err){
        console.error(err);
        process.exit(1);
    }

    try {
      // Grab all the addresses of people who own our membership NFT we are looking for everyone with the id of 0
      const walletAddresses = await NFTDrop.history.getAllClaimerAddresses(0);
  
      //error handling to make sure nothing happens if no claimers
      if (walletAddresses.length === 0) {
        console.log(
          "No NFTS claimed yet",
        );
        process.exit(0);
      }
  
      // Loop through the array of addresses that hold the NFT
      const recipients = walletAddresses.map((address) => {
        // setting airdrop amount to 5000 tokens to each holder of the NFT
        const Amount = 5;
        console.log('airdropping 5 to', address);
  
        // making the airdrop target which is the address and the amount they receive
        //for creating the airdrop method we used the function transferbatch and used the key as shown below
        //to guide us to this code we used the documentation for transferring tokens to a group of people at once
        //https://portal.thirdweb.com/typescript/sdk.Erc20.transferBatch
        const recipient = { 
          toAddress: address, 
          amount: Amount, 
        };
  
        return recipient;
      });
  
      // Call transferBatch on all our airdrop targets.
      console.log("beginning airdrop...");
      //this moves the tokens to them
      await token.transferBatch(recipients);
      console.log("airdrop complete");
    } catch (error) {
      console.log(error);
    }
})();




