//main app page to link components

//all the imports
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/globals.css'

//making the chain ID rinkeby to be on the testnet if it was another chain we would change 
//for example ropsten or mainnet
const activeChainId = ChainId.Rinkeby;

//importing our thirdweb components and pages
function MyApp({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </React.StrictMode>
  )
}

export default MyApp
