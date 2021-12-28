// import Web3 from "web3";
import {
    importProvider,
    getNFTAttachmentAddress,
    createNFTAttachment
} from "@cere/freeport-sdk";

import {
    utilStr2ByteArr,
} from "./util";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const attach = async (nftId, cid) => {
	debugger
    // e.g. "ethereum" object Metamask
    const provider = importProvider();
	// const web3 = new Web3(provider);
    // env is one of: "stage" or "prod"
    const env = "prod"; // or stage or dev. prod is default
    // Pick smart contract address based on the environment
    const contractAddress = await getNFTAttachmentAddress(provider, env);

    // SDK object
    const apiInput = { provider, contractAddress };
    const cereFreeport = createNFTAttachment(apiInput);

    const tx = await cereFreeport.attachToNFT(
        nftId,
        // web3.fromAscii(cid)
        cid
    );

    return tx;
};


