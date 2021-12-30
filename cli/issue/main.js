const Ethers = require("ethers");
const FreeportSDK = require("@cere/freeport-sdk");
const util = require("./util");

const FREEPORT_CONTRACT = "0x4F908981A3CFdd440f7a3d114b06b1695DA8373b";
const PRIVATE_KEY = `8eef364e08a4bfb059c275cb6d8034f7672474b8a3646b89c4c6fe777866ab27`;
const PROVIDER_URL = `https://matic-mumbai.chainstacklabs.com/`;

const logger = util.createLogger();

const main = async (quantity, strMetadata) => {
    const provider = new Ethers.providers.JsonRpcProvider(PROVIDER_URL);
    logger.info("Created JSON RPC Provider");
    const contract = FreeportSDK.createFreeport({
        provider,
        contractAddress: FREEPORT_CONTRACT,
        privateKey: PRIVATE_KEY
    });
    logger.info("Created Freeport Contract Object");
    logger.info("Issuing token...");

    const tx = await contract.issue(
        quantity,
        util.str2ByteArr(strMetadata)
    );
    logger.info("... ✅ done!");

    logger.info("Retrieving NFT ID...");
    const nftId = await getTokenDetails(contract);
    logger.info("... ✅ done!");

    return { nftId, tx };
};

// Register for "TransferSingle" event and grab NFT ID when called
const getTokenDetails = async (contract) => new Promise((resolve, reject) => {
    const listener = (_addr1, _x, _addr2, token, _qty, _tx) => {
        contract.removeListener(listener);
        resolve(token._hex);
    };
    contract.on("TransferSingle", listener);
});



main(1, "optional token meta data")
.then((results) => logger.info("NFT ID:" + results.nftId))
.then(() => process.exit(0));

