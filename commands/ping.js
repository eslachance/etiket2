exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send(`Last API pings: \`${client.pings.map(p => `${p}ms`).join(" , ")}\`
Checking round-trip latency...`);
  msg.edit(`Last API pings: \`${client.pings.map(p => `${p}ms`).join(" , ")}\`
Pong! Bot's round-trip latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It... like... pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
