import sdk from "./1-initialize-sdk.js";
import dotenv from 'dotenv';
dotenv.config();

const app = sdk.getAppModule(process.env.APP_ADDRESS); //INSERT APP ADDRESS

(async () => { //deploying a standard ERC-20 token contract
  try {
    const tokenModule = await app.deployTokenModule({ //calling deployToken Module to deploy RecipeDAO token
      name: "RecipeDAO Governance Token", //token name
      symbol: "KHANA" //token symbol 
    });
    console.log( "✅ Successfully deployed token module, address:",
    tokenModule.address,)
  }
  catch(error) {
    console.log("Yikes, an error in deploying token module", error)
  }
})()