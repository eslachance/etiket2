const { isArray } = require("lodash");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  client.settings.forEach( (data, key) => {
    if(!client.guilds.get(key)) {
      console.log(`Skipping ${key} in conversion`);
      return data;
    }
    console.log(`Converting ${JSON.stringify(data)} for ${key}`);
    if(!isArray(data.modRoles)) {
      console.log(`ModRoles: ${data.modRoles} is a string.`);
      const role = client.guilds.get(key).roles.find(r => r.name === data.modRoles);
      if(role) data.modRoles = [role.id];
      else data.modRoles = [];
    }
    if(!isArray(data.adminRoles)) {
      console.log(`AdminRoles: ${data.adminRoles} is a string.`);
      const role = client.guilds.get(key).roles.find(r => r.name === data.adminRoles);
      if(role) data.adminRoles = [role.id];
      else data.adminRoles = [];
    }
    console.log(`Checking for channel ${data.modLogChannel} for ${key}`);
    if(client.guilds.get(key).channels.find(ch => ch.name === data.modLogChannel)) {
      const channel = client.guilds.get(key).channels.find(ch => ch.name === data.modLogChannel);
      console.log("Channel Found! ", channel.name);
      data.modLogChannel = channel.id;
    } else {
      console.log("Channel not found or null");
      data.modLogChannel = null;
    }
    const returnValue = {
      ...data,
      modLogChannel: data.modLogChannel ? client.guilds.get(key).channels.get(data.modLogChannel) : null,
      adminRoles: data.adminRoles.map(roleId => client.guilds.get(key).roles.get(roleId)),
      modRoles: data.modRoles.map(roleId => client.guilds.get(key).roles.get(roleId)),
    };
    console.log("Conversion Done");
    client.settings.set(key, returnValue);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "temp",
  category: "Miscelaneous",
  description: "uhhhh it's temporary.",
  usage: "temp"
};
