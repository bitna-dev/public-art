export const validateArtId = (req, res, next) => {
	const { id } = req.params;

	if (!id || Number.isNaN(Number(id)) || Number(id) <= 0) {
		return res.status(400).json({ error: "Invalid art id" });
	}

	next();
};

export const validateArtBody = (req, res, next) => {
	const {
		title,
		status,
		year_of_installation,
		artist_statement,
		site_address,
		neighbourhood,
		width,
		height,
		photo_url,
	} = req.body;

	if (title !== undefined && title.trim().length === 0)
		return res.status(400).json({ error: "Title must be longer than 1 character." });

	if (!status || status.trim().length === 0) return res.status(400).json({ error: "Status is required." });

	if (site_address !== undefined && site_address.trim().length === 0)
		return res.status(400).json({ error: "Site address must be longer than 1 character." });

	if (!neighbourhood || neighbourhood.trim().length === 0)
		return res.status(400).json({ error: "Neighbourhood is required." });

	if (year_of_installation !== undefined && isNaN(Number(year_of_installation)))
		return res.status(400).json({ error: "Year must be number." });

	if (artist_statement !== undefined && artist_statement.trim().length <= 10)
		return res.status(400).json({ error: "Artist statement must be longer than 10 characters." });

	if (width !== undefined && isNaN(Number(width))) return res.status(400).json({ error: "Width must be a number." });

	if (height !== undefined && isNaN(Number(height))) return res.status(400).json({ error: "Height must be a number." });

	if (photo_url !== undefined && photo_url.trim().length === 0)
		return res.status(400).json({ error: "Photo URL cannot be empty." });

	next();
};

export const validateEditArtBody = (req, res, next) => {
	const { title, status, year_of_installation, artist_statement } = req.body;

	if (title !== undefined && title.trim().length === 0) return res.status(400).json({ error: "Title is required." });
	if (status !== undefined && status.trim().length === 0) return res.status(400).json({ error: "Status is required." });

	if (year_of_installation !== undefined && isNaN(Number(year_of_installation)))
		return res.status(400).json({ error: "Year must be number." });

	if (artist_statement !== undefined && artist_statement.trim().length <= 10)
		return res.status(400).json({ error: "Artist statement must be longer than 10 characters." });

	if (!year_of_installation || isNaN(Number(year_of_installation)))
		return res.status(400).json({ error: "Year of installation must be a valid number." });

	next();
};
