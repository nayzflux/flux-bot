const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`clear`)
        .setDescription(`Supprimer la file de lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const isCleared = musicHelper.clearQueue(guild.id);

        if (isCleared === null) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Il n'y a actuellement pas de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (isCleared) {
            const paused = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`File de lecture en supprimé 🗑️`)

            return interaction.reply({ embeds: [paused] });
        }
    }
}