import { useState } from "react";
import { upload2DDC } from "./utils/upload";

const DdcUpload =  ({chainConfig, uploadUrl }) => {
	const datestr = new Date().toLocaleTimeString();
	const [content, setContent] = useState(`[${datestr}] Sample text to upload to DDC`);
	const [statusMsg, setStatusMsg] = useState("");
	const [cid, setCid] = useState(null);
	const [preview, setPreview] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const initiateUpload = async (_) => {
		setStatusMsg("Uploading to: " + uploadUrl);
		const previewData = `**${content}**`;
		const [cid, preview, previewUrl] = await upload2DDC(uploadUrl, content, previewData,
			"my asset",
			"my asset description"
		);
		setStatusMsg("Upload to: " + uploadUrl + " successful.");
		setCid(cid);
		setPreview(preview);
		setPreviewUrl(previewUrl);
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
			<div> { cid ? (<div>Saved. 
					<div>DDC content id: <strong>{cid} </strong> </div>
					<div>preview link: <a href={previewUrl}> Preview </a></div>
					<div>preview is: <strong>{preview} </strong></div>
					</div>) : null} </div>
		</div>
	);
};

export default DdcUpload;
