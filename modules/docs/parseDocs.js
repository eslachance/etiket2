const { RichEmbed } = require("discord.js");
const data = require("./data/apidocs.json");
const fs = require("fs");
const path = require("path");
console.log("Parsing the json file that jsdoc generated...");

// Parse all the methods and properties of Enmap
const docs = data.filter(x => !x.undocumented && x.scope !== "global" && x.kind !== "package").map(x => {
  const title = x.longname.replace("#", ".").replace(/\n/g, " ");
  const params = (x.params || []).map(p => `\`${p.optional ? `[${p.name}]` : p.name}\` ${p.type ? `**${p.type.names.join(" | ")}**` : ""}\n${p.description}`).join("\n\n");
  let returns = x.returns && x.returns[0] ? x.returns[0].type.names.join(" | ") : "void";
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

// Parse constructor options
const options = data.find(e => e.kind === "class" && e.classdesc)
  .params.filter(p => p.name.startsWith("options."));
const optionsEmbed = new RichEmbed()
  .setAuthor("Enmap Docs", "https://images-ext-1.discordapp.net/external/K8C97Vif-rsViQ7RXSCrzydUrFsxauKQ0DOhhf61xVI/%3Fgeneration%3D1529879273639085%26alt%3Dmedia/https/blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%252F-LFnuGgkksxzZuqQoImA%252Favatar.png", "https://enmap.evie.codes/api")
  .setTitle("Constructor Options")
  .setDescription(options.map(o => `${o.name} (${o.type.names.join(" | ")})`).join("\n"))
  .setColor("BLUE");

embeds.push({ name: "options", lname: "options", embed: optionsEmbed._apiTransform() });

for (const opt of options) {
  const embed = new RichEmbed()
    .setAuthor("Enmap Docs", "https://images-ext-1.discordapp.net/external/K8C97Vif-rsViQ7RXSCrzydUrFsxauKQ0DOhhf61xVI/%3Fgeneration%3D1529879273639085%26alt%3Dmedia/https/blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%252F-LFnuGgkksxzZuqQoImA%252Favatar.png", "https://enmap.evie.codes/api")
    .setTitle(opt.name)
    .setDescription(opt.description)
    .addField("Type", `\`${opt.type.names.join(" | ")}\``)
    .setColor("BLUE");

  embeds.push({ name: opt.name, lname: opt.name.toLowerCase(), embed: embed._apiTransform() });
}

// Parse the methods and properties inherited from the Map structure
[
  {
    name: "size",
    desc: "Returns the number of key/value pairs that are **cached**. If you would like the number of key/value pairs in the database, use enmap.count instead.",
    returns: "number"
  },
  {
    name: "keys",
    desc: "Returns a new Iterator object that contains the keys for each element in the Enmap object in insertion order.",
    returns: "Iterator"
  },
  {
    name: "values",
    desc: "Returns a new Iterator object that contains the values for each element in the Enmap object in insertion order.",
    returns: "Iterator"
  },
  {
    name: "entries",
    desc: "Returns a new Iterator object that contains an array of [key, value] for each element in the Enmap object in insertion order.",
    returns: "Iterator"
  },
  {
    name: "forEach",
    params: "`callbackFn` **(value, key, Enmap) => void**\nThe callback function that will be executed.\n\n`thisArg` *****\nOptional argument that will be used as `this` in the callback function.",
    desc: "Calls callbackFn once for each key-value pair present in the Enmap object, in insertion order. If a thisArg parameter is provided to forEach, it will be used as the this value for each callback."
  }
].forEach(x => {
  const embed = new RichEmbed()
    .setAuthor("Enmap Docs", "https://images-ext-1.discordapp.net/external/K8C97Vif-rsViQ7RXSCrzydUrFsxauKQ0DOhhf61xVI/%3Fgeneration%3D1529879273639085%26alt%3Dmedia/https/blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%252F-LFnuGgkksxzZuqQoImA%252Favatar.png", "https://enmap.evie.codes/api")
    .setTitle(`Enmap.${x.name}`)
    .setDescription(x.desc || "No description provided")
    .setColor("BLUE");
  if (x.params) embed.addField("Params", x.params);
  if (x.returns) embed.addField("Returns", x.returns);

  embeds.push({ name: x.name, lname: x.name.toLowerCase(), embed: embed._apiTransform() });
});

// Add warnings to the embeds if they depend on enmap cache
const toWarn = [
  "size",
  "keys",
  "values",
  "entries",
  "forEach",

  "array",
  "keyArray",
  "random",
  "randomKey",
  "findAll",
  "find",
  "findKey",
  "exists",
  "sweep",
  "filter",
  "filterArray",
  "partition",
  "map",
  "some",
  "every",
  "reduce",
  "clone",
  "equals"
];
embeds.map(e => {
  if (toWarn.includes(e.name)) {
    e.embed.description += "\n\n**Warning:** Depends on cache.";
  }
  return e;
});

fs.writeFileSync(path.resolve(__dirname, "./data/docs.json"), JSON.stringify(docs, null, 2));
fs.writeFileSync(path.resolve(__dirname, "./data/embeds.json"), JSON.stringify(embeds, null, 2));
console.log("Done! The docs command can now be used!");
