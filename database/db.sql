CREATE TABLE users(
  id INT(10) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  name VARCHAR(150) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  provider_id VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE queue_users(
  id INT(10) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  name VARCHAR(150) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  provider_id VARCHAR(100) NOT NULL,
  message VARCHAR(100) NOT NULL
);

ALTER TABLE queue_users
  ADD PRIMARY KEY (id);

ALTER TABLE queue_users
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE user_stats(
  id INT(10) NOT NULL,
  name VARCHAR(150) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  provider_id VARCHAR(100) NOT NULL,
  readings INT(10) NOT NULL
);

ALTER TABLE user_stats
  ADD PRIMARY KEY (id);

ALTER TABLE user_stats
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE queue_stats(
  id INT(10) NOT NULL,
  stat INT(10) NOT NULL
);

ALTER TABLE queue_stats
  ADD PRIMARY KEY (id);

ALTER TABLE queue_stats
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;  

INSERT INTO queue_stats (stat) VALUES(0);
INSERT INTO queue_stats (stat) VALUES(0);
