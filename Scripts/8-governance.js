import sdk from './1-SDK.js';

(async () => {
    try{
        const governanceAddress = await sdk.deployer.deployVote({
            name: 'CITY DAO',

            voting_token_address: '0x6f9177d6937e619ECB05E5199b09F7840De19765',

            voting_delay_in_blocks: 0,

            voting_period_in_blocks: 100,

            voting_quorum_fraction: 0,

            proposal_token_threshold: 0,
        });
        console.log('deployed governance contract', governanceAddress);
    }catch(err){
        console.error(err);
    }
})();