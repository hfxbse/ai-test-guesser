-- Migration number: 0002 	 2024-02-13T09:29:29.410Z

CREATE TABLE IF NOT EXISTS surveys
(
    participant_uuid        BLOB PRIMARY KEY,

    experience_coding       INT  NOT NULL,
    experience_professional INT  NOT NULL,

    ai_use_before           TEXT NOT NULL,
    ai_use_current          TEXT NOT NULL,

    FOREIGN KEY (participant_uuid) REFERENCES participants (uuid),
    check ( experience_coding >= 0 AND experience_coding <= 150 ),
    check ( experience_professional >= 0 AND experience_professional <= 150 ),
    check ( ai_use_before IN ('yes', 'no') ),
    check ( ai_use_current IN ('never', 'rarely', 'often', 'daily') )
);
