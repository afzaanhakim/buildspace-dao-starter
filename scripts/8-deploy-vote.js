import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const appModule = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "RecipeDao's Delicacy Proposal",

      votingTokenAddress: process.env.TOKEN_MODULE_ADDRESS, //LOCATION OF THE GOVERNANCE TOKEN

      proposalStartWaitTimeInSeconds: 0, //setting 0 as start time for members to start voting once proposal created

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      votingQuorumFraction: 0, //in a order for a propsoal to pass we need a minimum # of votes, I have just set it to 0 for time being and will change when app gets bigger

      //minimum # of tokens a user needs to be allowed to create a proposal
      minimumNumberOfTokensNeededToPropose: "0",
    });
    console.log( "✅ Successfully deployed vote module, address:",
    voteModule.address,)
  } catch (error) {
    console.log("Yikes, an error in deploying voting module", error);
  }
})();
