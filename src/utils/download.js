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

export const downloadFromDDC = async (makeDownloadUrl, cid) => {
    const provider = importProvider();
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);

    const signature = await utilSignDownload(provider, minter, cid, accounts[0]);
    const results = await httpGet(makeDownloadUrl(minter, cid), {
    	headers: {
            'X-DDC-Signature': signature,
            'X-DDC-Address': minter
    	}
    });
    return results.data;
};

