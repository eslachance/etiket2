// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

const Discord = require("discord.js");
const fetch = require("node-fetch");

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    if (message.flags[0] && message.flags[0] == "s") return;
    if(clean.length > 1900) {
      const res = await fetch("https://text.evie.codes/documents", {
        method: 'POST',
        headers: {
          'Content-Type': 'plain'
        },
        body: clean,
      }).then(r => r.json());
      if (res?.key) {
        message.channel.send(`\`Message too long, click for result:\`\n<https://text.evie.codes/${res.key}>`);
      } else {
        await message.channel.send(`Message too long, here's an exerpt:\n\`\`\`${clean.slice(0, 1500)}\`\`\``);
      }
    } else {
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);  
    }
  } catch (err) {
    const cleanErr = await client.clean(client, err);
    if(cleanErr.length > 1900) {
      const res = await fetch("https://text.evie.codes/documents", {
        method: 'POST',
        headers: {
          'Content-Type': 'plain'
        },
        body: cleanErr,
      }).then(r => r.json());
      if (res?.key) {
        message.channel.send(`\`Message too long, click for result:\`\n<https://text.evie.codes/${res.key}>`);
      } else {
        message.channel.send('Message too long and could not upload to hastebin.');
      }
    } else {
      message.channel.send(`\`\`\`js\n${cleanErr}\n\`\`\``);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner" // DON'T CHANGE THIS
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
