import { get as httpGet,} from "axios";
import {
    importProvider,
} from "@cere/freeport-sdk";
import {
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
    utilSignDownload,
} from "./util";

export const downloadFromDDC = async (cid) => {
    const provider = importProvider();
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);

    const signature = await utilSignDownload(provider, minter, cid, accounts[0]);
    const results = await httpGet(downloadUrl(minter, cid), {
    	headers: {
	    	'X-DDC-Signature': signature
    	}
    });
    return results.data;
}

const downloadUrl = (minter, cid) => `https://ddc.freeport.dev.cere.network/assets/v1/${minter}/${cid}/content`;