exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const inviteLink = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&response_type=code&redirect_uri=http%3A%2F%2Fetiket.evie.codes%2Fcallback`;
  message.channel.send(`To invite Etiket, click on the following link:\n<${inviteLink}>`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invite",
  category: "Miscelaneous",
  description: "Shows the link to invite this bot.",
  usage: "invite"
};
