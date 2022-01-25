import { get as httpGet } from "axios";
import { importProvider } from "@cere/freeport-sdk";
import {
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
} from "./util";


export const listTokens = async (makeTokenListUrl) => {
    const provider = importProvider()
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);
    // const url1 = listMintedUrl(minter);
    // const resp1 = await httpGet(url1);

    const url = makeTokenListUrl(minter);
    const resp = await httpGet(url);
    return resp.data;
};


// const listOwnedUrl = (wallet) => `https://api.freeport.stg.cere.network/wallet/${wallet}/nfts/owned`;

// const listMintedUrl = (wallet) => `https://api.freeport.stg.cere.network/wallet/${wallet}/nfts/minted`;
