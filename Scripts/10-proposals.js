import sdk from './1-SDK.js';
import {ethers} from 'ethers';

const vote = sdk.getVote('0x54000321f966e0469367415436594De58e3BC304');

const token = sdk.getToken('0x5C69a8e7B51f035c9b09D8729A3C74795A517F03');

(async () => {
    try{
        const amount = 100_000;
        const description = 'should we mint an extra 100,000 tokens into the treasury?';
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