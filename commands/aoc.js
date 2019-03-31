const fetch = require("node-fetch");
const { Collection, RichEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => {
  if(message.settings.aocBoardCode === 'off') {
    return message.reply("Advent of Code disabled for this guild. Use `+set edit aocBoardCode your-code-here` to enable it.");
  }
  const opts = {
    headers: {
        cookie: 'session=53616c7465645f5fffbb06fd462adabf09d0589675f60a1f618f47971facaa7ebf5696b9f569365df29f561b199bf8b1'
    }
  };
  let data;
  try {
    data = await fetch(`https://adventofcode.com/2018/leaderboard/private/view/${message.settings.aocBoardCode}.json`, opts)
    .then(res => res.json());
  } catch (e) {
    return message.reply(`Error while fetching data: ${e}`);
  }
  const participants = new Collection(Object.entries(data.members));
  const sorted = participants.sort((a, b) => b.local_score - a.local_score);
  const top10 = sorted.array().splice(0, 10);
  // Now shake it and show it! (as a nice embed, too!)
  const embed = new RichEmbed()
    .setTitle("Advent of Code 2018 Leaderboard")
    .setURL(`https://adventofcode.com/2018/leaderboard/private/view/${message.settings.aocBoardCode}`)
    .setAuthor(client.user.username, client.user.avatarURL)
    .setDescription("Our top 10 points leaders!")
    .setColor(0x00AE86);
  for(const data of top10) {
    embed.addField(data.name || `Anonymous User ${data.id}`, `${data.local_score} points (${data.stars} stars)`);
  }
  return message.channel.send(embed);
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "aoc",
  category: "Miscelaneous",
  description: "Get the current leaderboard's top 10, or a specific user's position on the board.",
  usage: "aoc [@user]"
};
