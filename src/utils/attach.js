import bs58 from 'bs58';

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
    const provider = importProvider();
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
        getBytes32FromIpfsHash(cid)
    );

    return tx;
};

const getBytes32FromIpfsHash = (ipfsListing) =>
   "0x"+bs58.decode(ipfsListing).slice(2).toString('hex');
