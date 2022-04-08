import sdk from './1-SDK.js';

(async () => {
    try{
        const governanceAddress = await sdk.deployer.deployVote({
            name: 'CITY DAO',

            voting_token_address: '0x5C69a8e7B51f035c9b09D8729A3C74795A517F03',

            voting_delay_in_blocks: 0,

            voting_period_in_blocks: 6570,

            voting_quorum_fraction: 0,

            proposal_token_threshold: 0,
        });
        console.log('deployed governance contract', governanceAddress);
    }catch(err){
        console.error(err);
    }
})();