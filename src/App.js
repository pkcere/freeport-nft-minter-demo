import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

import Attacher from "./Attacher";
import TokenSupply from "./Supply";
import TokenList from "./Lister";

function App() {
  return (
    <div className="App">
      <TokenList/>
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