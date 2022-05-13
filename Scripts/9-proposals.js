import sdk from './1-SDK.js';

const vote = sdk.getVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');
const NFTDrop = sdk.getEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
const token = sdk.getToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');
// adapted once again from with small changes made to parameters https://portal.thirdweb.com/guides/build-treasury-and-governance-for-your-dao
(async () => {
    try{
        const description = 'This is the test 2 proposal for the video';
        
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
      const airdropTargets = walletAddresses.map((address) => {
        // setting airdrop amount to 5000 tokens to each holder of the NFT
        const Amount = 5;
        console.log('airdropping 5 to', address);
  
        // making the airdrop target which is the address and the amount they receive
        const airdropTarget = {
          toAddress: address,
          amount: Amount,
        };
  
        return airdropTarget;
      });
  
      // Call transferBatch on all our airdrop targets.
      console.log("beginning airdrop...");
      //this moves the tokens to them
      await token.transferBatch(airdropTargets);
      console.log("airdrop complete");
    } catch (err) {
      console.error("Failed to airdrop tokens", err);
    }
})();



/*proposals to mint extra tokens into our treasury
const amount = 1_000;
const description = 'should we mint an extra 1000 tokens to the treasury?';
//execution function so we execute the mintTo function to mint 1000 tokens
const executions = [
  toAddress: token.getAddress();
  nativeTokenValue: 0;
  transactionData: token.encoder.encode(
    'mintTo', [
      vote.getAddress(),
      ethers.utils.parseUnits(amount.toString(), 18),
    ]
  )
];
await vote.propose(description, executions);
*/