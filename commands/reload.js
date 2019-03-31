exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  if (!args || args.size < 1) return message.reply("Must provide a command to reload. Derp.");
  const msg = await message.channel.send(`Attempting to reload ${args[0]}...`);
  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  const commandName = command.help.name;

  let response = await client.unloadCommand(commandName);
  if (response) return msg.edit(`Error Unloading: ${response}`);

  response = client.loadCommand(commandName);
  if (response) return msg.edit(`Error Loading: ${response}`);

  msg.edit(`The command \`${args[0]}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command that's been modified.",
  usage: "reload [command]"
};
