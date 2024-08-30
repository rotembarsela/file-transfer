CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,                     
    filename VARCHAR(255) NOT NULL,           
    filepath VARCHAR(255) NOT NULL,            
    upload_time TIMESTAMPTZ NOT NULL,          
    expiry_time TIMESTAMPTZ NOT NULL,          
    hash VARCHAR(64) UNIQUE NOT NULL          
);