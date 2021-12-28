import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

import Attacher from "./Attacher";

function App() {
  return (
    <div className="App">
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