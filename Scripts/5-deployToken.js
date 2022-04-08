import {AddressZero} from '@ethersproject/constants';
import sdk from './1-SDK.js';

(async () => {
    try{
        const tokenAdd = await sdk.deployer.deployToken({
            name: "CITY COIN",
            symbol:"CITY",
            primary_sale_recipient: AddressZero,
        });
        console.log('deploted token, address:', tokenAdd);
    }catch(err){
        console.error(err);
    }
})();