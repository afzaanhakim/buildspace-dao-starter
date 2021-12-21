import sdk from "./1-initialize-sdk.js";
import {  readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(process.env.DROP_MODULE_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([ //setting up an actual NFT on ERC-1155 
      {
        name: "Eat Everything!", //name of the nft
        description: "This NFT will give you access to RecipeDao!", //description
        image: readFileSync("scripts/assets/RecipeDao.png"), //nft image --> since it is an ERC -1155 all members will mint the same NFT
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!"); 
  } catch (error) {
    console.log("Yikes, an error", error); 
  }
})();
