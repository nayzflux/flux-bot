const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SelectMenuBuilder, SelectMenuOptionBuilder, Embed, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: (new ButtonBuilder()
        .setCustomId(`test-button`)
        .setLabel(`Test`)
        .setStyle(ButtonStyle.Primary)
    ),
    run: async (client, interaction) => {
        interaction.update({ content: `test` })
    }
}