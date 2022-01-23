import { useState } from "react";
import { mintNftWebApp } from "./utils/mint.js";
import { scanUrl } from "./utils/config";

const View = (_) => {
  const [tx, setTx] = useState(null);
  const [qty, setQty] = useState(4);
  const [nftId, setNftId] = useState(null);

  const onQtyInput = e => setQty(e.target.value);
  const submitMintTx = async () => {
    const {nftId, tx} = await mintNftWebApp(+qty, "my metadata");

    setTx(tx.hash);
    setNftId(nftId);
  }
  return (
    <div className="Minter">
      <h2> Mint Freeport Token </h2>
      <div>
        <span> Quantity: </span>
        <input type="number" placeholder="quantity" value={qty} onChange={onQtyInput}/>
      </div>
      <button onClick={submitMintTx}> Mint with FP API </button>
      { tx ? <TxLink tx={tx}/> : ""}
      { nftId ? <div> NFT ID: {nftId}</div> : null}
    </div>
  );
};

const TxLink = ({tx}) => (
  <a
    href={scanUrl(tx)}
    target={"txscanner"}>
    Transaction Link
  </a>
);

export default View;
