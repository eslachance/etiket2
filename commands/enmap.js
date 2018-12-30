const findEmbed = require("../modules/docs/findEmbed");

const randos = [
  "The hell you think this is, the dictionary? I don't know everything, and certainly not `{word}`!",
  "`{word}`? `{word}`???? Since when was *that* an enmap feature?",
  "I'll have you know, punk, that I only do Enmap, and `{word}` is definitely not enmap!"
];

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!client.docsEnabled) return;
  const embed = findEmbed(args.join(" "));
  const m = await message.channel.send(embed ? ({ embed }) : randos.random().replace(/{word}/g, args.join(" ")));
  client.docResponses.set(message.id, m.id);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ed','enmapdocs'],
  permLevel: "User"
};

exports.help = {
  name: "enmap",
  category: "Miscelaneous",
  description: "Displays Enmap Documentation (Updated from Github)",
  usage: "enmap <query>"
};
