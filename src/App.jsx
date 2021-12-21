import React, { useEffect, useState} from 'react';

import { useWeb3 } from '@3rdweb/hooks';

const App = () => {

  const { connectWallet, address, error, provider} = useWeb3();

  console.log("address:", address, "provider:", provider, "error:",  error)
  
  if (!address) {
    return (
      <div className="landing">
      <h1> 🍕 🍱 RecipeDAO 🍱 🍕 </h1>
      <button onClick={() => connectWallet("injected")} className="btn-hero"> Click Me To Connect Wallet</button>
    </div>
    )
  }
  
  return (
    <div className="landing">
      
      <h3>✅ ✅ You are Connected to RecipeDao with address:</h3>
      <a> {address}</a>
    </div>
  );
};

export default App;
