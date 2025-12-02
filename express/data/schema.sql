-- DROP TABLES if they exist to rerun the schema
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS art_artist;
DROP TABLE IF EXISTS art;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS artist;

/*
    artist table contains artist_id and name.
    It stores each artist minimum information.
    It extracted from JSON artist array to remove repeating group.
*/
CREATE TABLE artist (
    artist_id                   INTEGER,
    name                        TEXT,
    PRIMARY KEY (artist_id)
);

/*
    locations table stores location information of each arts.
    site_address and neighbourhood were from art table to solve 3NF.
*/
CREATE TABLE locations (
    location_id                 INTEGER,
    site_address                TEXT,
    neighbourhood               TEXT,
    PRIMARY KEY (location_id)
);

/*
    created own primary key(not from original data such as registry key), used only necessary and miniaml fields.
    set a primary key as art_id, foreign key is location_id from locations.
    status must not be null as art always have a classifications.
*/
CREATE TABLE art (
    art_id                      INTEGER,
    title                       TEXT,
    artist_statement            TEXT,
    status                      TEXT NOT NULL,
    location_id                 INTEGER NOT NULL,
    year_of_installation        INTEGER,
    PRIMARY KEY (art_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

/*
    Composite PK ensures uniqueness.
    resolve M:N relationship between art and artist.
*/
CREATE TABLE art_artist (
    art_id                      INTEGER,
    artist_id                   INTEGER,
    PRIMARY KEY (art_id, artist_id),
    FOREIGN KEY (art_id) REFERENCES art(art_id),
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id)
);

/*
    stores photos related to each arts.
    It was in nested objects, so it's created to store the data atomically.
*/
CREATE TABLE photos (
    photo_id                    INTEGER,
    art_id                      INTEGER NOT NULL,
    width                       INTEGER,
    height                      INTEGER,
    photo_url                   TEXT,
    PRIMARY KEY(photo_id),
    FOREIGN KEY (art_id) REFERENCES art(art_id)
);


-- INDEX
-- to find neighbourhood faster
CREATE INDEX idx_locations_neighbourhood ON locations(neighbourhood);
-- to filter by status faster
CREATE INDEX idx_art_status ON art(status);

-- VIEW
-- Created a overview view to shorten the query for fullstack API in artMode.js, this is used by getArts.
DROP VIEW IF EXISTS overview;
CREATE VIEW overview AS 
    SELECT 
        art.art_id,
        art.title,
        locations.neighbourhood,
        art.status
    FROM art 
    JOIN locations ON art.location_id = locations.location_id;
   


-- VIEW FOR DETAIL   
/* 
    Created a detail overview to shorten the query in artModel.js, used by getOneArt.
*/
DROP VIEW IF EXISTS detail_overview;
CREATE VIEW detail_overview AS
    SELECT 
        art.art_id,
        art.title,
        art.artist_statement,
        art.status,
        art.year_of_installation,
        art.location_id,
        locations.site_address,
        locations.neighbourhood,
        photos.width,
        photos.height,
        photos.photo_url
    FROM art
    JOIN locations ON art.location_id = locations.location_id  
    LEFT JOIN photos ON art.art_id = photos.art_id;

-- TRIGGER: when title NULL/"" in art -> update title "untitled"
CREATE TRIGGER untitled_art_title 
AFTER INSERT ON art 
    FOR EACH ROW
    WHEN NEW.title IS NULL OR trim(NEW.title) = ''
    BEGIN
        UPDATE art
        SET title = 'Untitled'
        WHERE art_id = NEW.art_id;
    END;


