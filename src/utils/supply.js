import {
    importProvider,
    createFreeport
} from "@cere/freeport-sdk";
import {
    freeportContractAddress,
} from "./config";
export const supplyGet = async (address, nftId) => {
    const provider = importProvider();
    const contract = createFreeport({
        provider,
        contractAddress: freeportContractAddress()
    });
    const balance = await contract.balanceOf(address, nftId);
    return balance.toNumber();
};
