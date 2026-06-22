CREATE TABLE patients (

    id VARCHAR(255) PRIMARY KEY,

    first_name VARCHAR(255) NOT NULL,

    last_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    phone VARCHAR(50) NOT NULL,

    date_of_birth DATE NOT NULL,

    gender VARCHAR(20) NOT NULL,

    address TEXT,

    active BOOLEAN NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);