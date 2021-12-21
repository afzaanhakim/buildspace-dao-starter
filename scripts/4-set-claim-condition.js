import { ClaimConditionFactory } from "@3rdweb/sdk";
import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(process.env.DROP_MODULE_ADDRESS);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    claimConditionFactory.newClaimPhase({
      startTime: new Date(), //time users are allowed to start minting an nft
      maxQuantity: 50_000, //max number of nfts that can be minted
      maxQuantityPerTransaction: 1, //how many tokens can be claimed in a single transaction
    });
    await bundleDrop.setClaimCondition(0, claimConditionFactory); //this call interacts with deployed contract on-chain and adjusts the conditions 
    console.log("✅ Sucessfully set claim condition!",bundleDrop.address);
  } catch (error) {
    console.log("Yikes, an error...", error);
  }
})();
