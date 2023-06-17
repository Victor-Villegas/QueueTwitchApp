function getTwitchUser ({ 'nightbot-user': user }) {
  return parse(user)
}

function getTwitchChannel ({ 'nightbot-channel': channel }) {
  return parse(channel)
}

function parse(queryString) {
  const params = new URLSearchParams(queryString);
  const object = {};

  params.forEach((value, key) => object[key] = value)

  return object;
}

module.exports = { getTwitchUser, getTwitchChannel };
