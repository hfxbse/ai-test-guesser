-- Migration number: 0001 	 2024-02-12T15:41:18.748Z

CREATE TABLE IF NOT EXISTS participants
(
    uuid          BLOB PRIMARY KEY,
    quiz_duration INT NOT NULL,
    date          DATETIME DEFAULT current_timestamp,
    check ( quiz_duration > 0 ),
    check ( length(uuid) = 16 )
);

CREATE TABLE IF NOT EXISTS snippet_responses
(
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    guess  TEXT NOT NULL,
    rating INT  NOT NULL,
    text   TEXT,

    check ( guess IN ('human', 'copilot', 'ai-generated')),
    check ( rating > 0 AND rating < 7 ),
    check ( text IS NULL OR length(text) <= 500 )
);

CREATE TABLE IF NOT EXISTS quiz_responses
(
    participant_uuid   BLOB NOT NULL,
    gist_id            TEXT NOT NULL,
    gist_user          TEXT NOT NULL,

    response_human     INT  NOT NULL,
    response_copilot   INT  NOT NULL,
    response_ai_generated INT  NOT NULL,

    FOREIGN KEY (response_human) REFERENCES snippet_responses (id),
    FOREIGN KEY (response_copilot) REFERENCES snippet_responses (id),
    FOREIGN KEY (response_ai_generated) REFERENCES snippet_responses (id),
    FOREIGN KEY (participant_uuid) REFERENCES participants (uuid),
    FOREIGN KEY (gist_id, gist_user) REFERENCES gists (gist_id, gist_user),

    PRIMARY KEY (participant_uuid, gist_id, gist_user)
);
