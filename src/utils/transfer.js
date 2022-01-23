import {
    importProvider,
    createFreeport
} from "@cere/freeport-sdk";
import {
    freeportContractAddress,
} from "./config";


export const transfer = async (from, to, nftId) => {
    const provider = importProvider();
    const contractAddress = freeportContractAddress();
    const contract = createFreeport({
        provider,
        contractAddress
    });

    const tx = await contract.safeTransferFrom(from, to, nftId, 1, [0]);
    const receipt = await tx.wait();
    console.log(receipt);

    return tx;
};
