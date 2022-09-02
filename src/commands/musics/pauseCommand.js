const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`pause`)
        .setDescription(`Mettre en pause la lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const isPaused = musicHelper.togglePause(guild.id);

        if (isPaused === null) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Il n'y a actuellement pas de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (!isPaused) {
            const unpaused = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`File de lecture en cours de lecture... ▶️`)

            return interaction.reply({ embeds: [unpaused] });
        } else {
            const paused = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`File de lecture en pause ⏸️`)

            return interaction.reply({ embeds: [paused] });
        }
    }
}