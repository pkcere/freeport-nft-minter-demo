import { useState } from "react";
import { mintNftWebApp } from "./utils/mint.js";

export default (_) => {
  const [tx, setTx] = useState(null);
  const [qty, setQty] = useState(4);

  const onQtyInput = e => setQty(e.target.value);
  const submitMintTx = async () => {
    const tx = await mintNftWebApp(+qty, "my metadata");
    setTx(tx.hash);
  }
  return (
    <div className="Minter">
      <div>
        <span> Quantity: </span>
        <input type="number" placeholder="quantity" value={qty} onChange={onQtyInput}/>
      </div>
      <button onClick={submitMintTx}> Mint with FP API </button>
      { tx ? <TxLink tx={tx}/> : ""}
    </div>
  );
};

const TxLink = ({tx}) => (
  <a
    href={`https://mumbai.polygonscan.com/tx/${tx}`}
    target={"polyscanner"}>
    Transaction Link
  </a>
);

