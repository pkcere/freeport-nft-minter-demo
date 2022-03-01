import { useState, useEffect } from "react";
import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

import Attacher from "./Attacher";
import TokenSupply from "./Supply";
import TokenList from "./Lister";
import Transfer from "./Transfer";
import ChainSelector from "./ChainSelector";

const defaultChainConfig = {
  name: "polygon_testnet",
  chainId: "0x13881",
  descriptiveName: "Polygon Testnet"
};
const chainsById = {
    "0x13881": 'polygon_testnet',
    "0x61":    'bsc_testnet',
    "0xa869": 'avax_testnet',
};

export const chainDescriptiveName = {
    "0x13881": 'Polygon Testnet',
    "0x61":    'BSC Testnet',
    "0xa869": 'AVAX Testnet',
};

const config = {
    polygon_testnet: {
        freeport: "0xAD56017BAD84Fa4Eab489314C1e158C6adaca598",
        attachment: "0x1282fdeC36aC4aaf025059D69077d4450703eeD0",
        proxyServer: "https://ddc.freeport.dev.cere.network",
        apiServer: `https://api.freeport.dev.cere.network`,
        scanner: "https://mumbai.polygonscan.com/tx",
    },
    bsc_testnet: {
        freeport: "0x848A415f0da2aC5F1cAC0289319448b96127b163",
        attachment: "0xEee0b3D146C8FDCB5613904859bA2225a11C7b4A",
        proxyServer: "http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8192",
        apiServer: `http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8191`,
        scanner: "https://testnet.bscscan.com/tx",
    },
    avax_testnet: {
        freeport: "0x848A415f0da2aC5F1cAC0289319448b96127b163",
        attachment: "0xEee0b3D146C8FDCB5613904859bA2225a11C7b4A",
        proxyServer: "http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8292",
        apiServer: `http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8291`,
        scanner: "https://testnet.snowtrace.io/tx",
    },
}


const listOwnedUrl = (urlBase) => (wallet) => `${urlBase}/wallet/${wallet}/nfts/owned`;
const listMintedUrl = (urlBase) => (wallet) => `${urlBase}/wallet/${wallet}/nfts/minted`;

const downloadUrl = (urlBase) => (minter, cid) => `${urlBase}/assets/v1/${minter}/${cid}/content`;

function App() {
  const [chainConfig, setChainConfig] = useState(defaultChainConfig);
  const [sessionToken, setSessionToken] = useState(null);
  const chain = chainConfig.name;
  console.log("chainconfig", chainConfig);

  const freeportContractAddress = config[chain].freeport;
  const attachmentContractAddress = config[chain].attachment;

  const makeStatusUrl = (uploadId) =>
    `${config[chain].proxyServer}/assets/v1/${uploadId}`;
  const makeOwnedTokenListUrl = listOwnedUrl(config[chain].apiServer);
  const makeMintedTokenListUrl = listMintedUrl(config[chain].apiServer);
  const makeDownloadUrl = downloadUrl(config[chain].proxyServer);

  const uploadUrl = `${config[chain].proxyServer}`;
  const makeScanUrl = (tx) => `${config[chain].scanner}/${tx}`;

  const setChainId = (chainId) => {
    const newChainConfig = {
        name: chainsById[chainId],
        chainId,
        descriptiveName:  chainDescriptiveName[chainId]
      };
      setChainConfig(newChainConfig);
  };
  const updateChainId = async (chainId) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    setChainId(chainId);
  };

  const onConnect = (connection) => {
    console.log("connected", connection);
    setChainId(connection.chainId);
  };
  const onChainChange = (chainId) => {
    console.log("new chain", chainId);
    setChainId(chainId);
  };
  useEffect(() => {
    window.ethereum.on('connect', onConnect);
    window.ethereum.on("chainChanged", onChainChange);
    return () => {
      window.ethereum.removeListener('connect', onConnect);
      window.ethereum.removeListener("chainChanged", onChainChange);
    }
  });

  const onLogin = (token) => setSessionToken(token);

  return (
    <div className="App">
      <ChainSelector updateChainId={updateChainId} chainConfig={chainConfig}
        chainDescriptiveName={chainDescriptiveName}/>

      {/* <MetamaskLogin onLogin={onLogin}/> */}

      <DdcUploader chainConfig={chainConfig}
        uploadUrl={uploadUrl}  makeStatusUrl={makeStatusUrl}/>
      <FpMinter chainConfig={chainConfig} makeScanUrl={makeScanUrl} freeportContractAddress={freeportContractAddress}/>
      <TokenSupply chainConfig={chainConfig}
        freeportContractAddress={freeportContractAddress}/>
      <Attacher chainConfig={chainConfig} makeScanUrl={makeScanUrl}
        attachmentContractAddress={attachmentContractAddress}/>
      <DdcDownloader chainConfig={chainConfig}
        makeDownloadUrl={makeDownloadUrl}/>
      <TokenList chainConfig={chainConfig}
        makeOwnedTokenListUrl={makeOwnedTokenListUrl}
        makeMintedTokenListUrl={makeMintedTokenListUrl}
        />
      <Transfer chainConfig={chainConfig}  makeScanUrl={makeScanUrl}
        freeportContractAddress={freeportContractAddress}/>
      <hr/>
      <Minter></Minter>
    </div>
  );
}

/*

const MetamaskLogin = ({minter, onLogin, baseUrl}) => {
  const login = async () => {
    const nonce = await getNonce(minter, url);
    const jwt = await authorize(url, provider, minter, minterEncryptionKey, nonce);
    return onLogin(jwt);
  }
  return (
    <button onClick={login}> Login with Metamask </button>
  );
};


// Authorize
const authorize = async (baseUrl, provider, minter, encryptionPublicKey, nonce) => {
  const msgToSign = `${minter}${encryptionPublicKey}${nonce}`;
    const signature = await utilSign(provider, minter, msgToSign);
    const authUrl = `${baseUrl}/auth/v1/${minter}`;
    const result = await httpPost(authUrl, {encryptionPublicKey, signature});
    console.log("Auth result", result.data);
    const token = result.data.accessToken;
    return token;
};

const getPreviewUrl = async (baseUrl, minter, cid, jwt) => {
  const result = await httpGet(`${baseUrl}/assets/v2/${minter}/${cid}/preview`);
    console.log("Preview result", result);
  return result.data;
}
*/

export default App;