//getting the imports to use for the SDK
//most of this is not my code and I used the website to get started for this file
//https://docs.thirdweb.com/typescript
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from 'ethers';

//importing dotenv to be able to get my hidden information such as private key(dont share with anyone) and API URLS
import dotenv from 'dotenv';
dotenv.config();

//created the variable sdk to be able to use this in our other scripts so we can deploy to the testnet
const sdk = new ThirdwebSDK(
    //creating our wallet with out private key and API URL
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        //this is the RPC URL, so we can deploy on the testner. we chose the rinkeby testnet
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

//this function is just so we can see whats happening whilst getting this ready with a try and catch
(async () => {
    try {
      //defining the address so we can allow our address to deploy the scripts we will be making
      const address = await sdk.getSigner().getAddress();
      console.log("SDK created, address:", address)
    } catch (err) {
      //displaying the error if needed to debug
      console.error(err);
      process.exit(1);
    }
  })();
//export the sdk so that we can use it in the other scripts
export default sdk;