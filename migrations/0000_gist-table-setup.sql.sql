-- Migration number: 0000 	 2024-02-09T13:23:53.214Z

CREATE TABLE IF NOT EXISTS gists
(
    gist_id           TEXT NOT NULL,
    gist_user         TEXT NOT NULL,
    title             TEXT NOT NULL,
    description       TEXT NOT NULL,
    file_reference    TEXT NOT NULL,
    file_human        TEXT NOT NULL,
    file_copilot      TEXT NOT NULL,
    file_ai_generated TEXT NOT NULL,
    PRIMARY KEY (gist_id, gist_user),
    check ( trim(gist_id) <> '' ),
    check ( trim(title) <> '' ),
    check ( trim(description) <> ''),
    check ( trim(gist_user) <> '' ),
    check ( trim(file_human) <> '' ),
    check ( trim(file_copilot) <> '' ),
    check ( trim(file_ai_generated) <> '' )
);
