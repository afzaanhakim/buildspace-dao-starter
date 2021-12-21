import { ethers } from "ethers";
import dotenv from "dotenv";
import sdk from "./1-initialize-sdk.js";
dotenv.config();

const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS,);
  //insert token module address from previous token deployment of KHANA

  (async () => {
    try {
      const amount = 1_000_000; //max # of tokens

      const convertedAmount = ethers.utils.parseUnits(amount.toString(), 18); // using ethers.util for converting amount to have 18 decimals (standard for ERC20 tokens)

      await tokenModule.mint(convertedAmount); //getting data fom deployed ERC-20 contract
      const totalSupply = await tokenModule.totalSupply(); //setting total supply as # of tokens out there

      console.log(
        "✅ There are",
        ethers.utils.formatUnits(totalSupply, 18),
        "$KHANA tokens in circulation"
      );
    } catch (error) {
      console.log("Yikes, an error in printing more $KHANA", error);
    }
  })();
