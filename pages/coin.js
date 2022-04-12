import React from 'react'

const styles = {
    coinContainer:'flex justify-center',
    coinRow:'flex flex-row items-center h-20',
    coin:'flex items-center pr-6',
    coinSymbol:'uppercase',
    coinData:'flex text-right justify-between w-full',
    coinPrice:'w-24',
    coinVolume:'w-40',
    coinRed:'text-red-700',
    coinGreen:'text-green-600',
    image:'h-8 w-8 mr-2',
}

const coin = ({image, name, symbol, price, volume, priceChange}) => {
  return (
    <div className={styles.coinContainer}>
        <div className={styles.coinRow}>
            <div className={styles.coin}>
                <img className={styles.image} src={image} alt="crypto"/>
                <h1>{name}</h1>
                <p className={styles.coinSymbol}>{symbol}</p>
            </div>
            <div className={styles.coinData}>
                <p className={styles.coinPrice}>${price}</p>
                <p className={styles.coinVolume}>Mkt Cap: ${volume.toLocaleString()}</p>
                {priceChange < 0 ? (
                    <p className={styles.coinRed}>{priceChange.toFixed(2)}%</p>
                ) : (
                    <p className={styles.coinGreen}>{priceChange.toFixed(2)}%</p>
                )}
                
            </div> 
        </div>
    </div>
  )
}

export default coin