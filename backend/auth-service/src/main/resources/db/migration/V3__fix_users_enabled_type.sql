ALTER TABLE users
    ALTER COLUMN enabled TYPE BOOLEAN
    USING enabled::boolean;
