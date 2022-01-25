import bs58 from 'bs58';

import {
    importProvider,
    createNFTAttachment
} from "@cere/freeport-sdk";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const attach = async (contractAddress, nftId, cid) => {
    const provider = importProvider();
    // SDK object
    const apiInput = { provider, contractAddress };
    const contract = createNFTAttachment(apiInput);

    const tx = await contract.minterAttachToNFT(
        nftId,
        getBytes32FromString(cid)
    );

    return tx;
};

const getBytes32FromString = (ipfsListing) =>
   "0x"+bs58.decode(ipfsListing).slice(2).toString('hex');
