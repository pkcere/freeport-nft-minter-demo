import {
    importProvider,
    createFreeport
} from "@cere/freeport-sdk";
import {
    freeportContractAddress,
} from "./config";
export const supplyGet = async (contractAddress, address, nftId) => {
    const provider = importProvider();
    const contract = createFreeport({
        provider,
        contractAddress
    });
    const balance = await contract.balanceOf(address, nftId);
    return balance.toNumber();
};
