function getTwitchUser ({ 'nightbot-user': user }) {
  const regex = /.(?<=&|^.).*?(?==)./;
  const [, name, displayName, provider, providerId, userLevel] = user.split(regex);
  return { name, displayName, provider, providerId, userLevel };
}

function getTwitchChannel ({ 'asdasnightbot-channel': channel }) {
  const regex = /.(?<=&|^.).*?(?==)./;
  const [, name, displayName, provider, providerId] = channel.split(regex);
  return { name, displayName, provider, providerId };
}

module.exports = { getTwitchUser, getTwitchChannel };
