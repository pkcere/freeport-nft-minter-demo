import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

import {
    utilStr2ByteArr,
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
    utilGetEncPubKey,
    utilSign,
} from "./util";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const mintNftWebApp = async (quantity, strMetadata) => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider();
    console.log(provider);

    // env is one of: "stage" or "prod"
    const env = "prod"; // or stage or dev. prod is default

    // Pick smart contract address based on the environment
    const contractAddress = await getFreeportAddress(provider, env);

    // SDK object
    const apiInput = { provider, contractAddress };
    const cereFreeport = createFreeport(apiInput);

    const tx = await cereFreeport.issue(
        quantity,
        utilStr2ByteArr(strMetadata)
    );

    return tx;
};


// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const upload2DDC = async (data, title, description) => {
    // e.g. "ethereum" object Metamask
    const ethereum = utilProvider2Ethereum(importProvider());
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);
    const minterEncryptionKey = await utilGetEncPubKey(ethereum, accounts);

    const password = "";
    const signature = await utilSign(data, minter, password);
    const uploadData = {
        minter, // Owner address
        file: data, // binary file
        signature, // Signed message
        minterEncryptionKey, // Minter encryption key
        title, // Asset title
        description //Descriptive text
    };
    const url = "https://ddc.freeport.stg.cere.network/assets/v1";
    const uploadId = await upload(url, uploadData);
    const cid = await waitForDDCUpload(uploadId);
    return cid;
};
// Post HTTP request, parse response and return uploadId
const upload = async (url, data) => "TBD";

// Poll upload status URL until we get a "result" field (cid) or error.
// returns cid
const waitForDDCUpload = async (uploadId) => 0;
