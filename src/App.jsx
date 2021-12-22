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

const tokenModule = sdk.getTokenModule("0x84D0D62c61fb1d06758C1bB238C0088f1aA20656");
const App = () => {
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({}); //state for holding token each member has in state
  const { connectWallet, address, error, provider } = useWeb3();
  const [memberAddresses, setMemberAddresses] = useState([]); //state for holding all member address

  console.log("address:", address, "provider:", provider, "error:", error);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }; //function to show a shortened address

  const signer = provider ? provider.getSigner() : undefined;

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
        18,
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
  }, [address]);

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
        console.log(
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
    return  (
      <div className="member-page">
        <h1>🍪RecipeDAO Foodie Lounge</h1>
        <p>Congratulations on being a foodie!</p>
        <div>
          <div>
            <h2>Foodie List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
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
        </div>
      </div>
    );;
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
