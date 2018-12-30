const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = new Discord.Client();
const { StatsD } = require("hot-shots");

client.config = require("./config.js");

require("./modules/functions.js")(client);

const Enmap = require("enmap");
Object.assign(client, Enmap.multi(["settings", "tags", "blacklist", "testing"]), {fetchAll: true, cloneLevel: "deep", ensureProps: true});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Set();

client.dogstats = new StatsD("localhost", 8125);

const init = async () => {

  const cmdFiles = await readdir("./commands/");
  client.log("log", `Loading a ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.watchCommand(f);
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
