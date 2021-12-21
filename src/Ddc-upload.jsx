import { useState } from "react";
import { upload2DDC } from "./utils/upload";

export default (_) => {
	const initiateUpload = (_) =>
		upload2DDC("blah blah",
			"my asset",
			"my asset description"
		);

	return (
		<button onClick={initiateUpload}> DDC Upload </button>
	);
}