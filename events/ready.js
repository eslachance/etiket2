const { cloneDeep } = require("lodash");

module.exports = async client => {
  await client.wait(1000);

  const update = async () => {
    client.appInfo = await client.fetchApplication();
  };
  setInterval(update, 60000);
  await update();
  
  if(client.dbl) {
    client.dbl.postStats(client.guilds.cache.size);
  }

  require("../modules/dashboard")(client);  

  client.user.setActivity(`${client.config.defaultSettings.prefixes[0]}help | ${client.guilds.cache.size} Servers`);

  client.log("log", `${client.user.tag}, ready to serve ${client.getAllMembers()} users in ${client.guilds.cache.size} servers.`, "Ready!");
};
