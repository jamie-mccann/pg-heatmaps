CREATE TABLE IF NOT EXISTS gene_expression (
    id INTEGER PRIMARY KEY,
    species_id INTEGER,
    experiment_id TEXT,
    chromosome_id TEXT,
    gene_id TEXT,
    stub TEXT,
    description TEXT,
    replicate_id INTEGER,
    result REAL,
    result_type TEXT,
    FOREIGN KEY(species_id) REFERENCES species(id)
);

CREATE INDEX gene_expression_index ON gene_expression (experiment_id, chromosome_id, gene_id);
