import './App.css';
import Minter from './Minter'
import FpMinter from './Fp-Minter'
import DdcUploader from "./Ddc-upload";

function App() {
  return (
    <div className="App">
      {/* <FpMinter/>
      <DdcUploader/>
      <hr/> */}
      <Minter></Minter>
    </div>
  );
}

export default App;