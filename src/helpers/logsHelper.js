const { EmbedBuilder, Colors } = require("discord.js");
const configManager = require(`../managers/configManager`);

module.exports.logs = async (guild, action, color) => {
    const config = await configManager.getConfig(guild);

    if (!config) return;
    if (!config.logs) return;
    if (!config.logs.enabled) return;
    if (!config.logs.channelId) return;

    const channel = await guild.channels.fetch(config.logs.channelId);

    if (!channel) return;

    const logsEmbed = new EmbedBuilder()
        .setColor(color)
        .setDescription(action)
        .setTimestamp();

    channel.send({ embeds: [logsEmbed] });
}