import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { upload2DDC } from "./utils/upload";

const DdcUpload =  ({chainConfig, uploadUrl, sessionToken, minter, minterEncryptionKey, }) => {
	const datestr = new Date().toLocaleTimeString();
	const [content, setContent] = useState(`[${datestr}] Sample text to upload to DDC`);
	const [statusMsg, setStatusMsg] = useState("");
	const [cid, setCid] = useState(null);
	const [preview, setPreview] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const initiateUpload = async (_) => {
		try {
			setStatusMsg("Uploading to: " + uploadUrl);
			const previewData = `**${content}**`;
			const [cid, preview, previewUrl] = await upload2DDC(uploadUrl, sessionToken, minter, minterEncryptionKey, content, previewData,
				"my asset",
				"my asset description"
			);
			setStatusMsg("Upload to: " + uploadUrl + " successful.");
			setCid(cid);
			setPreview(preview);
			setPreviewUrl(previewUrl);
		} catch(err) {
			setStatusMsg(""+err);
		}
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
			<Button onClick={initiateUpload}> DDC Upload </Button>
			{statusMsg && 
			<Alert variant="info">
			<div> { statusMsg } </div>
			<div> { cid ? (<div> 
					<div>DDC content id: <strong>{cid} </strong> </div>
					<div>preview link: <a href={previewUrl}> Preview </a></div>
					<div>preview is: <strong>{preview} </strong></div>
					</div>) : null} </div>
			</Alert>
			}
		</div>
	);
};

export default DdcUpload;
