const configManager = require(`../managers/configManager`);

module.exports = {
    name: `guildMemberRemove`,
    run: async (client, member) => {
        const { guild } = member;

        const config = await configManager.getConfig(guild);

        // ======= MESSAGE ========
        if (config?.messages?.leave?.enabled && config?.messages?.leave?.channelId) {
            const channel = await guild.channels.fetch(config.messages.leave.channelId);

            if (channel) {
                const content = config.messages.leave.content || `👋 Aurevoir {USER_NAME} à bientôt sur {SERVER_NAME}`;
                channel.send({ content: content.replaceAll(`{SERVER_NAME}`, guild.name).replaceAll(`{USER_NAME}`, member) });
            }
        }
    }
}