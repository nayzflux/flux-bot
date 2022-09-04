const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SelectMenuBuilder, SelectMenuOptionBuilder, Embed, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Autres`,
        emoji: `🤖`
    },
    data: (new SlashCommandBuilder()
        .setName(`bug`)
        .setDescription(`Signaler un bug/erreur`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const modal = new ModalBuilder()
            .setCustomId(`bug-modal`)
            .setTitle(`Signaler un bug/erreur`);

        const row1 = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId(`bug-desc`)
                .setLabel(`Décriver le bug`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId(`bug-redo`)
                .setLabel(`Comment reproduire le bug`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
        );

        modal.addComponents(row1, row2);

        interaction.showModal(modal);

        const filter = (i) => i.user.id === interaction.user.id && i.customId === `bug-modal`;

        const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 120 * 000 });

        collector.on('collect', (i) => {
            console.log(i);
        });
    }
}