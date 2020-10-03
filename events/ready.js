const { cloneDeep } = require("lodash");

module.exports = async client => {
  await client.wait(1000);

  const update = async () => {
    client.appInfo = await client.fetchApplication();
  };
  setInterval(update, 60000);
  await update();
  
  client.settings.ensure("defaults", cloneDeep(client.config.defaultSettings));
  client.dbl.postStats(client.guilds.size);

  require("../modules/dashboard")(client);  

  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.size} Servers`);

  client.log("log", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
};
