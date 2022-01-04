import bs58 from 'bs58';
import { useState } from "react";
import { supplyGet } from "./utils/supply";

const SAMPLE_NFT_ID = `54643721834029575457854704653666079603751064262668993958370152248862213931050`;
const SAMPLE_ACCOUNT = `0x78CF40233b7B5171E469f4044ccde630431d7D23`;

export default (_) => {
  const [tx, setTx] = useState(null);
  const [nftId, setNftId] = useState(SAMPLE_NFT_ID);
  const [account, setAccount] = useState(SAMPLE_ACCOUNT);
  const [supply, setSupply] = useState(null);

  const onNftIdInput = e => setNftId(e.target.value);
  const submit = async () => {
    setSupply( await supplyGet(account, nftId));
  }
  return (
    <div className="Minter">
      <h2> Supply </h2>
      <div>
        <span> NFT ID: </span>
        <input placeholder="nftId" value={nftId} onChange={onNftIdInput}/>
      </div>
      <button onClick={submit}> Get Supply </button>
      { supply ? `Quantity: ${supply}` : null}
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

