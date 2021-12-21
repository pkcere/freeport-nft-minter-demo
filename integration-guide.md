# Cere Freeport Technical Overview

Cere Freeport is Cere's NFT minting and asset management solution with the following features:

-   Smart contracts for minting
-   Secure asset storage in DDC
-   Configure pricing, roylaty and auction parameters

## Architecture

The core functionality of Cere Freeport is provided by the Freeport smart contracts and the DDC. However, there are several other components that make developer experience simpler and efficient.

The following diagram shows the various components of the Freeport system:

![Architecture](integ-architecture.jpg)

-   Freeport Smart contracts: The smart contracts provide the onchain functionality to mint, configure and transact multi-asset, potentially multi-owner NFTs.
-   SC Client SDK: This is a Javascript SDK useful for interaction with the smart contracts from Web UI appications and nodejs-based services.
-   Creator suite: Web UI application for accessing Freeport functionality
-   DDC Proxy: A utility service that makes it easy to encrypt and store big blobs of data in the DDC.
-   DDC: Cere Decentralized Data Cloud, you can store arbitrary data, similar to a file system.
-   Freeport DB: A database containing historical smart contract changes to help applications provide faster access to historical data such as provenance, ownership transfer, sales etc.
-   Freeport API Service: A read-only API to access the Freeport DB.

## NFT Creation Process

NFT creation with Freeport involves the following steps:

1. Minting NFT: The token is an ERC1155 ID that represents one or more digital assets. NFT tokens in Freeport ecosystem do not contain the references to the assets like in other systems. The tokens are attached to a digital content stored in the DDC, using an `NFTAttachment` contract.
2. Creating assets in the DDC: This step involves storing the content data inside the DDC, using either the direct DDC interface, or going through a utility service called `DDC Proxy` which simplifies the process or breaking up the content into chunks, encrypting and storing them in the DDC.
3. Attaching one or more assets with the token: This step binds the token with asset content IDs created in the DDC.
4. Confiuration of royalties, pricing, auction parameters etc.

### Token Minting Step-by-Step Guide

### Setting up

Create a React application using the `create-react-app` tool:

    # Create React app
    npx create-react-app my-app
    cd my-app
    # Install required libraries
    npm install ethers @cere/freeport-sdk
    # start development server
    npm start

Tokens are minted using the javascript SDK for the smart contracts.

### Mint NFT

The `mintNftWebApp` in the integration.js file in this folder shows how to use Freeport SDK to create a Token from a web application. Note that this token does not yet have any assets attached to it.

### Creating Assets in the DDC

Digital assets maybe created in the DDC by uploading them to a `DDC Proxy`. Note that integrators may need to run their own `DDC Proxy` for security reasons.

For example, to create assets using Cere's Freeport staging environment, submit an HTTP POST request your file to the following URL: `https://ddc.freeport.stg.cere.network/assets/v1`. This request requires the following parameters:

    minter - Owner address
    file - binary file
    signature - Signed message
    minterEncryptionKey - Minter encryption key
    title - Asset title
    description - Descriptive text


The upload response returns an `uploadId` which can be used to check the status of the DDC creation request.

The following URL may be used to retrieve the status of the upload: `https://ddc.freeport.stg.cere.network/assets/v1/{uploadId}`, which returns the status in the following form:

    {
    "id": "350eefc6-b4d4-4c10-a81a-2b19f00105f5",
    "progress": {
        "ENCRYPT": 100,
        "DDC_UPLOAD": 75,
        "CACHE": 0
    },
    "result": null,
    "failed": false
    }

When the DDC upload completes, the above URL returns the CID in the `result` field. Polling should stop when the `result` field has a non-null value.  If the `failed` flag has a `true` value that indicates that the upload has failed.

`How would the error returned? TBD`

Reference: See the `upload2DDC` function in the attached code `integration.js`.

### Attaching Assets

`TBD`

### Royalty Configuration

`TODO`

### Verifying the DDC Content

`TODO`

## References

1. Smart contract Javascript SDK: https://github.com/Cerebellum-Network/Freeport-Smart-Contracts-SDK
1. Freeport Documentation : https://github.com/Cerebellum-Network/Cere-Freeport
1. DDC Proxy Swagger API: https://ddc.freeport.dev.cere.network/q/swagger-ui/
