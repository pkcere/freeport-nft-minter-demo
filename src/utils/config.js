
let chain = "polygon_testnet";

export const setChain = (name) => (chain = name);

export const setChainId = (chainId) => {
    const chainName = chainsById[chainId];
    setChain(chainName);
    console.log("using chain: ", chainName, chainId);
};
export const freeportContractAddress = () => config[chain].freeport;
export const attachmentContractAddress = () => config[chain].attachment;

export const statusUrl = (uploadId) => `${config[chain].proxyServer}/assets/v1/${uploadId}`;
export const uploadUrl = () => `${config[chain].proxyServer}/assets/v1`;
export const scanUrl = (tx) => `${config[chain].scanner}/${tx}`;

const chainsById = {
    "0x13881": 'polygon_testnet',
    "0x61":    'bsc_testnet',
    "0xa869": 'avax_testnet',
};

const config = {
    polygon_testnet: {
        freeport: "0xAD56017BAD84Fa4Eab489314C1e158C6adaca598",
        attachment: "0x1282fdeC36aC4aaf025059D69077d4450703eeD0",
        proxyServer: "https://ddc.freeport.dev.cere.network",
        scanner: "https://mumbai.polygonscan.com/tx",
    },
    bsc_testnet: {
        freeport: "0x848A415f0da2aC5F1cAC0289319448b96127b163",
        attachment: "0xEee0b3D146C8FDCB5613904859bA2225a11C7b4A",
        proxyServer: "http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8192",
        scanner: "https://testnet.bscscan.com/tx",
    },
    avax_testnet: {
        freeport: "0x848A415f0da2aC5F1cAC0289319448b96127b163",
        attachment: "0xEee0b3D146C8FDCB5613904859bA2225a11C7b4A",
        proxyServer: "http://ec2-35-88-47-116.us-west-2.compute.amazonaws.com:8292",
        scanner: "https://testnet.snowtrace.io/tx",
    },
}

/*
{
  "dev": {
    "80001": {
      "Freeport": "0xd1EdBAC660307c5B6d22E678FB5e22668C70Ad96",
      "FiatGateway": "0x1f8eC932B6ec39A0326b74E9648A158F88B24082",
      "SimpleAuction": "0xd7cd23C84F9109F57f13eF28319e8787628DD7ad",
      "NFTAttachment": "0x270693f873287a39172856Ad8cfbCd79b040b287"
    }
  },
  "stage": {
    "80001": {
      "Freeport": "0xAD56017BAD84Fa4Eab489314C1e158C6adaca598",
      "FiatGateway": "0x7B7e644c49D6C1e7C4af63eFB8cAD382a7b397fB",
      "SimpleAuction": "0x49a08A6d213649b50655979E222C8496ADac050c",
      "NFTAttachment": "0x1282fdeC36aC4aaf025059D69077d4450703eeD0"
    }
  },
  "prod": {
    "80001": {
      "Freeport": "0x4F908981A3CFdd440f7a3d114b06b1695DA8373b",
      "FiatGateway": "0xe4708fcCEA49b9305f48901bc2195664dC198097",
      "SimpleAuction": "0x573fc9819FD436C9Dc74b10949b2404C99C54A33",
      "NFTAttachment": "0x1282fdeC36aC4aaf025059D69077d4450703eeD0"
    }
  }
}
*/