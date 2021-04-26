const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/obs', async (req, res) => {
  const queueUsers = await pool.query('SELECT display_name FROM queue_users ORDER BY created_at ASC LIMIT 0, 10');

  res.render('links/obs', { queueUsers });
});

router.post('/obs', async (req, res) => {
  const queueUsers = await pool.query('SELECT display_name FROM queue_users ORDER BY created_at ASC LIMIT 0, 10');

  res.send(queueUsers);
});

module.exports = router;
