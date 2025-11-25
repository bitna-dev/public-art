import React, { useEffect, useState } from "react";
import Input from "./shared/Input";
import Textarea from "./shared/Textarea";

const Create = ({ setMode }) => {
	const [inputs, setInputs] = useState({
		title: "",
		artist_statement: "",
		status: "",
		year_of_installation: "",

		neighbourhood: "",
		site_address: "",

		photo_url: "",
		width: "",
		height: "",
	});
	const {
		title,
		artist_statement,
		status,
		year_of_installation,

		site_address,
		neighbourhood,

		photo_url,
		width,
		height,
	} = inputs;

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErrors((prev) => ({ ...prev, [name]: null, global: null }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			const res = await (
				await fetch("/api/v1/arts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(inputs),
				})
			).json();

			if (!res.success) {
				setErrors({ global: res.error });
				return;
			}

			setMode(null);
		} catch (err) {
			console.error("Error: ", err);
			setErrors({ global: res.error });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Create New Art</h2>

			<h3>Art Information</h3>
			<Input title="Title" name="title" value={title} onChange={handleChange} />
			<Textarea title="Artist Statement" name="artist_statement" value={artist_statement} onChange={handleChange} />
			<Input title="Status" name="status" value={status} onChange={handleChange} />
			<Input
				title="Year of Installation"
				type="number"
				name="year_of_installation"
				value={year_of_installation}
				onChange={handleChange}
			/>

			<h3>Location Information</h3>
			<Input title="Address of Site" name="site_address" value={site_address} onChange={handleChange} />
			<Input title="Neighbourhood" name="neighbourhood" value={neighbourhood} onChange={handleChange} />

			<h3>Photo Information</h3>
			<Input title="Photo URL" name="photo_url" value={photo_url} onChange={handleChange} />
			<Input title="Width" type="number" name="width" value={width} onChange={handleChange} />
			<Input title="Height" type="number" name="height" value={height} onChange={handleChange} />

			{errors.global && <p style={{ color: "red" }}>{errors.global}</p>}

			<div style={{ display: "flex" }}>
				<button disabled={loading} onClick={() => setMode(null)}>
					Cancel
				</button>
				<button disabled={loading}>Submit</button>
			</div>
		</form>
	);
};

export default Create;
