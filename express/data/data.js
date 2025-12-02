import publicArt from "./public-art.json" with {type: "json"};

import {DatabaseSync} from "node:sqlite";
import path from "node:path";

const db = new DatabaseSync(path.join(import.meta.dirname, "data.db"), {enableForeignKeyConstraints: false});

/*
    art
    art_artist
    artist
    locations
    photos
*/

db.prepare('DELETE FROM art_artist;').run();
db.prepare('DELETE FROM photos;').run();
db.prepare('DELETE FROM art;').run();
db.prepare('DELETE FROM artist;').run();
db.prepare('DELETE FROM locations;').run();


publicArt.forEach(item => {
    let existLoc = db.prepare(`
            SELECT location_id FROM locations
            WHERE 
                site_address = ?
                AND neighbourhood = ?
        `).all(
            item.siteaddress,
            item.neighbourhood
        );

    let locationId;

    if(existLoc.length > 0){
        locationId = existLoc[0].location_id;
    }else {
        let locationData = db.prepare(`
            INSERT INTO locations (
                site_address, 
                neighbourhood
            )
            VALUES(?,?);
        `).run(
            item.siteaddress,
            item.neighbourhood
        );

        locationId = locationData.lastInsertRowid;
    }

    let artData = db.prepare(`
        INSERT INTO art (
            title,
            artist_statement,
            status,
            location_id,
            year_of_installation
        ) VALUES(?,?,?,?,?);    
    `).run(
        item.title_of_work || null,
        item.artistprojectstatement || null,
        item.status,
        locationId,
        item.yearofinstallation || null
    );

    let artId = artData.lastInsertRowid;

    if(Array.isArray(item.artists)){
        item.artists.forEach(artistId => {
            // https://www.delftstack.com/howto/sqlite/sqlite-insert-or-ignore/
            db.prepare(`
                INSERT OR IGNORE INTO artist (artist_id, name)
                VALUES(?, NULL);
            `).run(
                Number(artistId) 
            );

            db.prepare(`
                INSERT INTO art_artist (art_id, artist_id)
                VALUES(?, ?);
            `).run(artId, Number(artistId));
        })
    }

    let photo = item.photourl;

    if(photo) {
        db.prepare(`
            INSERT INTO photos (
                art_id,
                width,
                height,
                photo_url
            )
            VALUES(?,?,?,?);
        `).run(
            artId,
            photo.width || null,
            photo.height || null,
            photo.url || null
        );
    }
});


