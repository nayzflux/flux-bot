const reactionRoleManager = require(`../managers/reactionRoleManager`);

module.exports = {
    name: `messageReactionRemove`,
    run: async (client, reaction, user) => {
        if (!reaction.message.guild) return;
        if (user.bot) return;

        const reactionRole = await reactionRoleManager.getReactionRole(reaction.message, reaction.emoji);

        if (!reactionRole) return;

        const role = await reaction.message.guild.roles.fetch(reactionRole.roleId);

        if (!role) return;

        const member = await reaction.message.guild.members.fetch(user.id);

        member.roles.remove(role)
            .then(() => console.log(`✅ ${role.name} retirer de ${user.tag}`))
            .catch(err => console.log(`❌ Impossible de retirer le rôle`));
    }
}