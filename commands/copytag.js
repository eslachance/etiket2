exports.run = async (client, message, [serverid, tagname], level) => {// eslint-disable-line no-unused-vars
  const msg = await message.channel.send(`Copying ${tagname} from ${serverid}...`);
  if(!client.guilds.has(serverid)) return msg.edit(`I'm not in the guild ${serverid}!`);
  const tagkey = `${serverid}-${tagname}`;
  if(!client.tags.has(tagkey)) return msg.edit(`I could not find the tag ${tagname} in ${serverid} (${tagkey})`);
  const tag = client.tags.get(tagkey);
  tag.guild = message.guild.id;
  client.tags.set(`${tag.guild}-${tag.name}`, tag);
  msg.edit(`Successfully imported ${tagname} from ${client.guilds.get(tag.guild).name}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ct'],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "copytag",
  category: "System",
  description: "Copy a tag from another server.",
  usage: "copytag serverid tagname"
};
