//proposals page 
//all the imports needed
import React from 'react'
import {useRouter} from 'next/router'
import Header from '../components/Header.js'
import { useAddress, useEditionDrop, useToken, useVote} from '@thirdweb-dev/react'
import {useState, useEffect} from 'react'
import {AddressZero} from '@ethersproject/constants';


//all the stylings in tailwind CSS
const styles = {
    wrapper:'text-white',
    container:'text-white',
    proposal:'my-10',
    button:'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-1 rounded-full w-32',
}



const proposals = () => {
  //storing all the vairables and states we will be needing to create the page
  const NFTDrop = useEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
  const token = useToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');
  const vote = useVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');
  const [ClaimedNFT, setClaimedNFT] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const address = useAddress();
  const propStates = ["Pending", "Active", "Cancelled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];

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



  //this script gets all proposals and stores them in the setProposals state list
  useEffect(() => {
    if (!ClaimedNFT) {
      return;
    }

    const getProposals = async () => {
      try{
        //we use the getAll function to get all the proposals
        const proposals = await vote.getAll();
        //console.log(proposals);
        setProposals(proposals);
      }catch(err){
        console.error('cant get proposals', err);
      }
    };
    //calling the function to get them all
    getProposals();
  }, [ClaimedNFT, vote]);

  //checking if the user has voted on the proposals
  useEffect(() => {
    if(!ClaimedNFT){
      return;
    }

    if(!proposals.length){
      return;
    }
  
    
    const checkIfUserVoted = async () => {
      try{
        //so we are checking if the user has voted on the most previous proposal and passing 
        //the most recent index along with the address of the user to check this
        const hasVoted = await vote.hasVoted(proposals[proposals.length -1 ].proposalId, address);
        //then setting the answer as the setHasVoted state
        setHasVoted(hasVoted);
      }catch(err){
        console.error(err);
      }
    };
    checkIfUserVoted();
  }, [ClaimedNFT, proposals, address, vote]);

  //this gets the total votes on the proposals
  useEffect(() => {
    const checkVotes = async () => {
      try{
        const votes = await vote.getProposalVotes(0);
        //console.log("numer of votes are: ", votes);
      }catch(err){
        console.error(err);
      }
    };
    checkVotes();
  },[vote]);

  return (
    <div className={styles.wrapper}>
      {/* case handling to see if the user owns the NFT if so it shows them something different compared to the non members*/}
      {ClaimedNFT && address ? (
        <div className={styles.claimed}>
          <Header />
          <center>
          <div className={styles.container}>
            <h2 class='text-4xl font-bold mb-2 text-white my-2'> Proposals</h2>
            
            {/* this is the form that the user will vote with https://docs.thirdweb.com/typescript/sdk.vote*/}
            <form class=''
              onSubmit={async (event) => {
                event.preventDefault();
                event.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);
                
                // This is where we can vote. This section calls the voting of the application
                // Here we get all of our proposals by mapping through the key of proposals
                //the main reason we do this is to get the ProposalsID as this is needed to be able to vote on proposals
                //https://portal.thirdweb.com/typescript/sdk.Vote.vote in the documentation it states the first 
                //parameter is ProposalID as shown in the link above and the second one is the vote.type
                //therefore we had to extract this from the proposals section of our form
                const votes = proposals.map((proposal) => {
                  //here we are setting the default vote as abstain if they do not check anything for the proposalsID we are mapping
                  const outcome = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  //looping through the votes we selected and storing them as the element so we can call it when we 
                  //execute vote.vote(ProposalID, vote.type)
                  proposal.votes.forEach((vote) => {
                    const elemement = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );
                    //this is taking what we have voted for so if the specific element has been selected 
                    //either for, against or abstain and making sure its been selected
                    if (elemement.checked) {
                      //setting the .type so we can use as our second parameter in the code below
                      outcome.vote = vote.type;
                      return;
                    }
                  });
                  return outcome;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  let delegatedTokens = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their tokens yet
                  if (delegatedTokens === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    //this calls metamask to delegate
                    await token.delegateTo(address);
                  }
                  // then we need to vote on or execute the previous proposals if needed
                  try {
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        let proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          //https://portal.thirdweb.com/typescript/sdk.Vote.vote
                          return vote.vote(proposalId, _vote);
                        }
                      })
                    //we set our status to has voted so we know the user has in fact voted already so they cant anymore
                    setHasVoted(true);
                  } catch (error) {
                    console.log(error);
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  // in either case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {/* displaying the proposals on the page with HTML and CSS*/}
              {proposals.map((proposal) => (
                //the description of the proposal
                <div key={proposal.proposalId} class='bg-[#107896] p-4 rounded-lg text-white my-2 max-w-2xl'>
                  {/* showing the description of the proposals*/}
                  <h5>{proposal.description}</h5>
                  {/* showing the status of the proposal*/}
                  <div><p>Proposal Status: <strong>{propStates[proposal.state]}</strong></p></div>
                  <div>
                    {/* laying out the voting buttons that we can click to vote on for, against or abstain*/}
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* creating the button to submit the votes and it wont let us vote again if we have already*/}
              <button className={styles.button} disabled={isVoting || hasVoted} type="submit">
              {isVoting && "Voting"}
              { hasVoted ? 'Voted' : 'Submit Votes'}
              </button>
            </form>
            
          </div>
          </center>
        </div>
      ): (
        /* this is for non members*/
        <div className={styles.notClaimed}>
          <Header />
          To Access the Chat page you need to be part of CityDAO by either minting the NFT or purchasing from secondary market
        </div>
      )}
    </div>
  )
}

export default proposals



     
