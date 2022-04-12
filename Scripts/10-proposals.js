import sdk from './1-SDK.js';
import {ethers} from 'ethers';

const vote = sdk.getVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');

const token = sdk.getToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');

(async () => {
    try{
        const amount = 100_000;
        const description = 'should we mint an extra 50,000 tokens into the treasury?';
        const executions = [
            {
                toAddress: token.getAddress(),

                nativeTokenValue: 0,

                transactionData: token.encoder.encode(
                    'mintTo', [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        await vote.propose(description, executions);

        console.log('created proposals to mint tokens');

    }catch(err){
        console.error(err);
        process.exit(1);
    }
})();