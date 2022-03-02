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
export const upload2DDC = async (url, sessionToken, minter, minterEncryptionKey, data, preview, title, description) => {
    const uploadData = {
        minter, // Owner address
        file: data, // binary file
        preview,
        minterEncryptionKey, // Minter encryption key
        title, // Asset title
        description //Descriptive text
    };
    const uploadUrl = `${url}/assets/v2`;
    const httpRes = await upload(uploadUrl, uploadData, sessionToken);
    const cid = httpRes.data;

    // get preview URL
    const previewContent = await getPreviewUrl(url, minter, cid, sessionToken);

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

