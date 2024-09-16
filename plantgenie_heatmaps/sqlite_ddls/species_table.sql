CREATE TABLE IF NOT EXISTS species (
    id INTEGER PRIMARY KEY,
    genus TEXT,
    species TEXT,
    abbreviation TEXT,
    genome_size REAL,
    genome_size_units TEXT,
);
