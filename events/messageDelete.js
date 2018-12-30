module.exports = async (client, message) => {
  // For the docs command
  if (!message.author.bot && client.docsEnabled && client.docResponses.has(message.id)) {
    const msg = await message.channel.fetchMessage(client.docResponses.get(message.id)).catch();
    if (msg) msg.delete().catch();
  }
};
