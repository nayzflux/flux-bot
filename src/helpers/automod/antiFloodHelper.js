const { PermissionFlagsBits } = require("discord.js");
const configManager = require(`../../managers/configManager`);

const lastMessages = new Map();

module.exports.handleFloodProtection = async (client, message) => {
    const { member } = message;
    const permissions = member.permissions;

    const config = await configManager.getConfig(message.guild);

    if (!config?.automod?.flood?.enabled) return;

    if (permissions.has(PermissionFlagsBits.Administrator) || permissions.has(PermissionFlagsBits.ManageMessages) || message.member.owner) {
        return;
    }

    const lastMessage = lastMessages.get(member);

    // Flood detecté
    if (message.content === lastMessage) {
        message.delete().catch(err => console.log(`❌ Impossible de supprimer les messages`));
    }

    lastMessages.set(member, message.content)

    // Retirer un message toutes 5 secondes
    setTimeout(() => {
        if (lastMessages.get(member) === message.content) {
            lastMessages.delete(member);
        }
    }, 5 * 1000);
}