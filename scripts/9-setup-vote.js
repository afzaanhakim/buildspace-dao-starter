import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const voteModule = sdk.getVoteModule(process.env.VOTE_MODULE_ADDRESS);

const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS);

(async () => {
  try {
    await tokenModule.grantRole("minter", voteModule.address);
    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.log("YIKES, AN ERROR in granting vote module permissions", error);
    process.exit(1);
  }

  try {
    //grabbing token balance from creator of this treasury's address
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent95 = ownedAmount.div(100).mul(95);
    // Transfer 95% of the supply to our voting contract.
    await tokenModule.transfer(voteModule.address, percent95);
    console.log("✅ Successfully transferred tokens to vote module");
  } catch (error) {
    console.log("failed to transfer tokens to vote module", error);
  }
})();
