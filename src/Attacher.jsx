import { useState } from "react";
import { attach } from "./utils/attach.js";

const View = ({ makeScanUrl, chainConfig, attachmentContractAddress}) => {
  const [tx, setTx] = useState(null);
  const [nftId, setNftId] = useState("54643721834029575457854704653666079603751064262668993957281794348513350385668");
  const [cid, setCid] = useState("QmS4WQmnhQiaNBRkE58d8dp8G9JrxXfFp9yhxD1VvNQBPF");
  const [cidError, setCidError] = useState("");
  const [statusMsg, setStatusMsg] = useState(null);

  const onNftIdInput = e => setNftId(e.target.value);
  const onCidInput = e => {
  	try {
	  	setCid(e.target.value);
  	} catch (err) {
  		setCidError(err.toString());
  	}
  };
  const submitAttach = async () => {
    setTx(null);
    setStatusMsg("Attaching token + CID on " + chainConfig.descriptiveName);
    try {
      const tx = await attach(attachmentContractAddress, nftId, cid);
      setTx(tx.hash);
      setStatusMsg("Attached token + CID on successfully on " + chainConfig.descriptiveName);
    } catch (err) {
      setStatusMsg("Attach failed: " + String(err));
    }
  }
  return (
    <div className="Minter">
      <h2> Attach NFT to CID </h2>
      <div>
        <span> NFT ID: </span>
        <input placeholder="nftId" value={nftId} onChange={onNftIdInput}/>
      </div>
      <div>
        <span> Content ID: </span>
        <input placeholder="Content ID" value={cid} onChange={onCidInput}/>
        <span style={{color:"red"}}>{cidError}</span>
      </div>
      <button onClick={submitAttach}> Attach </button>
      <div> { statusMsg } </div>
      { tx ? <TxLink url={makeScanUrl(tx)}/> : ""}
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