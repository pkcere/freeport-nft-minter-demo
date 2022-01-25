import { useState } from "react";
import { mintNftWebApp } from "./utils/mint.js";

const View = ({ makeScanUrl, chainConfig, freeportContractAddress}) => {
  const [tx, setTx] = useState(null);
  const [qty, setQty] = useState(4);
  const [nftId, setNftId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const onQtyInput = e => setQty(e.target.value);
  const submitMintTx = async () => {
    setStatusMsg("Issuing token on " + chainConfig.descriptiveName);
    setTx(null);
    const {nftId, tx} = await mintNftWebApp(freeportContractAddress, +qty, "my metadata");
    setStatusMsg("Token issue successful on " + chainConfig.descriptiveName);
    setTx(tx.hash);
    setNftId(nftId);
  }
  return (
    <div className="Minter">
      <h2> Mint Freeport Token
        <span style={{fontSize:'smaller'}}> [{chainConfig.descriptiveName}]</span>
      </h2>
      <div>
        <span> Quantity: </span>
        <input type="number" placeholder="quantity" value={qty} onChange={onQtyInput}/>
      </div>
      <button onClick={submitMintTx}> Mint with FP API </button>
      <div> { statusMsg } </div>
      { tx ? <TxLink url={makeScanUrl(tx)}/> : ""}
      { nftId ? <div> NFT ID: {nftId}</div> : null}
    </div>
  );
};

const TxLink = ({url}) => (
  <a
    href={url}
    target={"txscanner"}>
    Transaction Link
  </a>
);

export default View;
