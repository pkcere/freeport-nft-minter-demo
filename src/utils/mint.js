import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

import {
    utilStr2ByteArr,
} from "./util";


// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const mintNftWebApp = async (quantity, strMetadata) => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider();

    // env is one of: "stage" or "prod"
    const env = "prod"; // or stage or dev. prod is default

    // Pick smart contract address based on the environment
    const contractAddress = await getFreeportAddress(provider, env);
    const apiInput = { provider, contractAddress };
    const contract = createFreeport(apiInput);

    const tx = await contract.issue(
        quantity,
        utilStr2ByteArr(strMetadata)
    );

    const receipt = await tx.wait();
    const nftId = receipt.events[0].args[3].toString();
    return { nftId, tx };
};


