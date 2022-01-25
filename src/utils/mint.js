import {
    importProvider,
    createFreeport
} from "@cere/freeport-sdk";

import {
    utilStr2ByteArr,
} from "./util";

import {
    freeportContractAddress,
} from "./config";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const mintNftWebApp = async (contractAddress, quantity, strMetadata) => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider();
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


