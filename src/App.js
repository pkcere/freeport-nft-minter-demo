import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

import Attacher from "./Attacher";
import TokenSupply from "./Supply";
import TokenList from "./Lister";
import Transfer from "./Transfer";
import ChainSelector from "./ChainSelector";

import { setChain } from "./utils/config";


function App() {
  // setChain("avax_testnet");
  // window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0xa869" }], });
  return (
    <div className="App">
      <ChainSelector/>
      <DdcUploader/>
      <DdcDownloader/>
      <FpMinter/>
      <TokenSupply />
      <Attacher />
      <TokenList/>
      <Transfer/>
      <hr/>
      <Minter></Minter>
    </div>
  );
}

export default App;