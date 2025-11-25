import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

const List = ({ setMode, mode, setPicked }) => {
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [status, setStatus] = useState("");

	const getAllArts = async () => {
		let url = `/api/v1/arts?page=${page}`;
		if (status) url += `&status=${status}`;

		const res = await (await fetch(url)).json();
		setItems(res);
		setHasMore(res.length === 10);
	};

	useEffect(() => {
		getAllArts();
	}, [page, status, mode]);

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
				<button
					onClick={() => {
						setMode("create");
					}}
				>
					Add Art
				</button>
				<select
					value={status}
					onChange={(e) => {
						setPage(1);
						setStatus(e.target.value);
					}}
				>
					<option value="">All</option>
					<option value="In place">In place</option>
					<option value="No longer in place">No longer in place</option>
					<option value="Deaccessioned">Deaccessioned</option>
				</select>
			</div>

			<table>
				<thead>
					<tr>
						<th>No</th>
						<th>Title</th>
						<th>Location</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
					{items?.map((item, idx) => (
						<tr
							style={{ cursor: "pointer" }}
							key={item.art_id}
							onClick={() => {
								setPicked(item);
								setMode("detail");
							}}
						>
							<td>{(page - 1) * 10 + (idx + 1)}</td>
							<td>{item.title}</td>
							<td>{item.neighbourhood}</td>
							<td>{item.status}</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination page={page} setPage={setPage} hasMore={hasMore} />
		</div>
	);
};

export default List;
