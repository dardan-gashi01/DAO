//Home page so the user can either mint if not member. or can see some statistics if they are

//importing the things we need
import Header from '../components/Header'
import {useRouter} from 'next/router'
import { useAddress,useEditionDrop, useToken } from '@thirdweb-dev/react'
import {useState, useEffect, useMemo} from 'react'
import Image from 'next/image'
import Lizard from '../assets/lizard.png' 
import axios from 'axios'
import Coin from './Coin'
import NFT from '../assets/NFT.png'
import forum from '../assets/forum.png'
import vote from '../assets/vote.png'



//styling of the page using tailwind CSS
const styles = {
  wrapper:'w-screen h-screen flex flex-col text-white',
  mainContainer:'text-white',
  title:'text-4xl font-bold mb-2 text-white mb-20',
  image:'my-5',
  button:'bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-1 rounded-full w-64 ',
  claimed:'text-white',
  marketData:'text-white my-5',
  about:'mb-20 text-2xl font-bold text-white',
  des1:'mr-96',
  des2:'ml-96',
  des3:'mr-96',
  box:'rounded-md border-2 max-w-2xl my-2 bg-[#28282B] mb-20',
  table:'table-auto border my-5',
  lizard:'my-5',
}


export default function Home() {
  //setting our variables and states to use
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
      //grad tokens using the getAllHolderBalances
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);



//get the API from coingeko to display price data
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

//our webpage HTML and CSS          
  return (
    //this is for the page that the user owns the NFT
    <div className={styles.wrapper}>
    {/*error handling to make sure that the user can  only access this page if they own the nft*/}
    {hasClaimedNFT && address ? (

      <div className={styles.claimed}>
        <Header />
        <div className={styles.page}>
          <center>
          <div className={styles.holders}>
            <div>
              {/* display the token holders along with the number of coins they hold*/}
              <h2 class='text-4xl font-bold mb-2 text-white'>Top CITY Coin holders</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th class='border border-slate-600'>Address</th>
                    <th class='border border-slate-600'>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td class='border border-slate-600'>{member.address.substring(0,8)}...</td>
                        <td class='border border-slate-600'>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </center>
          {/* call the Coin compoment to display all of the crypto prices*/}
          <div className={styles.marketData}>
            <center><h2 class='text-4xl font-bold mb-2 text-white'>Market Data for Today</h2></center>
            <center>
            <div class='grid grid-cols-6 border max-w-4xl'>
              <div>Logo</div>
              <div>Name</div>
              <div>Symbol</div>
              <div>Price(USD)</div>
              <div>Market Cap</div>
              <div>24H</div>
            </div>
            </center>
            {/*calling the Coin we imported from Coin.js and inserted the parameters from the API*/}
                {filteredCoins.map(coin => {
                  return (
                    <Coin key={coin.id} name={coin.name} image={coin.image} symbol={coin.symbol} volume={coin.market_cap} price={coin.current_price} priceChange={coin.price_change_percentage_24h}/>
                  )
                })}  
          </div>
        </div>
      </div>
    ):(
      /* if the user doesnt own the NFT we display this page to mint it*/
      <center>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.title}>
            {/*this is where we add our title*/}
            <h1>Welcome to CITY DAO</h1>
        </div>
        {/* displaying the benefits of holding so just some information*/}
        <div className={styles.about}>What does being part of the CITY DAO give you?</div>

        <div className={styles.des1}>
          <Image src={NFT} height={150} width={200}/>
          <div className={styles.box}>
            <div className={styles.info}>
              Access to a special membership NFT to allow you to use the website and interact with the other pages along with this you will also be getting an airdrop of CITY COIN every day to help you to vote or to convert for Ethereum
            </div>
          </div>
        </div>
        
        <div className={styles.des2}>
          <Image src={forum} height={150} width={200}/>
          <div className={styles.box}>
            <div className={styles.info}>
              Access to to a special community forum for holders only where all messages are on the blockchain and you can have amazing community conversations all decentralised and with the other fellow people that are like you
            </div>
          </div>
        </div>

        <div className={styles.des3}>
          <Image src={vote} height={150} width={200}/>
          <div className={styles.box}>
            <div className={styles.info}>
              Access to voting on proposals as a group of people, only open to holders of the membership NFT and to make votes to benefit the community all doen fairly where the weight of your vote is determined to how long you hold the NFT so loyal members are rewarded
            </div>
          </div>
        </div>
        <div className={styles.lizard}>
            <Image src={Lizard} height={300} width={300}/>
        </div>
        {/* Then the minting the NFT button which called the mint function when clicked and claims the NFT using 
        metamask*/}
        <div className={styles.button}>
            <button disabled={isClaiming} onClick={mint}>
              {isClaiming ? 'minting NFT...' : "mint NFT Cost:0.1ETH"}
            </button>
        </div>
      </div>
      </center>
    )}
    </div>
  )
}
