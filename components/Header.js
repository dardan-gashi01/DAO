//creating our navigation bar as a component

//importing our libraries and images needed
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import ethlogo from '../assets/eth.png'


//all of our stylings using tailwind CSS
const styles = {
    container:'flex w-screen bg-black px-[1.2rem] py-[1.5rem]',
    leftHeader:'',
    home:'text-white cursor-pointer',
    rightHeader:'flex items-center justify-end w-full',
    CenterHeader:'flex items-center justify-center w-full',
    HeaderItem:'text-white px-3 flex items-center cursor-pointer',
    connected:'bg-blue-500 text-white font-bold py-2 px-4 rounded-full',
    connect:'text-white hover:cursor',
    button:'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full',
}



const Header = () => {
    //this is the library to be able to use the button to connect to metamask and then retrieve the address connected
    const address = useAddress();
    const connectWithMetamask = useMetamask();

    return (

        <div className={styles.container}>
            <div className={styles.leftHeader}>
                {/* created the home page link with the CITY DAO title using the Link tag*/}
                <Link href='/'>
                    <div className={styles.home}>
                        CITY DAO
                    </div>
                </Link>
            </div>
            <div className={styles.CenterHeader}>
                {/* created the chat page so when the user clicks the Forum title then it sends 
                them to the page with the link tag*/}
                <Link href='/chat'>
                    <div className={styles.HeaderItem}>Forum</div>
                </Link>
                {/* same done with proposals*/}
                <Link href='/proposals'>
                    <div className={styles.HeaderItem}>Proposals</div>
                </Link>
            </div>
            <div className={styles.rightHeader}>
                {/* this is case handling so if there is a wallet connected them we display the address
                otherwise we have the button ready to connect*/}
                {address ? (
                    <div className={styles.connected}>
                        {/* display the address of the user onto the page*/}
                        {address.substring(0,8)}...
                        <Image src={ethlogo} width={15} height={20}/>
                    </div>
                ) : (
                    <div className={styles.connect}>
                        {/* button ready to click and if so calls the function connectWithMetamask 
                        to connect their wallet*/}
                        <button className={styles.button} onClick={connectWithMetamask}>
                            connectWallet
                        </button>
                    </div>     
                )}
            </div>
        </div>
    )
}
//exporting the header to use it as a component for our page
export default Header