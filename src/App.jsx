import React, { useEffect, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import dotenv from "dotenv";
dotenv.config();

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
 "0x1b036975f71f8b75D7D46bC32a87DE70115b190B"
);
const App = () => {
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { connectWallet, address, error, provider } = useWeb3();

  console.log("address:", address, "provider:", provider, "error:", error);

  const signer = provider ? provider.getSigner() : undefined;

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
