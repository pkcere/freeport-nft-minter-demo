import { ethers } from 'ethers';
import { importProvider, getFreeportAddress, getContractAddress, createFreeport } from "@cere/freeport-sdk";
import { utilStr2ByteArr } from "./util";
const contractABI = require('./freeport-contract-abi.json')
const contractAddress = "0x4F908981A3CFdd440f7a3d114b06b1695DA8373b"; //freeport prod contract

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

//export const mintNFT = async (url, name, description, signer) => {
export const mintNFT = async (metadata, qty, signer) => {
  //error handling
  if (metadata.trim() == "" || (qty < 1)) {
    return {
      success: false,
      status: "Make sure all fields are completed before minting.",
    }
  }

  let freeportcontract = await new ethers.Contract(contractAddress, contractABI, signer);
  try {
    const txHash = await freeportcontract.issue(1, utilStr2ByteArr(metadata));
    return {
      success: true,
      //status: "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" + JSON.stringify(txHash)
      status: "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" + txHash.hash
      //status: signer.signMessage(txHash)
    }
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message
    }
  }
};

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const mintNftWebApp = async (quantity, strMetadata) => {
  if (strMetadata.trim() == "" || (quantity < 1)) {
    return {
      success: false,
      status: "Make sure all fields are completed before minting.",
    }
  }
  // e.g. "ethereum" object Metamask
  const provider = importProvider();
  //console.log(provider);

  // env is one of: "stage" or "prod"
  const env = "prod"; // or stage or dev. prod is default

  // Pick smart contract address based on the environment
  const contractAddress = await getFreeportAddress(provider, env);

  // SDK object
  const apiInput = { provider, contractAddress };
  const cereFreeport = createFreeport(apiInput);

  try {
    const tx = await cereFreeport.issue(quantity, utilStr2ByteArr(strMetadata));
    return {
      success: true,
      status: "✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/" + tx.hash
    }
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message
    }
  }
};