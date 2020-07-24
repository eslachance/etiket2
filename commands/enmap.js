const fetch = require("node-fetch");

const findEmbed = require("../modules/docs/findEmbed");

const randos = [
  "The hell you think this is, the dictionary? I don't know everything, and certainly not `{word}`!",
  "`{word}`? `{word}`???? Since when was *that* an enmap feature?",
  "I'll have you know, punk, that I only do Enmap, and `{word}` is definitely not enmap!"
];

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!client.docsEnabled) return;
  if(args[0] === 'info') {
    const data = await fetch('https://api.npms.io/v2/package/enmap').then(r => r.json());
    const {
      metadata: {
        version,
        releases,
      },
      npm: {
        downloads,
        dependentsCount,
        starsCount: npmStars,
      },
      github: {
        starsCount: ghStars,
        forksCount,
        commits,
      }
    } = data.collected;
    const msgdata = `= Enmap Stats & Info =
• Current Version  :: ${version}
• Downloads        :: ${downloads.reduce( (c, a) => c + a.count, 0)}
• Releases         :: ${releases.reduce( (c, a) => c + a.count, 0)}
• Commits          :: ${commits.reduce( (c, a) => c + a.count, 0)}
• Stars            :: ${npmStars} (NPM), ${ghStars} (Github)

= Extra Data =
• Github Forks     :: ${forksCount}
• NPM Dependents   :: ${dependentsCount}
`;
    return message.channel.send(msgdata, {code: "asciidoc"});
  }
  const embed = findEmbed(args.join(" "));
  const m = await message.channel.send(embed ? ({ embed }) : randos.random().replace(/{word}/g, args.join(" ")));
  client.docResponses.set(message.id, m.id);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ed','enmapdocs'],
  permLevel: "User"
};

exports.help = {
  name: "enmap",
  category: "Miscelaneous",
  description: "Displays Enmap Documentation (Updated from Github)",
  usage: "enmap <query>"
};
