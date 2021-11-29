const express = require('express');
const commands = require('../lib/commandHandler');
const twitch = require('../lib/twitchCredentials');
const router = express.Router();
const { mode } = require('../../keys');
const alert = require('../../index');

let twitchUser;

router.get('/', async (req, res) => {
  try {
    twitchUser = twitch.getTwitchUser(req.headers);
  } catch (error) {
    if (!Number(mode.developer)) {
      return res.send('Acción bloqueada por administrador ᕦ(ò_óˇ)ᕤ');
    }

    // Si el modo developer esta activado se usa un header predefinido para trabajar desde el localhost
    const header = {
      'nightbot-user': 'name=t_songbird&displayName=T_Songbird&provider=twitch&providerId=195003953&userLevel=owner',
      'nightbot-channel': 'name=t_songbird&displayName=T_Songbird&provider=twitch&providerId=195003953'
    };
    twitchUser = twitch.getTwitchUser(header);
  }

  const requestOwner = twitchUser.displayName;

  // Obtener los valores del request que empieza por /?q=
  const { q: query } = req.query;

  if (query === undefined) {
    return res.send('No hay nada que ver aquí (￣o￣) . z Z');
  }

  const [command, message, userLevel] = query.split(' ');

  if (userLevel !== "subscriber" || userLevel !== "owner" || userLevel !== "moderator") {
    return res.send('Lo siento, debes estar subscrito para poder usar este comando (´･ω･`)?');
  }

  if (command === '') {
    return res.send('No tienes el suficiente poder para usar este comando ᕦ(ò_óˇ)ᕤ');
  }

  const { response } = commands[command] || { response: 'Este comando no existe ¯\\_(ツ)_/¯' };

  if (typeof response === 'function') {
    const data = await response(twitchUser, message, userLevel);

    if (typeof data === 'object') {
      if (data.sound === true) {
        alert.sound();
      } else {
        alert.refresh();
      }
      return res.send(`@${requestOwner}: ${data.message}`);
    }
    return res.send(`@${requestOwner}: ${data}`);

  } else if (typeof response === 'string') {
    return res.send(`@${requestOwner}: ${response}`);
  }
});

router.post('/', async (req, res) => {
  const { q: query } = req.query;
  const [, userId, method] = query.split(' ');

  const message = await commands.removeByName.response(userId, method);

  res.send(`${message.message}`);
});

module.exports = router;
