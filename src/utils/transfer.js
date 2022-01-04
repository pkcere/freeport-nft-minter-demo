import {
    importProvider,
    getFreeportAddress,
    createFreeport
} from "@cere/freeport-sdk";

export const transfer = async (from, to, nftId) => {
    const env = "stage"; // or stage or dev. prod is default
    const provider = importProvider();
    const contract = createFreeport({
        provider,
        contractAddress: await getFreeportAddress(provider, env)
    });

    const tx = await contract.safeTransferFrom(from, to, nftId, 1, [0]);
    const receipt = await tx.wait();
    console.log(receipt);

    return tx;
};
