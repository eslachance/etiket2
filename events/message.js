// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const settings = client.getSettings(message.guild.id);
  message.settings = settings;

  const prefix = client.getPrefix(message);
  if (!prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (message.guild && !message.member) await message.guild.members.fetch(message.author);
  const level = client.permlevel(message);

  const [valid, status] = client.validateThrottle(message, level, command);
  if (!valid) {
    switch (status) {
      case "blacklisted":
        return message.react("🚫");
      case "throttled":
        if (message.guild) {
          return message.react("⏱");
        }
        break;
    }
  }

  if (client.tags.has(`${message.guild.id}-${command}`)) {
    return message.channel.send(client.tags.get(`${message.guild.id}-${command}`).content);
  }

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
  if (level < client.levelCache[cmd.conf.permLevel]) {
    return message.react("🚫");
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.log("log", `${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
  cmd.run(client, message, args, level);
};
