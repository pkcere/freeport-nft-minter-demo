import bs58 from 'bs58';
import { useState } from "react";
import { transfer } from "./utils/transfer";


export default (_) => {
  const [tx, setTx] = useState(null);
  const [from, setFrom] = useState("0x78CF40233b7B5171E469f4044ccde630431d7D23");
  const [to, setTo] = useState("0xC00A12e3bb6F6F68802D733fFE3F730C1074282F");
  const [nftId, setNftId] = useState('');

  const onFromInput = e => setFrom(e.target.value);
  const onToInput = e => setTo(e.target.value);
  const onNftIdInput = e => setNftId(e.target.value);

  const submit = async () => {
  	const tx = await transfer(from, to, nftId);
  	setTx(tx.hash);
  };

  return (
    <div className="Minter">
      <h2> Transfer Token </h2>
      <div>
        <span> From Wallet: </span>
        <input placeholder="From Address" value={from} onChange={onFromInput}/>
      </div>
      <div>
        <span> To Wallet: </span>
        <input placeholder="To Address" value={to} onChange={onToInput}/>
      </div>
      <div>
        <span> NFT ID: </span>
        <input placeholder="nftId" value={nftId} onChange={onNftIdInput}/>
      </div>
      <button onClick={submit}> Transfer </button>
      { tx ? <TxLink tx={tx}/> : null}
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

