//creating the part of the dashboard that shows the crypto coins daily prices and changes
import React from 'react'

//coin method that sets the parameters in our table that we will be displayed on our home page
const coin = ({image, name, symbol, price, volume, priceChange}) => {
  return (
    /*setting the parameters taken above and put into their places we want for when we use the table in the index.js*/
    <center>
    <div class='grid grid-cols-6 max-w-4xl border'>
    <center><div><img class = 'h-8 w-8 mr-2' src={image} alt="crypto"/></div></center>
    <center><div class='w-2'>{name}</div></center>
    <center><div class='uppercase ml-2'>{symbol}</div></center>
    <center><div class='w-2'>${price}</div></center>
    <center><div class='w-2'>${volume.toLocaleString()}</div></center>
    <center><div class='w-2'>{priceChange < 0 ? (
                    <p class='text-red-700'>{priceChange.toFixed(2)}%</p>
                ) : (
                    <p class='text-green-600'>{priceChange.toFixed(2)}%</p>
                )}
        </div></center>
    </div>
    </center>
  )
}
//exporting it so we can use it in our index page
export default coin

