
import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const mintNftWebApp = async () => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider();

    // env is one of: "stage" or "prod"
    const env = "prod"; // or stage or dev. prod is default

    // Pick smart contract address based on the environment
    const contractAddress = getFreeportAddress(provider, env);

    // SDK object
    const cereFreeport = createFreeport({ provider, contractAddress });

    const mydata = "Token metadata"; // This could be anything you like
    const nftId = await cereFreeport.issue(quantity, mydata);
    return nftId;
};

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const upload2DDC = async (data, title, description) => {
    // e.g. "ethereum" object Metamask
    const ethereum = provider2Ethereum(importProvider());  // e.g. Metamask
    const minter = await utilGetOwnerAddress(ethereum);
    const accounts = await utilGetAccounts(ethereum);
    const minterEncryptionKey = await utilGetEncPubKey(ethereum, accounts);

    const password = "";
    const signature = utilSign(data, minter, password);
    const uploadData = {
        minter, // Owner address
        file: data, // binary file
        signature, // Signed message
        minterEncryptionKey, // Minter encryption key
        title, // Asset title
        description //Descriptive text
    };
    const url = "";
    const uploadId = await upload(url, uploadData);
    const cid = await waitForDDCUpload(uploadId);
    return cid;
};

const provider2Ethereum = (provider) => provider;
const utilGetEncPubKey = async (ethereum, accounts) => ethereum
    .request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]], // you must have access to the specified account
    });

const utilGetOwnerAddress = async (ethereum) => "0"; // accounts[0]
const utilGetAccounts = async (ethereum) => ethereum.request({ method: 'eth_requestAccounts' });

// Post HTTP request, parse response and return uploadId
const upload = async (url, data) => "TBD";

// Poll upload status URL until we get a "result" field (cid) or error.
// returns cid
const waitForDDCUpload = async (uploadId) => 0;

// Sign upload request. Pops up
const utilSign = async (data, minter, password) =>
    web3.eth.personal.sign(confirmUploadMsg(data), minter, password)

const confirmUploadMsg = (data) =>
    `Confirm asset upload
    Title: ${data.title}
    Description: ${data.description}
    Address: ${data.minter}`;