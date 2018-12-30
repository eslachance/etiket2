const findEmbed = require("../modules/docs/findEmbed");

module.exports = async (client, om, nm) => {
  const settings = client.getSettings(nm.guild);
  nm.settings = settings;
  const prefix = client.getPrefix(nm);

  // For the docs command
  if (!nm.author.bot && nm.content.startsWith(prefix) && client.docsEnabled && client.docResponses.has(nm.id)) {
    const msg = await nm.channel.fetchMessage(client.docResponses.get(nm.id)).catch();
    if (!msg) return;
    const embed = findEmbed(nm.content.slice(prefix.length + 4).trim());
    const m = await msg.edit(embed ? ({ embed }) : "Not found!");
    client.docResponses.set(nm.id, m.id);
  }
};
