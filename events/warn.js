module.exports = async (client, warning) => {
  client.log("warn", `A warning event was triggered by Discord.js: ${warning}`, "Client Warning");
};
