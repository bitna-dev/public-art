import React, { useEffect, useState } from "react";

const Detail = ({ setMode, picked, setPicked }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getArt = async () => {
		try {
			const data = await (await fetch(`/api/v1/arts/${picked.art_id}`)).json();
			setPicked(data);
		} catch (err) {
			console.error(err);
			setError("Failed to fetch data!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (picked?.art_id) getArt();
	}, [picked?.art_id]);

	if (!picked) return null;
	if (error) return <div>{error}</div>;

	return (
		<div className="detail__container">
			{picked.photo?.photo_url ? (
				<img
					src={picked.photo?.photo_url}
					alt={`${picked.art_id}`}
					width={picked.photo?.width || 200}
					height={picked.photo?.height || 200}
				/>
			) : null}

			<div className="btn__group">
				<button disabled={loading} onClick={() => setMode("edit")}>
					Edit
				</button>
			</div>

			<h2>{picked.title}</h2>

			{picked?.status && (
				<p>
					<span>Status: </span> {picked.status}
				</p>
			)}

			{picked?.year_of_installation && (
				<p>
					<span>Year of Installation: </span> {picked.year_of_installation}
				</p>
			)}

			{picked?.artist_statement && (
				<p>
					<span>Artist Statement: </span> {picked.artist_statement}
				</p>
			)}

			{picked?.location?.site_address && (
				<p>
					<span>Address: </span> {picked?.location?.site_address}{" "}
					{picked.location?.neighbourhood && picked.location?.neighbourhood}
				</p>
			)}
		</div>
	);
};

export default Detail;
