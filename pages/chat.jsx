//chat/forum page
//all the imports we need
import React from 'react'
import { useRouter} from 'next/router'
import Header from '../components/Header.js';
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/messages.json";
import MessageForm from './MessageForm.js';
import { useAddress, useEditionDrop} from '@thirdweb-dev/react'

//all of our tailwind CSS styling
const styles = {
    wrapper:`relative `,
    claimed:``,
    notClaimed:`text-white`,
    sendMessage:`border border-[#f21111] bg-[#cf1d1d] p-[0.5rem] text-xl font-bold rounded-lg cursor-pointer hover:text-white`,
    messages:`col-span-2`,
    message:`rounded-md border-2 max-w-lg py-5 my-2 bg-[#107896]`,
    messageForm:`max-w-2xl`,
    users:'text-white',
    container:'grid grid-cols-3 my-4',
    messagebox:'rounded-md border-2 max-w-2xl my-2 bg-[#28282B] overflow-scroll max-h-96',
    table:'table-auto',
}


const chat = () => {
    //setting our variables to be able to use them to get the page running
    const [ClaimedNFT, setClaimedNFT] = useState(false);
    const NFTDrop = useEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
    const contractAddress = "0x22966a22C5Bb1362e40a100176e40D3650cb0C2c";
    //const editionDrop = useEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
    const contractABI = abi.abi;
    const address = useAddress();

    

    const [allMessages, setAllMessages] = useState([]);
    const [memberAddresses, setMemberAddresses] = useState([]);
    

    //this function checks the owenership of the nft so it sets it to either claimed or not claimed depending 
    //on whats inside the wallet
    useEffect(() => {
      if (!address) { 
        return;
      }
      const ifMember = async () => {
        try{
          let owned = await NFTDrop.balanceOf(address, 0);
          if(owned.gt(0)){
            setClaimedNFT(true);
          }else {
            setClaimedNFT(false);
          }
        }catch(err){
          console.error(err);
        }
      };
      ifMember();
    },[address,NFTDrop]);
  

//function to send the message that takes the actual message argument inside as a parameter
const sendMessage2 = async (message) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //getting the signer which is the sender for the message so that we can execute the transaction
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //retreiving the contract we created using the address, ABI(JSON FILE) and the signer
        const MessageContract = new ethers.Contract(contractAddress, contractABI, signer);
        //calling the message user function in the contract and passing the message variable which holds the message
        const messageTxn = await MessageContract.messageUser(message);
        //waiting for the transaction to be finished
        await messageTxn.wait();
        //refresh the page so that we can get the most recent messages
        getAllMessages();
      }
    } catch (error) {
      console.error(error);
    }
}

//function to retrieve all messages so that we can display the messages
const getAllMessages = async () => {
  try{
    const {ethereum} = window;

    if(ethereum) {
      //retrieving the signer again
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      //retrieving the contract again
      const MessageContract = new ethers.Contract(contractAddress, contractABI, signer);

      //calling the function in the contract called getAllMessages to retrieve the whole list of messages we defined in it
      const messages = await MessageContract.getAllMessages();
      
      //creating a new array so that we can store the messages in a nicer way that we can use to display
      let messagesCleaned = [];
      //looping every message and storing the details int it as an object
      messages.forEach(message => {
        messagesCleaned.push({
          address: message.messager,
          timestamp: new Date(message.timestamp * 1000),
          message: message.message
        });
      });

      setAllMessages(messagesCleaned);
    }
  }catch (err){
    console.error(err);
  }
}

//running a script everytime the page is loaded to get all the messages so that we can dispaly them
useEffect(() => {
  getAllMessages();
}, [])

//getting all holders of the NFT so that we can display the members so people know the current people that have access to the page
useEffect(() => {
  if (!ClaimedNFT) {
    return;
  }
  
  const getAllAddresses = async () => {
    try {
      //getting all the claimers of the NFT with id 0 because all of them are ID 0 because it is an erc1155 token
      const memberAddresses = await NFTDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }
  
  };
  //callinf the funciton
  getAllAddresses();
}, [ClaimedNFT, NFTDrop?.history]);

//setting the memberslist from above to their addresses
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
    }
  });
}, [memberAddresses]);
  


  return (
    <div className={styles.wrapper}>
    {/* case handling so if the user is connected to the website and has claimed the NFT so is a member it 
    displays the page below*/}
    {ClaimedNFT && address ? (
        <div className={styles.claimed}>
          {/* using the Header component*/}
            <Header />
            <div className={styles.container}>
              <div className={styles.messages}>
                <center>
                <div className={styles.messagebox}>
                {/* displaying all the messages in order*/}
                {allMessages.map((message, index) => {
                  return (
                    <center>
                    <div key={index} className={styles.message}>
                      {/* displaying the address of sender and the actual message*/}
                      <div class="text-white">Address: {message.address}</div>
                      <div class="text-white">Message: {message.message}</div>
                    </div>
                    </center>
                  )
                 })}
                 </div>
                <div className={styles.messageForm}>
                  {/* calling our message function and using the message form we created in messageform.js*/}
                  <MessageForm messageFunc={sendMessage2} />
                </div>
                </center>
              </div>
              <div className={styles.users}>
                {/* displaying members in a table*/}
                <table className={styles.table}>
                <thead>
                  <tr>
                    <th class='border border-slate-600'>Members</th>
                  </tr>
                </thead>
                <tbody>
                {/* mapping the members into the table and displaying their first 8 characters*/}
                {memberList.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td class='border border-slate-600'>{member.address}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
            
        </div>
        /* if the user does not own the membership nft then we display the message below*/
    ) : (
        <div className={styles.notClaimed}>
            <Header />
            To Access the Chat page you need to be part of CityDAO by either minting the NFT or purchasing from secondary market
        </div>
    )}
    </div>
    )
}

export default chat


            