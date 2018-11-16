// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  if(!guild.available) return;
  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.size} Servers`);

  // Well they're gone. Let's remove them from the settings!
  client.settings.delete(guild.id);
  client.dogstats.increment("bot.guildDelete");
};
