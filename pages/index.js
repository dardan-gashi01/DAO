//components
import Header from '../components/Header'
import {useRouter} from 'next/router'
import { useAddress,useEditionDrop, useToken } from '@thirdweb-dev/react'
import {useState, useEffect, useMemo} from 'react'
import Image from 'next/image'
import Lizard from '../assets/lizard.png' 



const styles = {
  wrapper:'w-screen h-screen flex flex-col',
  mainContainer:'',
  title:'text-white',
  image:'text-white',
  button:'text-white',
  claimed:'text-white',
}


export default function Home() {

  const editionDrop = useEditionDrop('0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7');
  console.log("editionDrop",editionDrop);

  const token = useToken('0x5C69a8e7B51f035c9b09D8729A3C74795A517F03');
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  
  const [isClaiming,setIsClaiming] = useState(false);
  const address = useAddress();
  const [ClaimedNFT, setClaimedNFT] = useState(false);

  // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing. 
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

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
      console.log("🚀 Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);

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
          setClaimedNFT(true);
        }else {
          setClaimedNFT(false);
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
    {ClaimedNFT && address ? (

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
