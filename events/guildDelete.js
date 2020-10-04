// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  if(!guild.available) return;
  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.cache.size} Servers`);

  // Well they're gone. Let's remove them from the settings!
  client.settings.delete(guild.id);
  if(client.dbl) {
    client.dbl.postStats(client.guilds.cache.size);
  }
};
