exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const flags = ['search', 'add', 'delete', 'edit', 'rename', 'all', 'cleanup', 'list'];
  if (flags.includes(args[0])) {
    message.flags.push(args.shift());
  }

  if (message.flags.length < 1) {
    const name = args[0];
    if (client.tags.has(`${message.guild.id}-${name}`)) {
      const tag = client.tags.get(`${message.guild.id}-${name}`);
      const options = tag.attachment ? { attachment: tag.attachment } : null;
      await message.channel.send(tag.content, options);
      return;
    }
  }
  const tagName = args[0];
  const name = `${message.guild.id}-${args.shift()}`;
  const content = args.join(" ");

  let answer = [null, null];
  switch (message.flags[0]) {
    case "search":
      let foundTags;
      if(level > 4) {
        foundTags = client.tags.filter(tag => tag.name.includes(tagName));
      } else {
        foundTags = client.tags.filter(tag => {
          return tag.guild === message.guild.id && tag.name.includes(tagName);
        });
      }
      answer = [foundTags.size > 0 && foundTags.map(tag => `${tag.name}${level > 4 && ` in ${tag.guild}`} (by ${tag.author})`).join("\n"), foundTags.size > 0 ? null : "⁉"];
      break;
    case "add":
      if (level < 2) {
        answer = [null, "🚫"];
        break;
      }
      if (client.tags.has(name)) {
        answer = ["That tag already exists."];
        break;
      }
      if (client.commands.has(tagName) || client.aliases.has(tagName)) {
        answer = ["Cannot use command name or alias as a tag name."];
        break;
      }
      if (content.length < 1 && message.attachments.size === 0) {
        answer = ["You must provide text, an attachment, or both!"];
        break;
      }
      const attachment = message.attachments.size > 0 ? message.attachments.first().proxyURL : false;
      client.tags.set(name, {
        name: name.replace(`${message.guild.id}-`, ""),
        content,
        ...(attachment ? { attachment } : {}),
        guild: message.guild.id,
        author: message.author.id,
        lastmodified: Date.now()
      });
      answer = [null, "☑"];
      break;
    case "del":
    case "remove":
    case "delete":
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
      client.tags.setProp(name, "content", content);
      client.tags.setProp(name, "lastModified", Date.now());
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
      const newName = `${message.guild.id}-${content.split(" ")[0]}`;
      const oldTag = client.tags.get(name);
      client.tags.set(newName, oldTag);
      client.tags.set(newName, Date.now(), "lastModified");
      client.tags.set(newName, content.split(" ")[0], "name");
      client.tags.delete(name);
      answer = [null, "☑"];
      break;
    case "all":
      if(level < 5) {
        answer = [null, "🚫"];
        break;
      }
      const listall = client.tags.keyArray();
      answer = [`\`\`\`${listall.join("\n")}\`\`\``, null];
      break;
    case "cleanup":
      if(level < 5) {
        answer = [null, "🚫"];
        break;
      }
      const previousSize = client.tags.size;
      client.tags.forEach(tag => {
        if(!client.guilds.has(tag.guild)) client.tags.delete(`${tag.guild}-${tag.name}`);
      });
      answer = [`Cleaned up ${client.tags.size - previousSize} tags.`];
      break;
    case "source":
      if (!client.tags.has(name)) {
        answer = ["Tag name not found", null];
        break;
      }
      const source = client.tags.get(name, "content");
      answer = [`\`Source for ${name}:\`\n\`\`\`${source.replace(/`/g, "\\`")}\`\`\``, null];
      break;
    case "list":
    default:
      const taglist = client.tags
        .filter(t=>t.guild===message.guild.id)
        .map(t=>`${client.getPrefix(message)}${t.name}`)
        .sort()
        .join(" ");
      if (taglist.length < 1) answer = ["**There are no tags on this server.**", null];
      else answer = [`**\`List of Available Tags\`**\n\`\`\`${taglist}\`\`\``, null];
      break;
  }
  if (answer[0]) message.channel.send(answer[0], {split: true});
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
