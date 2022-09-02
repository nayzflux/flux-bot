const { PermissionFlagsBits } = require("discord.js");
const phisingLinks = require(`./badlinks.json`);
const warnManager = require(`../../managers/warnManager`);
const configManager = require(`../../managers/configManager`);

module.exports.handlePhisingProtection = async (client, message) => {
    const config = await configManager.getConfig(message.guild);

    if (!config?.automod?.phising?.enabled) return;

    const { member } = message;
    const permissions = member.permissions;
    const moderator = await message.guild.members.fetch(client.user.id);

    if (permissions.has(PermissionFlagsBits.Administrator) || permissions.has(PermissionFlagsBits.ManageMessages) || message.member.owner) {
        return;
    }

    for (const link of phisingLinks) {
        if (message.content.includes(link)) {
            warnManager.warn(member, moderator, `[AUTOMOD] Phising`);
            message.delete().catch(err => console.log(`❌ Impossible de supprimer le message`));
            return;
        }
    }
}