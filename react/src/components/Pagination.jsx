import React from "react";

const Pagination = ({ page, setPage, hasMore }) => {
	const prevPage = () => {
		setPage((prev) => prev - 1);
	};
	const nextPage = () => {
		setPage((prev) => prev + 1);
	};
	return (
		<div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginTop: ".4rem" }}>
			<button className="btn__pagenation" disabled={page == 1} onClick={prevPage}>
				&lt;
			</button>
			<span>{page}</span>
			<button className="btn__pagenation" disabled={!hasMore} onClick={nextPage}>
				&gt;
			</button>
		</div>
	);
};

export default Pagination;
