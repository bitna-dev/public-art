import artModel from "../models/artModel.js";

const calcOffset = (page) => {
	return (page - 1) * 10;
};

const getArts = (req, res) => {
	const page = req.query.page || 1;
	const offset = calcOffset(page);
	const status = req.query.status ? req.query.status : "";

	const data = artModel.getArts(status, offset);
	res.status(200).json(data);
};

const getOneArt = (req, res) => {
	const { id } = req.params;
	const data = artModel.getOneArt(id);

	if (!data)
		return res.status(404).json({
			message: "No art found",
		});

	res.status(200).json(data);
};

const createArt = (req, res) => {
	try {
		const payload = req.body;
		const data = artModel.createArt(payload);
		res.status(201).json({ success: true, ...data });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, error: "Failed to create art" });
	}
};

const updateArt = (req, res) => {
	try {
		const { id } = req.params;
		const data = artModel.updateArt(id, req.body);
		if (data.changes == 0) {
			return res.status(404).json({ success: false, error: "Art not found" });
		}
		return res.status(200).json({ success: true, message: `Art ${id} is updated.` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, error: "Failed to update art" });
	}
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
