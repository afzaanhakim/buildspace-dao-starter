import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const voteModule = sdk.getVoteModule(process.env.VOTE_MODULE_ADDRESS);

const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS);

(async () => {
  try {
    const amount = 250_000; //proposal to mint 250_000 new tokens to treasury
    await voteModule.propose(
      "Should RecipeDAO mint an additional" + amount + "tokens to the treasury",
      [
        {
          //NATIVETOKEN VALUE IS IN ETH, it is the amount we want to send in tis proposal. I will be sending 0 in this case

          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a mint! And, we're minting to the voteModule, which is
            // acting as our treasruy.
            "mint",
            [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.log("could not create proposal", error);
    process.exit(1);
  }

  try {
    const amount = 7_000;

    await voteModule.propose(
      "Should the DAO transfer " +
        amount +
        "tokens from the treasury to " +
        process.env.WALLET_ADDRESS +
        " for building this awesome DAO?",
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );

  } catch (error) {
    console.log("yikes an error in the proposal to reward the creator's wallet address", error);
  }
})();
