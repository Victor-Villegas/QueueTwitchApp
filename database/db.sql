CREATE TABLE users(
  id INT(10) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  name VARCHAR(150) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE queue_users(
  id INT(10) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  user_id INT(10) NOT NULL,
  message VARCHAR(150) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE queue_users
  ADD PRIMARY KEY (id);

ALTER TABLE queue_users
  MODIFY id INT(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
