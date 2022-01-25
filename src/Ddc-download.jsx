import { useState } from "react";
import { downloadFromDDC } from "./utils/download";

const DdcDownload = ({makeDownloadUrl}) => {
	const [cid, setCid] = useState(null);
	const [content, setContent] = useState(null);
	const initiateDownload = async (_) => {
		const content = await downloadFromDDC(makeDownloadUrl, cid);
		setContent(content);
	};
    const onCidInput = e => setCid(e.target.value);

	return (
		<div className="Minter">
			<h2> DDC Download </h2>
	        <span> ContentID to download from DDC: </span>
	        <input placeholder="Enter CID to decrypt" value={cid} onChange={onCidInput}/>
			<button onClick={initiateDownload}> DDC Download </button>
			{ content ? (<div>Content retrieved is: {content} </div>) : null}
		</div>
	);
};

export default DdcDownload;
