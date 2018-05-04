exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  let answer = ["Error while processing blacklist command", null];
  switch (message.flags[0]) {
    case "add":
      let adduser = message.mentions.users.first() || client.users.get(args[0]);
      if (!adduser) adduser = await client.fetchUser(args[0]);
      if (!adduser) {
        answer = ["Either you didn't mention a user, or that user wasn't valid.", null];
        break;
      }
      const addkey = `${message.guild.id}-${adduser.id}`;
      if (client.blacklist.has(addkey)) {
        answer = ["That user is already blacklisted", null];
        break;
      }
      client.blacklist.set(`${message.guild.id}-${adduser.id}`, {
        user: adduser.id,
        guild: message.guild.id,
        time: message.createdTimestamp
      }); 
      answer = [null, "☑"];
      break;
    case "del":
      let deluser = message.mentions.users.first() || client.users.get(args[0]);
      if (!deluser) deluser = await client.fetchUser(args[0]);
      if (!deluser) {
        answer = ["Either you didn't mention a user, or that user wasn't valid.", null];
        break;
      }
      const delkey = `${message.guild.id}-${deluser.id}`;
      if (!client.blacklist.has(delkey)) {
        answer = ["User does not seem to be blacklisted", null];
        break;
      }  
      client.blacklist.delete(delkey);
      answer = [null, "☑"];
        
      break;
    default: 
      answer = [null, "⁉"];
  }
  if (answer[0]) message.channel.send(answer[0]);
  if (answer[1]) message.react(answer[1]);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "blacklist",
  category: "Moderation",
  description: "Managing Blacklist.",
  usage: "blacklist -add @user ; blacklist -del @user"
};
