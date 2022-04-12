import sdk from './1-SDK.js';

const token = sdk.getToken('0x31a02fC56C1862e7A5Df8Ef2BdC5f676223CC86E');

(async () => {
    try{
        const Roles = await token.roles.getAll();

        console.log('roles that exist:' ,Roles);

        //await token.roles.setAll({admin: ['0x54000321f966e0469367415436594De58e3BC304'], minter: ['0x54000321f966e0469367415436594De58e3BC304'], transfer:['0x54000321f966e0469367415436594De58e3BC304','0x0000000000000000000000000000000000000000']});
        //console.log('roles after revoking admin powers', await token.roles.getAll());
        console.log('revoked all rights from token contract except the DAO');
    }catch(err){
        console.error(err);
    }
})();