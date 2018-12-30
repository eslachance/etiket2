const { RichEmbed } = require("discord.js");
const data = require("./data/apidocs.json");
const fs = require("fs");
console.log("Parsing the json file that jsdoc generated...");

const docs = data.filter(x => !x.undocumented && x.scope !== "global" && x.kind !== "package").map(x => {
  const title = x.longname.replace("#", ".").replace(/\n/g, " ");
  const params = (x.params || []).map(p => `\`${p.optional ? `[${p.name}]` : p.name}\` ${p.type ? `**${p.type.names.join(" | ")}**` : ""}\n${p.description}`).join("\n\n");
  let returns = x.returns && x.returns[0] ? x.returns[0].type.names.join(" | ").replace(/\*/g, "\\*") : "void";
  returns = `\`${returns}\``;
  if (x.returns && x.returns[0] && x.returns[0].description) returns += `  ${x.returns[0].description.replace(/\n/g, " ")}`;
  const examples = (x.examples || []).map(e => "```js\n" + e + "\n```").join("\n");

  return {
    name: x.name,
    kind: x.kind,
    scope: x.scope,
    desc: x.description.replace(/\n/g, " ").replace("<warn>", "\n\n").replace("</warn>", ""),
    returns,
    params,
    title,
    examples
  };
});

const embeds = docs.map(x => {
  const embed = new RichEmbed()
    .setAuthor("Enmap Docs", "https://images-ext-1.discordapp.net/external/K8C97Vif-rsViQ7RXSCrzydUrFsxauKQ0DOhhf61xVI/%3Fgeneration%3D1529879273639085%26alt%3Dmedia/https/blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%252F-LFnuGgkksxzZuqQoImA%252Favatar.png", "https://enmap.evie.codes/api")
    .setTitle(x.title)
    .setDescription(x.desc || "No description provided")
    .setColor("BLUE");
  if (x.params) embed.addField("Params", x.params);
  if (x.returns) embed.addField("Returns", x.returns);
  if (x.examples) embed.addField("Examples", x.examples);

  return {
    name: x.name,
    lname: x.name.toLowerCase(),
    embed: embed._apiTransform()
  };
});

fs.writeFileSync("./modules/docs/data/docs.json", JSON.stringify(docs, null, 2));
fs.writeFileSync("./modules/docs/data/embeds.json", JSON.stringify(embeds, null, 2));
console.log("Done! The docs command can now be used!");
