import {
    importProvider,
} from "@cere/freeport-sdk";

import {
    utilProvider2Ethereum,
    utilGetAccounts,
    utilGetOwnerAddress,
    utilGetEncPubKey,
    utilSign,
} from "./util";

import {
	statusUrl
} from "./config";

import { get as httpGet, post as httpPost } from "axios";


// Get NONCE for session
const getNonce = async (minter, baseUrl) => {
	const result = await httpGet(`${baseUrl}/auth/v1/${minter}/nonce`);
	console.log("NONCE is", result.data);
	return result.data;
};

// Authorize
const authorize = async (baseUrl, provider, minter, encryptionPublicKey, nonce) => {
	const msgToSign = `${minter}${encryptionPublicKey}${nonce}`;
    const signature = await utilSign(provider, minter, msgToSign);
    const authUrl = `${baseUrl}/auth/v1/${minter}`;
    const result = await httpPost(authUrl, {encryptionPublicKey, signature});
    console.log("Auth result", result.data);
    const token = result.data.accessToken;
    return token;
};

const getPreviewUrl = async (baseUrl, minter, cid, jwt) => {
	const result = await httpGet(`${baseUrl}/assets/v2/${minter}/${cid}/preview`);
    console.log("Preview result", result);
	return result.data;
}

// Assumes Metamask or some other web3 wallet extension
// Assumes browser environment
export const upload2DDC = async (url, data, preview, title, description) => {
    // e.g. "ethereum" object Metamask
    const provider = importProvider()
    const ethereum = utilProvider2Ethereum(provider);
    const accounts = await utilGetAccounts(ethereum);
    const minter = await utilGetOwnerAddress(ethereum, accounts);
    const minterEncryptionKey = await utilGetEncPubKey(ethereum, accounts);

    const uploadData = {
        minter, // Owner address
        file: data, // binary file
        preview,
        minterEncryptionKey, // Minter encryption key
        title, // Asset title
        description //Descriptive text
    };
    const uploadUrl = `${url}/assets/v2`;
    const nonce = await getNonce(minter, url);
    const jwt = await authorize(url, provider, minter, minterEncryptionKey, nonce);
    const httpRes = await upload(uploadUrl, uploadData, jwt);
    const cid = httpRes.data;

    // get preview URL
    const previewContent = await getPreviewUrl(url, minter, cid, jwt);

    return [cid, previewContent,`${url}/assets/v2/${minter}/${cid}/preview`];
};

// Post HTTP request, parse response and return uploadId
const upload = async (url, data, jwt) => {
	let fdata = new FormData();
	fdata.append('asset', new File(
		[data.file],
		"my-ddc-file.txt", {type: "text/plain",}
		));
	fdata.append('preview', new File(
		[data.preview],
		"my-ddc-file.txt", {type: "text/plain",}
		));
	fdata.append('contentType', 'text/plain')
	fdata.append('description', data.description);
	fdata.append('title', data.title);

	return httpPost(
		url,
		fdata,
		{
			headers: {
	      		'Content-Type': 'multipart/form-data',
	      		Authorization: `Bearer ${jwt}`
			}
	});
}

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

const getUploadStatus = (uploadId) => httpGet(statusUrl(uploadId));

const sleep10 = async () => new Promise((resolve, _) => {
	setTimeout(() => resolve(), 10*1000);
});

