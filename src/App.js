import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";
import DdcDownloader from "./Ddc-download";

function App() {
  return (
    <div className="App">
      <DdcUploader/>
      <DdcDownloader/>
      <FpMinter/>
      <hr/>
      <Minter></Minter>
    </div>
  );
}

export default App;