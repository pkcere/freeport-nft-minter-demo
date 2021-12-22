import { useState } from "react";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { downloadFromDDC } from "./utils/download";

const DdcDownload = (props) => {
	const [cid, setCid] = useState(props.cid);
	const [content, setContent] = useState(null);
	const initiateDownload = async (_) => {
		const content = await downloadFromDDC(cid);
		setContent(content);
	};
    const onCidInput = e => setCid(e.target.value);

	return (
		<div className="Minter">
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        style={{ backgroundColor: "black"}}
        alt="Download"
        height="140"
        image="https://cere.network/assets/images/home/2nd.svg"
      />
      <CardContent>
			<h2> Download from DDC </h2>
	        <span> ContentID to download from DDC: </span>
	        <input placeholder="Enter CID to decrypt" value={cid} onChange={onCidInput}/>
      </CardContent>
      <CardActions>
			<Button onClick={initiateDownload}> DDC Download </Button>
			{ content ? (<div>Content retrieved is: {content} </div>) : null}
        <Button size="small">Learn More</Button>
        {/* <Button size="small">&lt;/&gt;</Button> */}
      </CardActions>
    </Card>
		</div>
	);
};

export default DdcDownload;
