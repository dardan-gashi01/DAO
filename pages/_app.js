import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/globals.css'

const activeChainId = ChainId.Rinkeby;


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
