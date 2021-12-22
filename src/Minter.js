import { ethers } from "ethers";
import { React, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";
import { mintNftWebApp} from "./utils/interact.js"; 
import { upload2DDC, getUploadStatus } from "./utils/upload";
// No longer need mint.js

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
  
  // new variables
  const [metadata, setMetadata] = useState("");
  const [cid, setCid] = useState(null);

  // from Fp-Minter.jsx
  const [tx, setTx] = useState(null);
  const [qty, setQty] = useState(1);


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
    
    //const { status } = await mintNFT(url, name, description, tempSigner);
    const { status } = await mintNFT(metadata, qty, tempSigner);
    setStatus(status);
};

  // From Fp-Minter.jsx
  const submitMintTx = async () => {
    //const tx = await mintNftWebApp(+qty, metadata);
    //setTx(tx.hash);
  const { status } = await mintNftWebApp(+qty, metadata)
  setStatus(status);
  }

  const onUploadPress = async () => {
    let data = "blah blah";
    let title = "My asset";
    let description = "My asset's description"
    const uploadId = await upload2DDC(data, title, description);
    
    setStatus("Uploading asset to DDC... " + getUploadStatus(uploadId));
    while (getUploadStatus(uploadId) < 100) {
    //while (true) {
      //setStatus("Uploading asset to DDC... " + getUploadStatus(uploadId));
      //console.log(getUploadStatus(uploadId));
    }
    console.log(getUploadStatus(uploadId))
  }

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
        Draw your image below, add metadata, select a quantity, then press "Mint."
      </p>


        <CanvasDraw
            style={{
                boxShadow:
                "0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)"
            }}
        />

      <form>
        &nbsp;
        <h2> Metadata: </h2>
        <input
          type="text"
          placeholder=""
          onChange={(event) => setMetadata(event.target.value)}
        />
        <h2> Quantity: </h2>
        <input
          type="number"
          placeholder=""
          value={qty}
          onChange={(event) => setQty(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint with Ethers.js
      </button>      
      &nbsp;
      <button id="mintButton" onClick={submitMintTx}>
        Mint with Freeport SDK
      </button>
      &nbsp;
      <button id="mintButton" onClick={onUploadPress}>
        Upload to Cere DDC
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;