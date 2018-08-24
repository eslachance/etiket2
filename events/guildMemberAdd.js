// This event executes when a new guild (server) is joined.

module.exports = async (client, member) => {
  if(member.guild.id !== '260202843686830080') return;
  const role = member.guild.roles.get("481499302129172481");
  member.addRole(role);
};