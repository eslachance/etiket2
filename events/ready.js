module.exports = async client => {
  await client.wait(1000);

  const update = async () => {
    client.appInfo = await client.fetchApplication();
    client.dogstats.gauge("bot.users", client.guilds.reduce((p, c) => p + c.memberCount, 0));
    client.dogstats.gauge("bot.guilds", client.guilds.size);
    client.dogstats.gauge("etiket.globalTags", client.tags.size);
  };
  setInterval(update, 60000);
  await update();
  
  client.settings.ensure("defaults", client.config.defaultSettings);

  require("../modules/dashboard")(client);  

  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.size} Servers`);

  client.log("log", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
};
