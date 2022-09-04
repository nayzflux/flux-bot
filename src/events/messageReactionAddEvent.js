const reactionRoleManager = require(`../managers/reactionRoleManager`);

module.exports = {
    name: `messageReactionAdd`,
    run: async (client, reaction, user) => {
        if (!reaction.message.guild) return;
        if (user.bot) return;

        const reactionRole = await reactionRoleManager.getReactionRole(reaction.message, reaction.emoji);

        if (!reactionRole) return;

        const role = await reaction.message.guild.roles.fetch(reactionRole.roleId);

        if (!role) return;

        const member = await reaction.message.guild.members.fetch(user.id);

        member.roles.add(role)
            .then(() => console.log(`✅ ${role.name} donner à ${user.tag}`))
            .catch(err => console.log(`❌ Impossible de donner le rôle`));
    }
}