const findEmbed = require("../modules/docs/findEmbed");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!client.docsEnabled) return;
  const embed = findEmbed(args.join(" "));
  const m = await message.channel.send(embed ? ({ embed }) : "Not found!");
  client.docResponses.set(message.id, m.id);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "docs",
  category: "Miscelaneous",
  description: "Brings Enmap documentation to Discord.",
  usage: "docs <query>"
};
