import React, { useEffect, useState } from "react";
import Input from "./shared/Input";
import Textarea from "./shared/Textarea";

const Edit = ({ setMode, picked, setPicked }) => {
	const [inputs, setInputs] = useState({
		title: "",
		artist_statement: "",
		status: "",
		year_of_installation: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (picked) {
			setInputs({
				title: picked.title ?? "",
				artist_statement: picked.artist_statement ?? "",
				status: picked.status ?? "",
				year_of_installation: picked.year_of_installation ?? "",
			});
		}
	}, [picked]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await (
				await fetch(`/api/v1/arts/${picked.art_id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(inputs),
				})
			).json();
			console.log(res);
			if (!res.success) {
				setError(res.error || "Falied!");
				return;
			}
			setPicked({ ...picked, ...inputs });
			setMode("detail");
		} catch (err) {
			console.error(err);
			setError("Failed to update");
		} finally {
			setLoading(false);
		}
	};

	const { title, artist_statement, status, year_of_installation } = inputs;

	return (
		<form onSubmit={handleSubmit}>
			<h2>Edit Art</h2>
			<h3>Art Information</h3>

			<Input title="Title" name="title" value={title} onChange={handleChange} />

			<Textarea title="Artist Statement" name="artist_statement" value={artist_statement} onChange={handleChange} />

			<label htmlFor="status" className="inputs">
				Status
				<select value={status} onChange={handleChange} name="status" id="status">
					<option value="">All</option>
					<option value="In place">In place</option>
					<option value="No longer in place">No longer in place</option>
					<option value="Deaccessioned">Deaccessioned</option>
				</select>
			</label>

			<Input
				title="Year of Installation"
				type="number"
				name="year_of_installation"
				value={Number(year_of_installation)}
				onChange={handleChange}
			/>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<div style={{ display: "flex" }}>
				<button disabled={loading} onClick={() => setMode("detail")}>
					Cancel
				</button>
				<button disabled={loading}>Submit</button>
			</div>
		</form>
	);
};

export default Edit;
