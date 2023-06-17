function getTwitchUser ({ 'nightbot-user': user }) {
  return parse(user)
}

function getTwitchChannel ({ 'nightbot-channel': channel }) {
  return parse(channel)
}

function parse(queryString) {
  const params = new URLSearchParams(queryString);
  const object = {};

  for (const [key, value] of params) {
    if (object[key]) {
      if (Array.isArray(object[key])) {
        object[key].push(value);
      } else {
        object[key] = [object[key], value];
      }
    } else {
      object[key] = value;
    }
  }

  return object;
}

module.exports = { getTwitchUser, getTwitchChannel };
