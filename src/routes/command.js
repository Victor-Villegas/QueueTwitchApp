const express = require('express');
const router = express.Router();

const commands = {
  adduser: {
    response: 'Hello'
  }
};

router.get('/', (req, res) => {
  const { response } = commands[req.query.q] || { response: 'This command doesn\'t exist' };

  if (typeof response === 'function') {
    res.send(response());
  } else if (typeof response === 'string') {
    res.send(response);
  }
});

module.exports = router;
