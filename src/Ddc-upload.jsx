import { useState } from "react";
import { upload2DDC } from "./utils/upload";

const DdcUpload =  ({chainConfig, uploadUrl }) => {
	const datestr = new Date().toLocaleTimeString();
	const [content, setContent] = useState(`[${datestr}] Sample text to upload to DDC`);
	const [statusMsg, setStatusMsg] = useState("");
	const [cid, setCid] = useState(null);
	const initiateUpload = async (_) => {
		setStatusMsg("Uploading to: " + uploadUrl);
		const cid = await upload2DDC(uploadUrl, content,
			"my asset",
			"my asset description"
		);
		setStatusMsg("Upload to: " + uploadUrl + " successful.");
		setCid(cid);
	};
    const onConentInput = e => setContent(e.target.value);
	return (
		<div className="Minter">
			<h2> DDC Upload
				<span style={{fontSize:'smaller'}}> [{chainConfig.descriptiveName}]
				</span>
			</h2>

	        <span> Content to upload to DDC: </span>
	        <input placeholder="Enter data to save" value={content} onChange={onConentInput}/>
			<button onClick={initiateUpload}> DDC Upload </button>
			<div> { statusMsg } </div>
			<div> { cid ? (<div>Saved. DDC content id: {cid}
					</div>) : null} </div>

		</div>
	);
};

export default DdcUpload;
