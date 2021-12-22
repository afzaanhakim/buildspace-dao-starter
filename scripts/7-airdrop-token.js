//Run this script when you have more members join in 

import { ethers } from "ethers";
import dotenv from 'dotenv';
import sdk from "./1-initialize-sdk.js";
dotenv.config();

const bundleDropModule = sdk.getBundleDropModule(process.env.DROP_MODULE_ADDRESS);

const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS);

(async () => {

  try {
    const walletAddress = await bundleDropModule.getAllClaimerAddresses("0"); //grabbing all wallet address of members

    if (walletAddress.length === 0) {
      console.log("NO NFTS HAVE BEEN CLAIMED YET, ask your friends to claim some NFT?")
      process.exit(0)
    };

    const airdropTargets = walletAddress.map((address) => {
      const randomAmountForAirdrop = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000); //picking a randomAmount of token to airdrop to each user 
      console.log("✅ Going to airdrop", randomAmountForAirdrop, "tokens to", address);


      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmountForAirdrop.toString(), 18)
      };
      return airdropTarget;
    })
    console.log("🍤🍤🍤Airdrop Starting in 3..2..1🍤🍤🍤");
    await tokenModule.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  }
  
  catch (error) {
    console.log("Yikes, an errror", error)
  }
}) ()