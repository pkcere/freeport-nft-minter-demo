import { useState } from "react";
import { upload2DDC } from "./utils/upload";

const DdcUpload =  (_) => {
	const datestr = new Date().toLocaleTimeString();
	const [content, setContent] = useState(`[${datestr}] Sample text to upload to DDC`);
	const [cid, setCid] = useState(null);
	const initiateUpload = async (_) => {
		const cid = await upload2DDC(content,
			"my asset",
			"my asset description"
		);
		setCid(cid);
	};
    const onConentInput = e => setContent(e.target.value);
	return (
		<div className="Minter">
			<h2> DDC Upload </h2>
	        <span> Content to upload to DDC: </span>
	        <input placeholder="Enter data to save" value={content} onChange={onConentInput}/>
			<button onClick={initiateUpload}> DDC Upload </button>
			{ cid ? (<div>Saved. DDC content id: {cid}
					</div>) : null}

		</div>
	);
};

export default DdcUpload;
