CREATE TABLE IF NOT EXISTS gene_annotations (
    id INTEGER PRIMARY KEY,
    chromosome_id TEXT,
    gene_id TEXT,
    species_id INTEGER,
    tool TEXT,
    evalue REAL,
    score REAL,
    description TEXT,
    FOREIGN KEY(species_id) REFERENCES species(id)
);

CREATE INDEX gene_annotations_index ON gene_annotations (chromosome_id, gene_id);
