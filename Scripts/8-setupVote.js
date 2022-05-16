import sdk from './1-SDK.js';

const vote = sdk.getVote("0xa92922B800a7734824d8B3036FDdE0eA59d5e337");

// This is our ERC-20 contract.
const token = sdk.getToken("0x6f9177d6937e619ECB05E5199b09F7840De19765");
//this also taken from https://portal.thirdweb.com/guides/build-treasury-and-governance-for-your-dao
//with slight small changes
(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 50% of the supply that we hold.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent50 = Number(ownedAmount) / 100 * 50;

    // Transfer 50% of the supply to our voting contract.
    await token.transfer(
      vote.getAddress(),
      percent50
    ); 

    console.log("Successfully transferred " + percent50 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();



