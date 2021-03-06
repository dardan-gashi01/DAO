import sdk from './1-SDK.js';

//governance contract deployed with small parameters changed (https://portal.thirdweb.com/guides/build-treasury-and-governance-for-your-dao)
(async () => {
    try{
        //deploying the contract with paramters as shown below
        const governanceAddress = await sdk.deployer.deployVote({
            name: 'CITY DAO',

            voting_token_address: '0x6f9177d6937e619ECB05E5199b09F7840De19765',

            voting_delay_in_blocks: 0,

            voting_period_in_blocks: 100,

            voting_quorum_fraction: 3,

            proposal_token_threshold: 0,
        });
        //getting the contract address to reused in our other files
        console.log('deployed governance contract', governanceAddress);
    }catch(err){
        console.error(err);
    }
})();



