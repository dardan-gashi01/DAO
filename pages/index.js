//components
import Header from '../components/Header'
import {useRouter} from 'next/router'
import { useAddress,useEditionDrop, useToken } from '@thirdweb-dev/react'
import {useState, useEffect, useMemo} from 'react'
import Image from 'next/image'
import Lizard from '../assets/lizard.png' 
import axios from 'axios'
import Coin from './Coin'




const styles = {
  wrapper:'w-screen h-screen flex flex-col',
  mainContainer:'',
  title:'',
  image:'',
  button:'',
  claimed:'',
  marketData:'',
}


export default function Home() {

  const editionDrop = useEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');

  const token = useToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  
  const [isClaiming,setIsClaiming] = useState(false);
  const address = useAddress();
  const [ClaimedNFT, setClaimedNFT] = useState(false);
  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')

  // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop?.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);

useEffect(() => {
  axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
  .then(res => {
    setCoins(res.data);
  }).catch(err => console.error(err))
}, []);

const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);
  
  //checking to see if the user owns at least one of the specials NFTS.
  useEffect(() => {
    if (!address) { 
      return;
    }
    const checkBalance = async () => {
      try{
        const balance = await editionDrop.balanceOf(address, 0);
        if(balance.gt(0)){
          setHasClaimedNFT(true);
        }else {
          setHasClaimedNFT(false);
        }
      }catch(err){
        console.error(err);
      }
    };
    checkBalance();
  },[address,editionDrop]);

  //mint function for when the button is pressed.
  const mint = async () => {
    try{
      setIsClaiming(true);
      await editionDrop.claim('0',1);
      console.log('minted')
      setHasClaimedNFT(true);
    }catch(err){
      setHasClaimedNFT(false);
      console.error('failed to mint', err);
    }finally{
      setIsClaiming(false);
    }
  };



                
  return (
    
    <div className={styles.wrapper}>
    {hasClaimedNFT && address ? (

      <div className={styles.claimed}>
        <Header />
        <div className={styles.page}>
          <div>
            <div>
              <h2>member List</h2>
              <table className={styles.card}>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{member.address.substring(0,8)}...</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.marketData}>
                {filteredCoins.map(coin => {
                  return (
                    <Coin key={coin.id} name={coin.name} image={coin.image} symbol={coin.symbol} volume={coin.market_cap} price={coin.current_price} priceChange={coin.price_change_percentage_24h}/>
                  )
                })}  
          </div>
        </div>
      </div>
    ):(
      <center>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.title}>
            {/*this is where we add our title*/}
            Welcome to the DAO to get started and join the DAO mint the NFT below
        </div>
        <div className={styles.image}>
            <Image src={Lizard} height={300} width={300}/>
        </div>
        <div className={styles.button}>
            <button disabled={isClaiming} onClick={mint}>
              {isClaiming ? 'minting...' : "mint NFT (0.2ETH)"}
            </button>
        </div>
      </div>
      </center>
    )}
    </div>
  )
}
