exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.flags.length < 1) {
    const name = args[0];
    if (client.tags.has(`${message.guild.id}-${name}`)) {
      const tag = client.tags.get(`${message.guild.id}-${name}`);
      await message.channel.send(tag.content);
      return;
    }
  }

  const name = `${message.guild.id}-${args.shift()}`;
  const content = args.join(" ");

  let answer = [null, null];
  switch (message.flags[0]) {
    case "add":
      if (level < 2) {
        answer = [null, "🚫"];
        break;
      }
      if (client.tags.has(name)) {
        answer = ["That tag already exists."];
        break;
      }
      if (client.commands.has(name.split("-")[1]) || client.aliases.has(name.split("-")[1])) {
        answer = ["Cannot use command name or alias as a tag name."];
        break;
      }
      if (content.length < 1) {
        answer = ["Tag contents cannot be empty."];
        break;
      }
      client.tags.set(name, {
        name: name.replace(`${message.guild.id}-`, ""),
        content,
        guild: message.guild.id,
        author: message.author.id,
        lastmodified: new Date()
      });
      answer = [null, "☑"];
      break;
    case "del":
      if (level < 2) {
        answer = [null, "🚫"];
        break;
      }
      if (!client.tags.has(name)) {
        answer = ["Tag name not found", null];
        break;
      }
      client.tags.delete(name);
      answer = [null, "☑"];
      break;
    case "edit":
      if (level < 2) {
        answer = [null, "🚫"];
        break;
      }
      if (!client.tags.has(name)) {
        answer = ["Tag name not found", null];
        break;
      }
      if (content.length < 1) {
        answer = ["Tag contents cannot be empty."];
        break;
      }
      client.tags.set(name, content);
      answer = [null, "☑"];
      break;
    case "rename":
      if (level < 2) {
        answer = [null, "🚫"];
        break;
      }
      if (!client.tags.has(name)) {
        answer = ["Tag name not found", null];
        break;
      }
      const newName = content[0];
      const oldTag = client.tags.get(name);
      client.tags.set(newName, oldTag);
      client.tags.delete(name);
      answer = [null, "☑"];
      break;
    case "list":
    default:
      const taglist = client.tags.filter(t=>t.guild===message.guild.id).map(t=>`${client.getPrefix(message)}${t.name}`).join(" ");
      if (taglist.length < 1) answer = ["**There are no tags on this server.**", null];
      else answer = [`**\`List of Available Tags\`**\n\`\`\`${taglist}\`\`\``, null];
      break;
  }
  if (answer[0]) message.channel.send(answer[0]);
  if (answer[1]) message.react(answer[1]);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["tag"],
  permLevel: "User"
};

exports.help = {
  name: "tags",
  category: "Miscelaneous",
  description: "Tag display and management.",
  usage: "tags add name content ; tags del name ; tag edit name newcontent ; tag rename oldname newname ; tags list"
};
