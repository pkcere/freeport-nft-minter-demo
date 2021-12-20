// Dependencies
// npm install ethers
// npm install react-canvas-draw --save

import { ethers } from "ethers";
import { React, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [freeport, setFreeport] = useState(null);

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setStatus("Write a message in the text-field above.");
      } else {
        setWalletAddress("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}

  useEffect(async () => {
      const {address, status} = await getCurrentWalletConnected();
      setWalletAddress(address)
      setStatus(status); 
      addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWalletAddress(walletResponse.address);
  };

const onMintPressed = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    setProvider(tempProvider);
    setSigner(tempSigner);
    
    const { status } = await mintNFT(url, name, description, tempSigner);
    setStatus(status);
};

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Freeport NFT-minter demo</h1>
      <p>
        Draw your image below, give it a name, a description, then press "Mint."
      </p>


        <CanvasDraw
            style={{
                boxShadow:
                "0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)"
            }}
        />

      <form>
        <h2>Or link to asset (for now): </h2>
        <input
          type="text"
          placeholder=""
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>Name: </h2>
        <input
          type="text"
          placeholder=""
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description: </h2>
        <input
          type="text"
          placeholder=""
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;