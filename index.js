const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = new Discord.Client();
const { clone, cloneDeep } = require("lodash");
const DBL = require("dblapi.js");
const Enmap = require("enmap");

client.config = require("./config.js");
client.config.defaultSettings = cloneDeep(client.config.defaultSettings);
client.dbl = new DBL(client.config.dbltoken, client);

require("./modules/functions.js")(client);

Object.assign(client, Enmap.multi(["tags", "blacklist", "testing"], {fetchAll: true, cloneLevel: "deep", ensureProps: true}));

client.once('ready', () => {
  client.settings = new Enmap({
    name: "settings",
    fetchAll: true,
    ensureProps: true,
    cloneLevel: 'none',
    // autoEnsure: {
    //   "cooldown": 2500,
    //   "prefixes": ["+"],
    //   "modLogChannel": "mod-log",
    //   "modRoles": ["Moderator"],
    //   "adminRoles": ["Administrator"]
    // },
    serializer: (data, key) => {
      if(!client.guilds.get(key)) return data;
      let converted;
      try {
        
        converted = {
          ...clone(data),
          modRoles: data.modRoles.map(role => role.id),
          adminRoles: data.adminRoles.map(role => role.id),
          modLogChannel: data.modLogChannel ? data.modLogChannel.id : null,
        };
      } catch (e) {
        console.log(`ERROR Converting ${key}`, e);
        console.log(data.adminRoles);
        converted = data;
      }
      return converted;
    },
    deserializer: (data, key) => {
      if(!client.guilds.get(key)) return data;
      let converted;
      try {
        converted = {
        ...data,
        modLogChannel: data.modLogChannel ? client.guilds.get(key).channels.get(data.modLogChannel) : null,
        adminRoles: data.adminRoles.map(roleId => client.guilds.get(key).roles.get(roleId)),
        modRoles: data.modRoles.map(roleId => client.guilds.get(key).roles.get(roleId)),
      };
      } catch(e) {
        console.log(`ERROR Converting ${key}`, e);
        console.log(data.adminRoles);
        converted = data;
      }
      return converted;
    },
  });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Set();

const init = async () => {

  const cmdFiles = await readdir("./commands/");
  client.log("log", `Loading a ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  const evtFiles = await readdir("./events/");
  client.log("log", `Loading a ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();