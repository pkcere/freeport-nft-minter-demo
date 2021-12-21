import {
    importProvider,
} from "@cere/freeport-sdk";
// import Web3 from 'web3';
// const web3 = new Web3(web3.currentProvider);

// What's the right abstraction for the "ethereum" object?
export const utilProvider2Ethereum = (provider) => provider.provider;
export const utilGetEncPubKey = async (ethereum, accounts) => ethereum
    .request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]], // you must have access to the specified account
    });

export const utilGetOwnerAddress = async (ethereum, accounts) => accounts[0];
export const utilGetAccounts = async (ethereum) =>
	ethereum.request({ method: 'eth_requestAccounts' });

export const utilStr2ByteArr = (str) => {
    const arr = [];
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    return arr;
}

const sleep1 = async () => new Promise((resolve, _) => {
	setTimeout(() => resolve(), 1000);
})

export const utilSign = async (provider, data, minter) => {
	const signer = provider.getSigner();

	await sleep1();

	const signature = await signer.signMessage(confirmUploadMsg(data));
	return signature;
};

export const utilSign2 = async (data, minter, password) =>
    // window.web3.eth.personal.sign(confirmUploadMsg(data), minter, password)
    new Promise((resolve, reject) => {
      const method = 'personal_sign';
		  window.web3.currentProvider.sendAsync({
		    method,
		    data: confirmUploadMsg(data),
		    from: minter,
		  }, function (err, result) {
		    if (err) return reject(err);
		    if (result.error) return reject(result.error)
		    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

		    // console.log('recovering...')
		    // const msgParams = { data: msg }
		    // msgParams.sig = result.result
		    // console.dir({ msgParams })
		    // const recovered = sigUtil.recoverPersonalSignature(msgParams)
		    // console.dir({ recovered })

		    // if (recovered === from ) {
		    //   console.log('SigUtil Successfully verified signer as ' + from)
		    //   window.alert('SigUtil Successfully verified signer as ' + from)
		    // } else {
		    //   console.dir(recovered)
		    //   console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
		    //   console.log('Failed, comparing %s to %s', recovered, from)
		    // }
		    resolve(result.result);
	    });
		});
const confirmUploadMsg = (data) =>
    `Confirm asset upload
    Title: ${data.title}
    Description: ${data.description}
    Address: ${data.minter}`;

window.provider = importProvider();