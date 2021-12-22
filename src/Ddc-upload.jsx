import { useState } from "react";
import { upload2DDC } from "./utils/upload";
import Button from '@mui/material/Button';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


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
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        style={{ backgroundColor: "black"}}
        alt="Upload"
        height="140"
        image="https://cere.network/assets/images/home/graphic-freeport.svg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Upload to DDC
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Intro text about DDC & how easy it is to upload etc.
        </Typography>

        <Typography variant="body3" color="text.secondary">
        	        <span> Content to upload to DDC: </span>
	        <input placeholder="Enter data to save" value={content} onChange={onConentInput}/>
			{ cid ? (<div>Saved. DDC content id: {cid}
					</div>) : null}
        </Typography>

      </CardContent>
      <CardActions>
        <Button onClick={initiateUpload} size="small">Upload</Button>
        <Button size="small">Learn More</Button>
        {/* <Button size="small">&lt;/&gt;</Button> */}
      </CardActions>
    </Card>
		</div>
	);
};

export default DdcUpload;

