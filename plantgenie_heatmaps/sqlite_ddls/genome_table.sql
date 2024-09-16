CREATE TABLE IF NOT EXISTS genomes (
    id INTEGER PRIMARY KEY,
    species_id INTEGER,
    version TEXT,
    description TEXT,
    doi TEXT,
    publication_date INTEGER,
    FOREIGN KEY(species_id) REFERENCES species(id)
);
