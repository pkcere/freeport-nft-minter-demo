import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

import {
    utilStr2ByteArr,
} from "./util";

// Register for "TransferSingle" event and grab NFT ID when called
const getTokenDetails = async (contract) => new Promise((resolve, reject) => {
    const listener = (_addr1, _x, _addr2, token, _qty, _tx) => {
        contract.removeListener(listener);
        resolve(token._hex);
    };
    contract.on("TransferSingle", listener);
});


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
    const contract = createFreeport(apiInput);

    const tx = await contract.issue(
        quantity,
        utilStr2ByteArr(strMetadata)
    );

    // Returns an object with two fields: nftId and tx
    const nftId = await getTokenDetails(contract);
    return { nftId, tx };
};


