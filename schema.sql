-- Drop table if it exists to avoid errors when rerunning
DROP TABLE IF EXISTS quote_requests;

-- Create the quote_requests table
CREATE TABLE quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    comments TEXT,
    document_list TEXT, -- Stored as a JSON string of filenames
    source_language TEXT,
    target_language TEXT,
    word_count INTEGER,
    service_type TEXT, -- Basic, Professional, Premium
    status TEXT DEFAULT 'new', -- new, quoted, accepted, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 