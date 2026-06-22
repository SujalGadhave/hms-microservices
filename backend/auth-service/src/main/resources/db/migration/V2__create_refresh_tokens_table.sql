CREATE TABLE refresh_tokens (

    id VARCHAR(255) PRIMARY KEY,

    token VARCHAR(1000) NOT NULL UNIQUE,

    user_email VARCHAR(255) NOT NULL,

    expiry_date TIMESTAMP NOT NULL
);