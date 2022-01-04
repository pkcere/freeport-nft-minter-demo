import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

export const supplyGet = async (address, nftId) => {
    const env = "stage"; // or stage or dev. prod is default
    const provider = importProvider();
    const contract = createFreeport({
        provider,
        contractAddress: await getFreeportAddress(provider, env)
    });

    const balance = await contract.balanceOf(address, nftId);
    return balance.toNumber();
};
