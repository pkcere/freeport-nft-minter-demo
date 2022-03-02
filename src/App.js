import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useEffect, useContext } from "react";
import { get as httpGet, post as httpPost } from "axios";
import LocalStorage from "local-storage";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion'
import AccordionContext from 'react-bootstrap/AccordionContext'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { importProvider, } from "@cere/freeport-sdk";
import {
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
    utilGetEncPubKey,
    utilSign,
} from "./utils/util";
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
  const [minter, setMinter] = useState(null);
  const [minterEncryptionKey, setMinterEncryptionKey] = useState(null);
  const [provider, setProvider] = useState(null);

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

  // read from local storage
  useEffect(() => {
    
    const minter = LocalStorage.get('minter');
    const minterEncryptionKey = LocalStorage.get('minterEncryptionKey');
    const sessionToken = LocalStorage.get('sessionToken');

    setMinter(minter);
    setMinterEncryptionKey(minterEncryptionKey);
    setSessionToken(sessionToken);
  })

  const logout = () => {
    setMinter(null);
    setMinterEncryptionKey(null);
    setProvider(null);
    setSessionToken(null);
    LocalStorage.set('minter', null);
    LocalStorage.set('minterEncryptionKey', null);
    LocalStorage.set('sessionToken', null);
  }

  const login = async () => {
    const provider = importProvider();
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);
    const minterEncryptionKey = await utilGetEncPubKey(ethereum, accounts);

    const url = config[chain].proxyServer;

    const nonce = await getNonce(minter, url);
    const sessionToken = await authorize(url, provider, minter, minterEncryptionKey, nonce);

    LocalStorage.set('minter', minter);
    LocalStorage.set('minterEncryptionKey', minterEncryptionKey);
    LocalStorage.set('sessionToken', sessionToken);

    setMinter(minter);
    setMinterEncryptionKey(minterEncryptionKey);
    setProvider(provider);
    setSessionToken(sessionToken);
  };


  return (
    <div className="App">
      <ChainSelector updateChainId={updateChainId} chainConfig={chainConfig}
        chainDescriptiveName={chainDescriptiveName}/>

      { sessionToken ? 
        <Stack gap={3}>
          <MetamaskLogout address={minter} logout={logout}/>
          <Accordion defaultActiveKey="0">
            <Section index="0" title="Upload">
              <DdcUploader chainConfig={chainConfig}
                sessionToken={sessionToken}
                minter={minter} minterEncryptionKey={minterEncryptionKey}
                uploadUrl={uploadUrl}  makeStatusUrl={makeStatusUrl}/>
            </Section>
            <Section index="1" title="Minter">
              <FpMinter chainConfig={chainConfig} makeScanUrl={makeScanUrl} freeportContractAddress={freeportContractAddress}/>
            </Section>
            <Section index="2" title="Supply">
              <TokenSupply chainConfig={chainConfig}
                freeportContractAddress={freeportContractAddress}/>
            </Section>
            <Section index="3" title="Attach">
              <Attacher chainConfig={chainConfig} makeScanUrl={makeScanUrl}
                attachmentContractAddress={attachmentContractAddress}/>
            </Section>
            <Section index="4" title="Download">
              <DdcDownloader chainConfig={chainConfig}
                makeDownloadUrl={makeDownloadUrl}/>
            </Section>
            <Section index="5" title="My Tokens">
              <TokenList chainConfig={chainConfig}
                makeOwnedTokenListUrl={makeOwnedTokenListUrl}
                makeMintedTokenListUrl={makeMintedTokenListUrl}
              />
            </Section>
            <Section index="6" title="Transfer">
              <Transfer chainConfig={chainConfig}  makeScanUrl={makeScanUrl}
                freeportContractAddress={freeportContractAddress}/>
            </Section>
          </Accordion>
        </Stack>
        : 
        <div>
            <MetamaskLogin url={config[chain].proxyServer} login={login}/>
        </div>
      }

    </div>
  );
}


const Section = ({title, index, children}) => (
    <Card>
      <Card.Header>
        <ContextAwareToggle eventKey={index}>{title}</ContextAwareToggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>{children}</Card.Body>
      </Accordion.Collapse>
    </Card>
);

const MetamaskLogout = ({logout, address}) => (
    <div>
      <Button variant="primary" onClick={logout}> Logout </Button>
    </div>
);

const MetamaskLogin = ({login}) => (
    <Button onClick={login}> Login with Metamask </Button>
);


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

// Get NONCE for session
const getNonce = async (minter, baseUrl) => {
  const result = await httpGet(`${baseUrl}/auth/v1/${minter}/nonce`);
  console.log("NONCE is", result.data);
  return result.data;
};



export default App;


function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Button
      variant="light"
      style={{width: "100%", padding: 0}}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}
