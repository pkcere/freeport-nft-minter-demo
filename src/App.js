import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

import Attacher from "./Attacher";
import TokenSupply from "./Supply";
import TokenList from "./Lister";
import Transfer from "./Transfer";

import { setChain } from "./utils/config";


function App() {
  setChain("avax_testnet");
  return (
    <div className="App">
      <TokenList/>
      <Transfer/>
      <TokenSupply />
      <Attacher />
      <DdcUploader/>
      <DdcDownloader/>
      <FpMinter/>
      <hr/>
      <Minter></Minter>
    </div>
  );
}

export default App;