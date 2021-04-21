const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/kirzheka', async (req, res) => {
  const queueUsers = await pool.query('SELECT display_name, users.id, queue_users.message FROM users JOIN queue_users ON queue_users.user_id = users.id ORDER BY queue_users.created_at ASC LIMIT 0, 10');
  const allUsers = await pool.query('SELECT display_name FROM users WHERE id NOT IN (SELECT user_id FROM queue_users) ORDER BY created_at ASC');
  const count = await pool.query('SELECT COUNT(id) AS qty FROM queue_users');

  res.render('links/kirzheka', { queueUsers, allUsers, count });
});

router.post('/kirzheka', async (req, res) => {
  const queueUsers = await pool.query('SELECT display_name, users.id, queue_users.message FROM users JOIN queue_users ON queue_users.user_id = users.id ORDER BY queue_users.created_at ASC LIMIT 0, 10');
  const allUsers = await pool.query('SELECT display_name FROM users WHERE id NOT IN (SELECT user_id FROM queue_users) ORDER BY created_at ASC');
  const count = await pool.query('SELECT COUNT(id) AS qty FROM queue_users');

  res.send({ queueUsers, allUsers, count });
});

module.exports = router;
