
const View = ({updateChainId, chainConfig, chainDescriptiveName}) => {
  const chainId = chainConfig.chainId;
  const onSelectChain = async (event) => {
    const selected = event.target.value;
    await updateChainId(selected);
  }

  const options = Object.keys(chainDescriptiveName).map(key => (
    <option key={key} value={key}>{chainDescriptiveName[key]}</option>
  ));

  return (
    <div>
      <div> Select Chain: <select onChange={onSelectChain} value={chainId}> {options} </select> </div>
      {/* <pre> { JSON.stringify(chainConfig) } </pre> */}
    </div>
  );
};

export default View;