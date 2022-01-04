import { useState, useCallback } from "react";
import { listTokens } from "./utils/list.js";

const TokenList =  (_) => {
	const [ownedList, setOwnedList] = useState(null);
	const getList = useCallback(async () => {
		const owned = await listTokens();
		// console.log({minted, owned});
		//setMintedList(minted);
		setOwnedList(owned);
	});
	return (
		<div className="Minter">
			<h2> Token List </h2>
			<button onClick={getList}> List My Tokens </button>

			{ ownedList ? (TokenListTable({ownedList})) : null}

		</div>
	);
};

const TokenListTable = ({ownedList}) => (
	<table border="1">
		<thead>
			<tr>
				<td> Quantity </td>
				<td> ID </td>
			</tr>
		</thead>
		<tbody>
			{ownedList.map((token,i) => (
				<tr key={i}>
					<td> {token.quantity} / {token.supply} </td>
					<td> {token.nftId} </td>
				</tr>
			))}
		</tbody>
	</table>
);

export default TokenList;
