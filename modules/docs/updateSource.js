const fetch = require("node-fetch");
const fs = require("fs");
console.log("Fetching the Enmap source code from github....");

if (!fs.existsSync("./modules/docs/data")) fs.mkdirSync("./modules/docs/data");

fetch("https://raw.githubusercontent.com/eslachance/enmap/master/src/index.js")
  .then(res => res.text())
  .then(res => fs.writeFileSync("./modules/docs/data/enmap.js", res))
  .catch(console.error);
