const findEmbed = require("../modules/docs/findEmbed");

const randos = [
  "The hell you think this is, the dictionary? I don't know everything, and certainly not `{word}`!",
  "`{word}`? `{word}`???? Since when was *that* an enmap feature?",
  "I'll have you know, punk, that I only do Enmap, and `{word}` is definitely not enmap!"
];

module.exports = async (client, om, nm) => {
  const settings = client.getSettings(nm.guild);
  nm.settings = settings;
  const prefix = client.getPrefix(nm);

  // For the docs command
  if (!nm.author.bot && client.docsEnabled && nm.content.startsWith(prefix)) {
    const query = nm.content.slice(prefix.length).trim().split(/ +/).slice(1).join(" ");
    const embed = findEmbed(query);
    if (client.docResponses.has(nm.id)) {
      const msg = await nm.channel.fetchMessage(client.docResponses.get(nm.id)).catch(() => null);
      if (msg) {
        const m = await msg.edit(embed ? ({ embed }) : randos.random().replace(/{word}/g, query));
        return client.docResponses.set(nm.id, m.id);
      }
    }
    const m = await nm.channel.send(embed ? ({ embed }) : randos.random().replace(/{word}/g, query));
    client.docResponses.set(nm.id, m.id);
  }
};
