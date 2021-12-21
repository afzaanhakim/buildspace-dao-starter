import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

const supportedChainIds = [4]; //rinkeby chainid since  run this on ethereum rinkeby network //check all ids here https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/

//metamask is an injected wallet and we will only support metamask

const connectors = { injected: {} };
// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <div className="landing">
        <App />
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
