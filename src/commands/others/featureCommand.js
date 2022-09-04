const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SelectMenuBuilder, SelectMenuOptionBuilder, Embed, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Autres`,
        emoji: `🤖`
    },
    data: (new SlashCommandBuilder()
        .setName(`feature`)
        .setDescription(`Proposer une nouvelle fonctionnalité`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const modal = new ModalBuilder()
            .setCustomId(`feature-modal`)
            .setTitle(`Suggestion de nouvelle fonctionnalité`);

        const row1 = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId(`feature-name`)
                .setLabel(`Nom de la fonctionnalité`)
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId(`feature-desc`)
                .setLabel(`Description de la fonctionnalité`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
        );

        modal.addComponents(row1, row2);

        interaction.showModal(modal);

        const filter = (i) => i.user.id === interaction.user.id && i.customId === `feature-modal`;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120 * 000 });

        collector.on('collect', (i) => {
            console.log(i);
        });
    }
}