const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = new Discord.Client();

client.config = require("./config.js");

require("./modules/functions.js")(client);

const Enmap = require("enmap");
const Provider = require("enmap-mongo");

// Persistent Maps
Object.assign(client, Enmap.multi(["settings", "tags", "blacklist", "langs", "testing"], Provider, { url: client.config.mongo }));

// Temporary maps
client.commands = new Enmap();
client.aliases = new Enmap();
client.cooldown = new Set();

const init = async () => {

  const cmdFiles = await readdir("./commands/");
  client.log("log", `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.watchCommand(f);
    if (response) console.log(response);
  });

  const evtFiles = await readdir("./events/");
  client.log("log", `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();
