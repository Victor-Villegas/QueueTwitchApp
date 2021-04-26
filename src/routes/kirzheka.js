const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/kirzheka', async (req, res) => {
  const queueUsers = await pool.query('SELECT name, display_name, message FROM queue_users ORDER BY created_at ASC LIMIT 0, 10');
  const users = await pool.query('SELECT display_name FROM users ORDER BY created_at ASC');
  const count = await pool.query('SELECT COUNT(id) AS qty FROM queue_users');

  res.render('links/kirzheka', { queueUsers, users, count });
});

router.post('/kirzheka', async (req, res) => {
  const queueUsers = await pool.query('SELECT name, display_name, message FROM queue_users ORDER BY created_at ASC LIMIT 0, 10');
  const users = await pool.query('SELECT display_name FROM users ORDER BY created_at ASC');
  const count = await pool.query('SELECT COUNT(id) AS qty FROM queue_users');

  res.send({ queueUsers, users, count });
});

module.exports = router;
