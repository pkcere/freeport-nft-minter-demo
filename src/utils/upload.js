import {
    importProvider,
} from "@cere/freeport-sdk";

import {
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
    utilGetEncPubKey,
    utilSignUpload,
    utilStr2ByteArr
} from "./util";

import { get as httpGet, post as httpPost } from "axios";

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
const uploadUrl = () => "https://ddc.freeport.dev.cere.network/assets/v1";
export const upload2DDC = async (data, title, description) => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider()
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);
    const minterEncryptionKey = await utilGetEncPubKey(ethereum, accounts);
    const signature = await utilSignUpload(provider, minter,
    	{title, description, minter});

    const uploadData = {
        minter, // Owner address
        file: data, // binary file
        signature, // Signed message
        minterEncryptionKey, // Minter encryption key
        title, // Asset title
        description //Descriptive text
    };
    const httpRes = await upload(uploadUrl(), uploadData);
    const cid = await waitForDDCUpload(httpRes.data);
    return cid;
};


// Post HTTP request, parse response and return uploadId
const upload = async (url, data) => {
	let fdata = new FormData();
	fdata.append('minter', data.minter);
	fdata.append('file', new File(
		utilStr2ByteArr(data.file),
		"my-ddc-file.txt", {type: "text/plain",}
		));
	fdata.append('signature', data.signature);
	fdata.append('minterEncryptionKey', data.minterEncryptionKey);
	fdata.append('description', data.description);
	fdata.append('title', data.title);

	return httpPost(
		url,
		fdata,
		{
			headers: {
	      		'Content-Type': 'multipart/form-data'
			}
	});
}

const statusUrl = (uploadId) => `https://ddc.freeport.dev.cere.network/assets/v1/${uploadId}`;
const getUploadResponse = (uploadId) => httpGet(statusUrl(uploadId));
export const getUploadStatus = async (uploadId) => await getUploadResponse(uploadId).progress.DDC_UPLOAD;
export const getContentID = async (uploadId) => await waitForDDCUpload(uploadId);

// Poll upload status URL until we get a "result" field (cid) or error.
// returns cid
const waitForDDCUpload = async (uploadStatus) => {
	const uploadId = uploadStatus.id;
	for (let i=0; i < 3; i++) {
		if (uploadStatus.result) {
			return uploadStatus.result;
		}
		if (uploadStatus.failed) {
			throw new Error("DDC Upload failed");
		}
		await sleep10();
		const httpRes = await getUploadStatus(uploadId);
		uploadStatus = httpRes.data;
	}
	throw new Error("Unable to get upload status after 3 attempts");
};


const sleep10 = async () => new Promise((resolve, _) => {
	setTimeout(() => resolve(), 10*1000);
});
