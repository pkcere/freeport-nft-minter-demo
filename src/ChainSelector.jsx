import { useEffect, useState } from "react";
import { chainDescriptiveName, getChainDescriptiveName, setChainId } from "./utils/config";

const View = () => {
  const [chainName, selectChainName] = useState('polygon_testnet');
  const [chainId, selectChainId] = useState('0x13881');
      window.ethereum.on('connect', (connection) => {
        selectChainId(connection.chainId);
        selectChainName(getChainDescriptiveName(connection.chainId));
      });
      window.ethereum.on("chainChanged", (chainId) => {
        selectChainName(getChainDescriptiveName(chainId));
      });
  const onSelectChain = async (event) => {
    const selected = event.target.value;
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: selected }],
    });
    selectChainName(getChainDescriptiveName(selected));
    selectChainId(selected);
    setChainId(selected);
  }

  const options = Object.keys(chainDescriptiveName).map(key => (
    <option key={key} value={key}>{chainDescriptiveName[key]}</option>
  ));

  return (
    <div>
      <div> Select Chain: <select onChange={onSelectChain} value={chainId}> {options} </select> </div>
    </div>
  );
};

export default View;