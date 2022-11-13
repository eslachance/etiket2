const { cloneDeep } = require("lodash");

// FUCKING UGH
const keyTypes = {
  'modLogChannel': {
    type: 'TextChannel',
    check: (data, message) => {
      if(message.mentions.channels.size === 1) return message.mentions.channels.first();
      if(!data) return null;
      if(typeof data === 'string') {
        return message.guild.channels.cache.get(data) || message.guild.channels.find(c => c.name === data);
      }
      return null;
    },
    display: (data) => data ? `#${data.name}` : 'none',
  },
  'modRoles': {
    type: 'Role',
    check: (data, message) => {
      if(message.mentions.roles.size === 1) return message.mentions.roles.first();
      if(!data) return null;
      if(typeof data === 'string') {
        return message.guild.roles.cache.get(data) || message.guild.roles.find(c => c.name === data);
      }
      return null;
    },
    checkDupe: (arr, data) => {
      return arr.find(el => el.id === data.id);
    },
    display: (data) => data.map(d => d ? `@${d.name}` : '').join(', '),
  },
  'adminRoles': {
    type: 'Role',
    check: (data, message) => {
      if(message.mentions.roles.size === 1) return message.mentions.roles.first();
      if(!data) return null;
      if(typeof data === 'string') {
        return message.guild.roles.cache.get(data) || message.guild.roles.find(c => c.name === data);
      }
      return null;
    },
    checkDupe: (arr, data) => {
      return arr.find(el => el.id === data.id);
    },
    display: (data) => data.map(d => d ? `@${d.name}` : '').join(', '),
  },
  'prefixes': {
    type: "String",
    check: data => typeof data === "string" ? data : null,
    checkDupe: (arr, data) => {
      return arr.indexOf(data) > -1;
    },
    display: (data) => data.join(" "),
  },
  'cooldown': {
    type: "Integer",
    check: data => isNaN(data) ? 2500 : Number(data),
    display: data => data.toString(),
  }
};

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
  
  value = value.length > 1 ? value.join(" ") : value[0];
  const settings = client.settings.get(message.guild.id);

  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!settings.hasOwnProperty(key)) return message.reply("This key does not exist in the settings");
    if (!value) return message.reply("Please specify a new value");
    if (settings[key].constructor.name === "Array") return message.reply("This setting is an array, please use `add` and `remove` to modify it.");
    
    value = keyTypes[key].check(value, message);
    if(!value) {
      return message.reply(`The value was not valid, expected a ${keyTypes[key].type}`);
    }
    client.settings.set(message.guild.id, value, key);
    message.reply(`${key} successfully edited to ${value}`);
  } else
  
  if(action === "add" || action === "push") {
    if (!key) return message.reply("Please specify a key to add.");
    if (!settings.hasOwnProperty(key)) return message.reply("This key does not exist in the settings");
    if (settings[key].constructor.name !== "Array") return message.reply("Key is not an array");
    
    value = keyTypes[key].check(value, message);
    if(!value) {
      return message.reply(`The value was not valid, expected a ${keyTypes[key].type}`);
    }
    if(keyTypes[key].checkDupe(settings[key], value)) {
      return message.reply("The value is already in this key");
    }
    
    try {
      client.settings.push(message.guild.id, value, key);
    } catch(e) {
      return message.reply("Error occured while pushing to array: " + e);
    }
    return message.reply(`${value} has been added to ${key} for this guild.`);
  } else
    
  if(action === "remove") {
    if (!key) return message.reply("Please specify a key to remove.");
    if (!settings.hasOwnProperty(key)) return message.reply("This key does not exist in the settings");
    if (settings[key].constructor.name !== "Array") return message.reply("Key is not an array");

    value = keyTypes[key].check(value, message);
    if (!value) {
      return message.reply(`The value was not valid, expected a ${keyTypes[key].type}`);
    }

    if (!keyTypes[key].checkDupe(settings[key], value)) {
      return message.reply("The value is not in this key");
    }

    try {
      client.settings.remove(message.guild.id, value, key);
    } catch(e) {
      return message.reply("Error occured while removing from array: " + e);
    }
    return message.reply(`${value} has been remove from ${key} for this guild.`);
  } else
  
  
  if (action === "del" || action === "reset") {
    if (!key) return message.reply("Please specify a key to delete (reset).");
    if (!settings.hasOwnProperty(key)) return message.reply("This key does not exist in the settings");
    
    const response = await client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${client.config.defaultSettings[key]}\`?`);

    if (["y", "yes"].includes(response)) {
      delete settings[key];
      client.settings.set(message.guild.id, settings);
      message.reply(`${key} was successfully deleted.`);
    } else
    if (["n","no","cancel"].includes(response)) {
      message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings.hasOwnProperty(key)) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);

  } else {
    const guildSettings = Object.entries(settings)
      .map(([key, value]) => `${key}: ${keyTypes[key].display(value)}`)
      .join('\n');
    await message.channel.send(`***__Current Guild Settings__***
\`\`\`
${guildSettings}
\`\`\`
See the Dashboard on <${client.config.dashboard.callbackURL.split("/").slice(0, -1).join("/")}>`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit/add/remove/delete> <key> <value>"
};
