import React, { useEffect, useState, useMemo } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x1b036975f71f8b75D7D46bC32a87DE70115b190B"
);

const tokenModule = sdk.getTokenModule(
  "0x84D0D62c61fb1d06758C1bB238C0088f1aA20656"
);

const voteModule = sdk.getVoteModule(
  "0x642e757644a8870A952f8e543d1dFFe22D31573A"
);
const App = () => {
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({}); //state for holding token each member has in state
  const { connectWallet, address, error, provider } = useWeb3();
  const [memberAddresses, setMemberAddresses] = useState([]); //state for holding all member address
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  console.log("address:", address, "provider:", provider, "error:", error);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }; //function to show a shortened address

  const signer = provider ? provider.getSigner() : undefined;

  //Get all existing propsals
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    voteModule
      .getAll()
      .then((proposals) => {
        setProposals(proposals);
        console.log("Proposals:", proposals);
      })
      .catch((error) => {
        console.log("failed to get proposals", error);
      });
  }, [hasClaimedNFT]);

  //check if user has already voted

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }
    // Check if the user has already voted on the first proposal.
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
        console.log("🥵 User has already voted with address", address);
      })
      .catch((error) => {
        console.log("failed to check if user has voted", error);
      });
  }, [hasClaimedNFT, proposals, address]);
  // Grab the users who hold our NFT with tokenId 0.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("member address", addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => console.log(err));
  }, [hasClaimedNFT]);

  //grabbing all balances
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    tokenModule
      .getAllHolderBalances()
      .then((balance) => {
        console.log("👜 Amounts", balance);
        setMemberTokenAmounts(balance);
      })
      .catch((err) => console.log("error", err));
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    // Check if the user has the NFT by using bundleDropModule.balanceOf function
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address, error]);

  if (error && error.name === "UnsupportedChainIdError") {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby 👻</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet. (Metamask). <br /> If you don't have metamask you can get it <a href="https://metamask.io/download" target="_blank" rel="noreferrer">here</a>.
        </p>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.log("Failed to claim", err);
        setIsClaiming(false);
      })
      .finally(() => {
        setIsClaiming(false); //setLoadingState
        setHasClaimedNFT(true); //setClaimed state
        //see their new NFT
        alert(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  };
  if (!address) {
    return (
      <div className="landing">
        <h1> 🍕 🍱 RecipeDAO 🍱 🍕 </h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          {" "}
          Click Me To Connect Wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>RecipeDAO Foodie Lounge</h1>
        <h3>🎊 Congratulations on becoming a foodie! 🎊</h3>
        <section className="official-token">
        <h2>Our official token is $KHANA.</h2> <br/>
        <p> There are total of 2,000,000 $KHANA in Supply.</p> <br></br><button className="khana"><a href="https://rinkeby.etherscan.io/token/0x84d0d62c61fb1d06758c1bb238c0088f1aa20656?a=0x642e757644a8870A952f8e543d1dFFe22D31573A" target="_blank" rel="noreferrer">Checkout $KHANA on Etherscan</a></button> 
        </section>
        <div>
          <div>
            <h2>Foodie List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>$KHANA Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2> Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
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
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
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
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
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
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mint-nft">
      <h3>Mint your free 🍱 RecipeDao 🍱 Membership NFT</h3>
      <button
        disabled={isClaiming}
        onClick={() => {
          mintNft();
        }}
      >
        {" "}
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}{" "}
      </button>
    </div>
  );
};

export default App;
