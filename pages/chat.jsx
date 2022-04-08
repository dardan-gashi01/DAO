import React from 'react'
import { useRouter} from 'next/router'
import Header from '../components/Header.js';
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/messages.json";
import MessageForm from './MessageForm.js';
import { useAddress, useEditionDrop} from '@thirdweb-dev/react'


const style = {
    wrapper:`relative `,
    claimed:``,
    notClaimed:`text-white`,
    sendMessage:`border border-[#f21111] bg-[#cf1d1d] p-[0.5rem] text-xl font-bold rounded-lg cursor-pointer hover:text-white`,
    messages:`rounded-md border-2 max-w-2xl my-2 bg-[#28282B] overflow-scroll max-h-96`,
    message:`rounded-md border-2 max-w-lg py-5 my-2 bg-[#7393B3]`,
    messageForm:`max-w-2xl`,
}


const chat = () => {
    const [ClaimedNFT, setClaimedNFT] = useState(false);
    const NFTDrop = useEditionDrop('0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7');
    const contractAddress = "0x22966a22C5Bb1362e40a100176e40D3650cb0C2c";
    const contractABI = abi.abi;
    const address = useAddress();

    

    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
      if (!address) { 
        return;
      }
      const checkBalance = async () => {
        try{
          const balance = await NFTDrop.balanceOf(address, 0);
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
    },[address,NFTDrop]);
  


const sendMessage2 = async (message) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const MessageContract = new ethers.Contract(contractAddress, contractABI, signer);
        const messageTxn = await MessageContract.messageUser(message);

        await messageTxn.wait();

        getAllMessages();
      }
    } catch (error) {
      console.error(error);
    }
}

const getAllMessages = async () => {
  try{
    const {ethereum} = window;

    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const MessageContract = new ethers.Contract(contractAddress, contractABI, signer);

      const messages = await MessageContract.getAllMessages();

      let messagesCleaned = [];
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

useEffect(() => {
  getAllMessages();
}, [])




  return (
    <div className={style.wrapper}>
    {ClaimedNFT && address ? (
        <div className={style.claimed}>
            <Header />
            <center>
            <div className={style.messages}>
            {allMessages.map((message, index) => {
              return (
                
                <div key={index} className={style.message}>
                  <div class="text-white">Address: {message.address}</div>
                  <div class="text-white">Message: {message.message}</div>
                </div>
                )
            })}
            </div>
            </center>
            <center>
            <div className={style.messageForm}>
            <MessageForm messageFunc={sendMessage2} />
            </div>
            </center>
        </div>
    ) : (
        <div className={style.notClaimed}>
            <Header />
            To Access the Chat page you need to be part of CityDAO by either minting the NFT or purchasing from secondary market
        </div>
    )}
    </div>
    )
}

export default chat
