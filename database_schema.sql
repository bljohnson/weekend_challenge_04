-- Command to create new database in Postico
CREATE DATABASE weekend_challenge_04;

-- Command to create new table in Postico
CREATE TABLE list
( id SERIAL PRIMARY KEY NOT NULL,
  task VARCHAR(30) UNIQUE,
  category VARCHAR(30),
  completed BOOLEAN
);
