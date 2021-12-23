import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS);

(async () => {
  try {
    console.log(
      "These roles exist right now",
      await tokenModule.getAllRoleMembers()
    );

    //revoke all roles that original wallet had over the ERC-20 contract
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "These are the new roles after revoking",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
  } catch (error) {
    console.log("an error in revoking minting role for owner address", error);
  }
})();
