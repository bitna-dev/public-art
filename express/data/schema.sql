DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS art_artist;
DROP TABLE IF EXISTS art;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS artist;

CREATE TABLE artist (
    artist_id                   INTEGER,
    name                        TEXT,
    PRIMARY KEY (artist_id)
);

CREATE TABLE locations (
    location_id                 INTEGER,
    site_address                TEXT,
    neighbourhood               TEXT,
    PRIMARY KEY (location_id)
);

CREATE TABLE art (
    art_id                      INTEGER,
    title                       TEXT,
    artist_statement            TEXT,
    status                      TEXT,
    location_id                 INTEGER,
    year_of_installation        INTEGER,
    PRIMARY KEY (art_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE art_artist (
    art_id                      INTEGER NOT NULL,
    artist_id                   INTEGER NOT NULL,
    PRIMARY KEY (art_id, artist_id),
    FOREIGN KEY (art_id) REFERENCES art(art_id),
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id)
);

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
CREATE INDEX idx_locations_neighbourhood ON locations(neighbourhood);

-- VIEW
DROP VIEW IF EXISTS overview;
CREATE VIEW overview AS 
    SELECT 
        art.art_id,
        art.title,
        locations.neighbourhood,
        art.status
    FROM art 
    JOIN locations ON art.location_id = locations.location_id;
   


--VIEW FOR DETAIL   
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


