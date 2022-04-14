import React from 'react'
import {useRouter} from 'next/router'
import Header from '../components/Header.js'
import { useAddress, useEditionDrop, useToken, useVote} from '@thirdweb-dev/react'
import {useState, useEffect} from 'react'
import {AddressZero} from '@ethersproject/constants';



const styles = {
    wrapper:'text-white',
    container:'text-white',
}



const proposals = () => {

  const NFTDrop = useEditionDrop('0xd98f7cFB1C6ED3Db81D2ec6e7aE3A9C51844E60B');
  const token = useToken('0x6f9177d6937e619ECB05E5199b09F7840De19765');
  const vote = useVote('0xa92922B800a7734824d8B3036FDdE0eA59d5e337');
  const [ClaimedNFT, setClaimedNFT] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const address = useAddress();
  const propStates = ["Pending", "Active", "Cancelled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];


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

  


  useEffect(() => {
    if (!ClaimedNFT) {
      return;
    }

    const getProposals = async () => {
      try{
        const proposals = await vote.getAll();
        console.log(proposals);
        setProposals(proposals);
      }catch(err){
        console.error('cant get proposals', err);
      }
    };
    getProposals();
  }, [ClaimedNFT, vote]);

  useEffect(() => {
    if(!ClaimedNFT){
      return;
    }

    if(!proposals.length){
      return;
    }

    const checkIfUserVoted = async () => {
      try{
        const hasVoted = await vote.hasVoted(proposals[proposals.length -1 ].proposalId, address);
        setHasVoted(hasVoted);
      }catch(err){
        console.error(err);
      }
    };
    checkIfUserVoted();
  }, [ClaimedNFT, proposals, address, vote]);

  
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
  
  useEffect(() => {
    const checkStatus = async () => {
      try{

      }catch(err){
        console.log(err);
      }
    }
  })




  return (
    <div className={styles.wrapper}>
      {ClaimedNFT && address ? (
        <div className={styles.claimed}>
          <Header />
          <div className={styles.container}>
            <h2> Active proposals</h2>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                      
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div><p>Proposal Status: <strong>{propStates[proposal.state]}</strong></p></div>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      ): (
        <div className={styles.notClaimed}>
          <Header />
          you dont own the NFT to access this page
        </div>
      )}
    </div>
  )
}

export default proposals