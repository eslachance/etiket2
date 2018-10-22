// This event executes when a new guild (server) is joined.

module.exports = async (client, member) => {
  if(member.guild.id !== '260202843686830080') return;
  /*const role = member.guild.roles.get("481499302129172481");
  member.addRole(role);
  setTimeout( () => {
    //member.removeRole(role).catch(() => {});
    console.log(`Checking if ${member.user.tag} still has the role...`);
    if(member.roles.has(role.id)) {
      console.log("Yup, still have it.");
      member.kick().catch((err) => console.log(err));
    }
  }, 600000);*/
};