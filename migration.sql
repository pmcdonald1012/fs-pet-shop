DROP TABLE IF EXISTS pets; 

CREATE TABLE pets (
    id SERIAL,
    name TEXT,
    kind TEXT,
    age INTEGER
);

INSERT INTO pets (name, kind, age) VALUES ('Justin', 'dog', 3);
INSERT INTO pets (name, kind, age) VALUES ('Cornflake', 'fish', 3);
INSERT INTO pets (name, kind, age) VALUES ('Orneals', 'bird', 5);
