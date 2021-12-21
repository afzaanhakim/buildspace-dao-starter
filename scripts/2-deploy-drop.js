//creating and deploying an ERC-1155 contract to Rinkeby ---> setting up metadata for the NFT collection

//you can check the transaction on etherscan --> rinkeby.etherscan.io


//REMEMBER TO SAVE THE MODULE DROP ADDRESS THAT WILL BE CONSOLE LOGGED IN AN ENV VARIABLE

import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "RecipeDAO Membership", //the collection name
      description:
        "A DAO for members to share their favorite recipes and learn new recipes from all over the globe", //colection description
      image: readFileSync("scripts/assets/food.png"), //image for the collection to show on opensea
      primarySaleRecipientAddress: ethers.constants.AddressZero, // Passing in address of the person who will recieve the proceeds from the drop, I am using a 0x0 address since not charging for this drop. Set this to own wallet address if charging for the drop.
    });

    console.log(
      "successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );

    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy", error);
  }
})();
