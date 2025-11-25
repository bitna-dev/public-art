import artModel from "../models/artModel.js";

const calcOffset = (page) => {
	return (page - 1) * 10;
};

const getArts = (req, res) => {
	const page = req.query.page || 1;
	const offset = calcOffset(page);
	const status = req.query.status ? req.query.status.toLowerCase() : "";

	const data = artModel.getArts(status, offset);
	res.status(200).json(data);
};

const getOneArt = (req, res) => {
	const { id } = req.params;

	if (!id)
		return res.status(404).json({
			message: "No art found",
		});

	const data = artModel.getOneArt(id);

	res.status(200).json(data);
};

const createArt = (req, res) => {
	const payload = req.body;
	console.log(payload);

	const data = artModel.createArt(payload);
	res.status(201).json(data);
};

const updateArt = (req, res) => {
	const { id } = req.params;
	artModel.updateArt(id, req.body);
	res.status(200).json({ success: true, message: `Art ${id} is updated` });
};

// const getArtByStatus = (req, res) => {
// 	const { status } = req.query;
// 	const page = Number(req.query.page) || 1;

// 	if (!status) return res.status(400).json({ error: "status query is required." });

// 	const offset = calcOffset(page);
// 	const data = artModel.getArtByStatus(status, offset);

// 	return res.status(200).json(data);
// };

export default { getArts, getOneArt, createArt, updateArt };
