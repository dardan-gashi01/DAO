import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import ethlogo from '../assets/eth.png'


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
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    return (
        <div className={styles.container}>
            <div className={styles.leftHeader}>
                <Link href='/'>
                    <div className={styles.home}>
                        CITY DAO
                    </div>
                </Link>
            </div>
            <div className={styles.CenterHeader}>
                <Link href='/chat'>
                    <div className={styles.HeaderItem}>Chat</div>
                </Link>
                <Link href='/proposals'>
                    <div className={styles.HeaderItem}>Proposals</div>
                </Link>
            </div>
            <div className={styles.rightHeader}>
                {address ? (
                    <div className={styles.connected}>
                        {address.substring(0,8)}...
                        <Image src={ethlogo} width={15} height={20}/>
                    </div>
                ) : (
                    <div className={styles.connect}>
                        <button className={styles.button} onClick={connectWithMetamask}>
                            connectWallet
                        </button>
                    </div>     
                )}
            </div>
        </div>
    )
}

export default Header