import { DatabaseSync } from "node:sqlite";
import path from "node:path";
const db = new DatabaseSync(path.join(import.meta.dirname, "../data/data.db"));

// https://www.sqlitetutorial.net/sqlite-functions/sqlite-lower/

const getArts = (status, offset) => {
	if (status) {
		return db
			.prepare("SELECT * FROM overview WHERE LOWER(status) = LOWER(?) ORDER BY art_id ASC LIMIT 10 OFFSET ?")
			.all(status, offset);
	}
	return db.prepare("SELECT * FROM overview ORDER BY art_id ASC LIMIT 10 OFFSET ?").all(offset);
};
const getOneArt = (id) => {
	const data = db.prepare("SELECT * FROM detail_overview WHERE art_id = ?").get(id);

	if (!data) {
		return null;
	}

	// reshaped to use it easily in frontend
	const {
		art_id,
		title,
		artist_statement,
		status,
		year_of_installation,
		site_address,
		neighbourhood,
		width,
		height,
		photo_url,
	} = data;

	return {
		art_id,
		title,
		artist_statement,
		status,
		year_of_installation,
		location: {
			site_address,
			neighbourhood,
		},
		photo: {
			width,
			height,
			photo_url,
		},
	};
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values

const updateArt = (id, payload) => {
	const fields = Object.keys(payload)
		.map((key) => `${key} = ?`)
		.join(", ");

	const values = Object.values(payload);
	const data = db.prepare(`UPDATE art SET ${fields} WHERE art_id = ?`);

	return data.run(...values, id);
};

// const getArtByStatus = (status, offset) => {
// 	return db
// 		.prepare("SELECT * FROM overview WHERE status = ? ORDER BY art_id ASC LIMIT 10 OFFSET ?")
// 		.all(status, offset);
// };

/*
	Aggregation, GROUPBY and JOIN
	It will not be used for any endpoints.
	only for meeting DB project.
*/
const countArtsByNeighbourhood = () => {
	return db
		.prepare(
			`
			SELECT neighbourhood, COUNT(*) AS total_art 
			FROM locations
			JOIN art ON art.location_id = locations.location_id
			GROUP BY neighbourhood
			ORDER BY total_art DESC;
  			`
		)
		.all();
};

// Transaction
/*
	one of fields is not working, whole of it will be rollback.
	it will be used in create art.
*/
const createArt = (payload) => {
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
	} = payload;

	try {
		db.exec("BEGIN TRANSACTION");

		// location
		const loc = db
			.prepare(
				`
				INSERT INTO locations (site_address, neighbourhood)
				VALUES(?, ?);
			`
			)
			.run(site_address, neighbourhood);

		const location_id = loc.lastInsertRowid;

		// art
		const art = db
			.prepare(
				`
            INSERT INTO art (title, artist_statement, status, location_id, year_of_installation)
            VALUES (?, ?, ?, ?, ?)
        		`
			)
			.run(title, artist_statement, status, location_id, year_of_installation);

		const art_id = art.lastInsertRowid;

		db.prepare(
			`
            INSERT INTO photos (art_id, width, height, photo_url)
            VALUES (?, ?, ?, ?)
        	`
		).run(art_id, width, height, photo_url);

		db.exec("COMMIT");

		return { success: true, art_id };
	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	}
};

export default { getArts, getOneArt, createArt, updateArt };
