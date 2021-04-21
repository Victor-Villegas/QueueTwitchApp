const express = require('express');
const router = express.Router();

router.get('/kirzheka', (req, res) => {
  res.render('links/kirzheka');
});

module.exports = router;
