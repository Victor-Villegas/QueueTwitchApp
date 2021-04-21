const express = require('express');
const commands = require('../lib/commandHandler');
const router = express.Router();

router.get('/', async (req, res) => {
  const { q: query } = req.query;
  console.log(req.headers);
  console.log(res.headers);

  if (query === undefined) {
    return res.send('No hay nada que ver aqui (￣o￣) . z Z');
  }

  const [command, name, message] = query.split(' ');

  if (command === '') {
    res.send('No tienes el suficiente poder para usar este comando ᕦ(ò_óˇ)ᕤ');
  }

  const { response } = commands[command] || { response: 'This command doesn\'t exist' };

  if (typeof response === 'function') {
    res.send(`@${name}: ${await response(command, name, message)}`);
  } else if (typeof response === 'string') {
    res.send(response);
  }
});

module.exports = router;
