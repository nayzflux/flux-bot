const { PermissionFlagsBits } = require("discord.js");
const warnManager = require(`../../managers/warnManager`);
const configManager = require(`../../managers/configManager`);

const messagesCounter = new Map();

module.exports.handleSpamProtection = async (client, message) => {
    const { member } = message;
    const permissions = member.permissions;
    const moderator = await message.guild.members.fetch(client.user.id);

    const config = await configManager.getConfig(message.guild);

    if (!config?.automod?.flood?.enabled) return;

    if (permissions.has(PermissionFlagsBits.Administrator) || permissions.has(PermissionFlagsBits.ManageMessages) || message.member.owner) {
        return;
    }

    const messageCount = messagesCounter.get(member) || 0;

    // Spam detecté
    if (messageCount > 5) {
        messagesCounter.set(member, 0);

        // Supprimer les derniers messages
        warnManager.warn(member, moderator, `[AUTOMOD] Spam`);
        const lastMessages = await message.channel.messages.fetch({ limit: 20 });
        const userMessages = await lastMessages.filter(m => m.author.id === member.user.id);
        message.channel.bulkDelete(userMessages).catch(err => console.log(`❌ Impossible de supprimer les messages`));
    } else {
        messagesCounter.set(member, messageCount + 1);
    }

    // Retirer un message toutes 5 secondes
    setTimeout(() => {
        if (messagesCounter.get(member) > 0) {
            messagesCounter.set(member, (messagesCounter.get(member) - 1));
        }
    }, 10 * 1000);
}