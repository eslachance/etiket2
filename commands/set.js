const { inspect } = require("util");


exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
  
  // Retrieve current guild settings
  const settings = message.settings;
  const defaults = client.settings.get("defaults");
  if(!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

  const copyKey = (key, prop) => {
    client.settings.setProp(key, prop, defaults[prop]);
  }

  // Secondly, if a user does `-set edit <key> <new value>`, let's change it
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    settings[key] = value.join(" ");

    client.settings.set(message.guild.id, settings);
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else
  
  if(action === "add" || action === "push") {
    if (!key) return message.reply("Please specify a key to delete (reset).");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (settings[key].constructor.name !== "Array") return message.reply("Key is not an array");
    if (settings[key].indexOf(value) > -1) return message.reply("The value is already in this key");
    copyKey(message.guild.id, key);
    try {
      console.log(`Attempting to push ${value} into ${key}`);
      client.settings.pushIn(message.guild.id, key, value.join(" "));
    } catch(e) {
      return message.reply("Error occured while pushing to array: " + e);
    }
    return message.reply(`${value} has been added to ${key} for this guild.`);
  } else
    
  if(action === "remove") {
    if (!key) return message.reply("Please specify a key to delete (reset).");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (settings[key].constructor.name !== "Array") return message.reply("Key is not an array");
    if (settings[key].indexOf(value) < 0) return message.reply("The value is not in this key");
    copyKey(message.guild.id, key);
    try {
      console.log(`Attempting to remove ${value} from ${key}`);
      client.settings.removeFrom(message.guild.id, key, value.join(" "));
    } catch(e) {
      return message.reply("Error occured while removing from array: " + e);
    }
    return message.reply(`${value} has been remove from ${key} for this guild.`);
  } else
  
  
  if (action === "del" || action === "reset") {
    if (!key) return message.reply("Please specify a key to delete (reset).");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    
    const response = await client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

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
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);

  } else {
    await message.channel.send(`***__Current Guild Settings__***\n\`\`\`json\n${inspect(settings)}\n\`\`\``);
    message.channel.send(`See the Dashboard on <${client.config.dashboard.callbackURL.split("/").slice(0, -1).join("/")}>`);
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
  usage: "set <view/get/edit> <key> <value>"
};
