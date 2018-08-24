module.exports = async (client, error) => {
  client.log("error", `An error event was triggered by Discord.js: ${error.stack}`, "Client Error");
};
