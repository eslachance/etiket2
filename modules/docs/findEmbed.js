const { RichEmbed } = require("discord.js");

module.exports = (query) => {
  const embeds = require("./data/embeds.json");
  query = query.toLowerCase();
  const found = embeds.find(e => e.lname === query);
  if (found) return found.embed;
  const search = embeds.find(e => e.lname.includes(query) || query.includes(e.lname));
  if (!search) return null;
  const embed = new RichEmbed()
    .setAuthor("Enmap Docs", "https://images-ext-1.discordapp.net/external/K8C97Vif-rsViQ7RXSCrzydUrFsxauKQ0DOhhf61xVI/%3Fgeneration%3D1529879273639085%26alt%3Dmedia/https/blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%252F-LFnuGgkksxzZuqQoImA%252Favatar.png", "https://enmap.evie.codes/api")
    .setDescription(`Search better next time!\nDid you mean **${search.name}**?`);
  return embed;
};
