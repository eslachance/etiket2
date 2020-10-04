// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  if(!guild.available) return;
  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.cache.size} Servers`);
  client.log("log", `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount} members.`, "JOINED");
  if(client.dbl) {
    client.dbl.postStats(client.guilds.cache.size);
  }
};
