ALTER TABLE observations ADD COLUMN fruit_weight_g DECIMAL(8,2) NULL;
ALTER TABLE observations ADD COLUMN fruit_size_cm DECIMAL(6,2) NULL;
ALTER TABLE predictions ADD COLUMN category VARCHAR(80) NULL;
ALTER TABLE predictions ADD COLUMN confidence DECIMAL(5,2) NULL;
