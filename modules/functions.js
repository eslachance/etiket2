const fs = require("fs");
const justLoaded = [];
const { isArray, isNil, cloneDeep, pickBy } = require("lodash");

module.exports = (client) => {

  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  client.log = (type, msg, title) => {
    if (!title) title = "Log";
    console.log(`[${type}] [${title}]${msg}`);
  };

  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`${process.cwd()}/commands/${commandName}`);
      client.log("log", `Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    const command = client.commands.get(commandName);
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) {
      await command.shutdown(client);
    }
    command.conf.aliases.forEach(alias => {
      client.aliases.delete(alias);
    });
    client.commands.delete(command.help.name);
    delete require.cache[require.resolve(`${process.cwd()}/commands/${command.help.name}.js`)];
    return false;
  };

  client.watchCommand = (commandName) => {
    fs.watch(`./commands/${commandName}`, async (type, filename) => {

      /* This is because windows sucks and will send 2 events for any change */
      if (justLoaded.indexOf(filename) > -1) return;
      justLoaded.push(filename);
      setTimeout( () => {
        justLoaded.splice(justLoaded.indexOf(filename), 1);
      }, 250);
      /* end block. But windows never stops sucking.*/

      try {
        const name = commandName.split(".")[0];
        if (client.commands.has(name)) {
          await client.unloadCommand(name);
        }
        await client.loadCommand(commandName);
      } catch (e) {
        client.log("ERR", `Unable to reload command ${commandName}: ${e.stack}`);
      }
    });
    return client.loadCommand(commandName);
  };

  client.getSettings = (guild) => {
    const defaults = client.config.defaultSettings;
    if (!guild) return defaults;
    return client.settings.get(guild.id);
  };

  client.writeSettings = (id, newSettings) => {
    const defaults = client.config.defaultSettings;
    let settings = client.settings.get(id) || {};
    client.settings.set(id, {
      ...pickBy(settings, (v, k) => !isNil(defaults[k])),
      ...pickBy(newSettings, (v, k) => !isNil(defaults[k]))
    });
  };

  client.validateThrottle = (message, level) => {
    if (client.blacklist.has(`${message.guild.id}-${message.author.id}`)) {
      return [false, "blacklisted"];
    }
    if (client.cooldown.has(message.author.id)) {
      return [false, "throttled"];
    } else if (level < 2) {
      client.cooldown.add(message.author.id);
      const { cooldown } = client.getSettings(message.guild);
      setTimeout(() => {
        client.cooldown.delete(message.author.id);
      }, cooldown);
    }
    return [true, null];
  };

  client.getPrefix = (message) => {
    const { prefixes } = client.getSettings(message.guild);
    if(!isArray(prefixes)) {
      return message.content.startsWith(prefixes);
    }
    return prefixes.find((prefix) => message.content.startsWith(prefix));
  };
  
  ''.constructor.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  [].constructor.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require("util").promisify(setTimeout);
  
  client.getAllMembers = () => client.guilds.cache.reduce((x, y) => x + y.memberCount, 0);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Uncaught Promise Error: ", err);
    console.dir(err);
    process.exit(1);
  });
};
