const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = new Discord.Client();
const { StatsD } = require("hot-shots");

client.config = require("./config.js");

require("./modules/functions.js")(client);

const Enmap = require("enmap");
Object.assign(client, Enmap.multi(["settings", "tags", "blacklist", "testing"], {fetchAll: true, cloneLevel: "deep", ensureProps: true}));

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

// Disable the docs command if `npm run docs` isn't ran yet
const fs = require("fs");
fs.exists("./modules/docs/data", res => {
  client.docsEnabled = res;
  if (!res) console.warn("[log] [Warn]The docs command is disabled, please run `npm i -g jsdoc` and `npm run docs` to enable the command");
});

// Needed for the messageUpdate and messageDelete support of the docs commmand
client.docResponses = new Map();
// Make sure client.docResponses doesn't eat more and more memory, until the bot crashes
const cachInterval = 2*60*60*1000;
let cache = [];
let bool = true;
setInterval(() => {
  if (bool) cache = [...client.docResponses.keys()];
  else cache.forEach(c => client.docResponses.delete(c));
  bool = !bool;
}, cachInterval);
